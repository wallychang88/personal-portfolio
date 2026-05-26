// Decap CMS OAuth bridge for GitHub, deployed on Cloudflare Workers.
//
// Enables the production /admin/ on this site to authenticate users via
// GitHub and obtain an access token, without standing up a server.
// The Next.js site is `output: 'export'` (static), so Vercel Functions
// are unavailable — hence the off-platform Worker.
//
// Routes:
//   GET /auth      → redirects to GitHub's OAuth authorize endpoint
//   GET /callback  → exchanges the code for a token, posts it back to Decap
//
// Wired into Decap via `backend.base_url` in public/admin/config.yml.

export interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  STATE_SECRET: string;
  ALLOWED_ORIGIN: string;
}

const GITHUB_AUTHORIZE = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN = "https://github.com/login/oauth/access_token";
const STATE_COOKIE = "decap_oauth_state";
const PROVIDER = "github";

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    switch (url.pathname) {
      case "/auth":
        return handleAuth(req, env);
      case "/callback":
        return handleCallback(req, env);
      case "/":
        return new Response("Decap OAuth bridge — see /auth\n", { status: 200 });
      default:
        return new Response("Not found", { status: 404 });
    }
  },
};

async function handleAuth(req: Request, env: Env): Promise<Response> {
  const url = new URL(req.url);
  const provider = url.searchParams.get("provider") ?? PROVIDER;
  if (provider !== PROVIDER) {
    return new Response(`Only ${PROVIDER} provider supported`, { status: 400 });
  }

  const nonce = crypto.randomUUID();
  const sig = await hmac(env.STATE_SECRET, nonce);
  const state = `${nonce}.${sig}`;

  const redirectUri = `${url.origin}/callback`;
  const authUrl = new URL(GITHUB_AUTHORIZE);
  authUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", "repo,user");
  authUrl.searchParams.set("state", state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authUrl.toString(),
      "Set-Cookie": `${STATE_COOKIE}=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  });
}

async function handleCallback(req: Request, env: Env): Promise<Response> {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const stateParam = url.searchParams.get("state");

  if (!code || !stateParam) {
    return errorPage("Missing code or state");
  }

  const cookies = parseCookies(req.headers.get("cookie") ?? "");
  const cookieState = cookies[STATE_COOKIE];
  if (!cookieState || cookieState !== stateParam) {
    return errorPage("State mismatch — cookie missing or tampered");
  }
  const [nonce, sig] = stateParam.split(".");
  if (!nonce || !sig || !(await verifyHmac(env.STATE_SECRET, nonce, sig))) {
    return errorPage("Invalid state signature");
  }

  const tokenRes = await fetch(GITHUB_TOKEN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "decap-oauth-bridge",
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  if (!tokenRes.ok) {
    return errorPage(`Token exchange failed: ${tokenRes.status} ${await tokenRes.text()}`);
  }
  const tokenData = (await tokenRes.json()) as { access_token?: string; error?: string; error_description?: string };
  if (!tokenData.access_token) {
    return errorPage(tokenData.error_description ?? tokenData.error ?? "No access_token returned");
  }

  return new Response(renderCallbackHtml(tokenData.access_token, env.ALLOWED_ORIGIN), {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Set-Cookie": `${STATE_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
    },
  });
}

function renderCallbackHtml(token: string, allowedOrigin: string): string {
  const payload = JSON.stringify({ token, provider: PROVIDER });
  // Decap handshake:
  //   1. Popup posts "authorizing:github" to opener (origin "*" — opener's
  //      origin not yet known).
  //   2. Opener replies; popup reads e.origin from the reply.
  //   3. Popup posts "authorization:github:success:<json>" back to opener,
  //      but only if e.origin matches ALLOWED_ORIGIN (defence in depth).
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>Authorizing…</title></head>
<body>
  <p>Authorizing… you can close this window if it doesn't close automatically.</p>
  <script>
    (function () {
      var allowedOrigin = ${JSON.stringify(allowedOrigin)};
      var message = 'authorization:${PROVIDER}:success:' + ${JSON.stringify(payload)};
      function receive(e) {
        if (e.origin !== allowedOrigin) return;
        e.source.postMessage(message, e.origin);
        window.removeEventListener('message', receive, false);
      }
      window.addEventListener('message', receive, false);
      if (window.opener) {
        window.opener.postMessage('authorizing:${PROVIDER}', '*');
      } else {
        document.body.innerHTML = '<p>No opener window. Auth flow must start from /admin/.</p>';
      }
    })();
  </script>
</body></html>`;
}

function errorPage(msg: string): Response {
  return new Response(
    `<!doctype html><html><body><h1>Auth error</h1><pre>${escapeHtml(msg)}</pre></body></html>`,
    { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function parseCookies(header: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const pair of header.split(";")) {
    const [k, ...v] = pair.trim().split("=");
    if (k) out[k] = decodeURIComponent(v.join("="));
  }
  return out;
}

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function verifyHmac(secret: string, data: string, sig: string): Promise<boolean> {
  const expected = await hmac(secret, data);
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}
