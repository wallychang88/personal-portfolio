# decap-oauth bridge

Tiny Cloudflare Worker that brokers GitHub OAuth for the production
`/admin/` (Decap CMS) on this site.

The Next.js site uses `output: 'export'`, so Vercel Functions are off
the table — Decap needs a server somewhere to keep the GitHub
`client_secret` off the client. ~150 lines of TS does it.

## Deploy

```bash
cd tools/decap-oauth
pnpm install               # installs @cloudflare/workers-types, typescript
wrangler login             # interactive — opens browser
wrangler deploy            # publishes the Worker; prints the URL

# One-time secret setup (each prompts for a value):
wrangler secret put GITHUB_CLIENT_ID       # from the GitHub OAuth App
wrangler secret put GITHUB_CLIENT_SECRET   # one-time view in GitHub
wrangler secret put STATE_SECRET           # any random 32+ char string

wrangler deploy            # redeploy so the Worker picks up the secrets
```

## GitHub OAuth App

At <https://github.com/settings/developers> → OAuth Apps → New OAuth App:

| Field | Value |
| --- | --- |
| Application name | Decap CMS — personal-portfolio |
| Homepage URL | https://wallychang88.com |
| Authorization callback URL | `<worker URL>/callback` (from `wrangler deploy` output) |

Save → copy Client ID. Generate a new client secret → copy immediately
(GitHub only shows it once). Feed both into the `wrangler secret put`
commands above.

## How it works

```
[/admin/ on site]
  ↓ Decap opens popup at <worker>/auth?provider=github
[/auth]
  ↓ 302 to github.com/login/oauth/authorize with HMAC-signed state cookie
[GitHub user authorizes]
  ↓ redirects to <worker>/callback?code=...&state=...
[/callback]
  ↓ verifies state, exchanges code for access_token, returns HTML
[popup]
  ↓ postMessages 'authorization:github:success:<json>' to opener (origin-checked)
[/admin/]
  ↓ uses token to commit straight to wallychang88/personal-portfolio
[GitHub push]
  ↓ Vercel auto-deploys
```

## Security notes

- The Client ID, Client Secret, and STATE_SECRET all live as Wrangler
  Secrets — not in this repo. `wrangler.toml` only has the public
  `ALLOWED_ORIGIN`.
- State cookie is HMAC-signed (SHA-256) and 10-minute scoped; the
  callback rejects mismatched or unsigned states.
- The callback HTML only relays the token to a window opener whose
  origin matches `ALLOWED_ORIGIN`. Add custom domains to that var if
  you set them.
- `repo,user` is the requested OAuth scope — Decap needs full repo
  access to read/write content files. To narrow, fork Decap and reduce
  the requested scope on the GitHub side.

## When to update

- **Custom domain added**: bump `ALLOWED_ORIGIN` in `wrangler.toml` and
  redeploy, AND add the new origin to the GitHub OAuth App's homepage.
- **Repo moved/renamed**: no Worker change needed (it just brokers
  tokens) — but the Decap config in `public/admin/config.yml` does.
- **Token format changes (unlikely)**: bump the `Accept:
  application/json` header on the token exchange.
