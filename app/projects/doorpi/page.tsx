import type { Metadata } from 'next';
import { ArticleShell } from '@/components/article-shell';

export const metadata: Metadata = {
  title: 'doorpi — Wally Chang',
  description:
    'A passive face-ID + peace-sign door unlock built with a Raspberry Pi, an ESP32, and a face-recognition stack. Notes on V4L2, bandwidth, and an auto-exposure controller that survives backlight.',
};

export default function DoorpiPage() {
  return (
    <ArticleShell
      kicker="Project · Spring 2026"
      title="A door that knows my face and waits for a peace sign."
      dek="The computer vision was the easy part. The hard parts were V4L2 quirks, the Pi Zero’s anemic radio, and an auto-exposure controller that wouldn’t punish backlit visitors."
      meta="Apr 2026 · ~12 min read · github.com/wallychang88/doorpi"
      tags={['Raspberry Pi', 'ESP32', 'FastAPI', 'MediaPipe', 'Computer vision']}
    >
      <p className="drop-cap">
        My apartment building has a door-release button about an inch tall, mounted
        on the inside of the vestibule, on a wall I cannot reach from outside. To
        get in I had to either dig out a key or call someone upstairs and feel
        like an intruder while I waited. I am not a hardware engineer. I built
        doorpi anyway.
      </p>

      <p>
        At a sentence: a Raspberry Pi Zero 2 W streams camera frames from my
        door’s vestibule to a small Mac mini sitting in my apartment. The Mac
        runs face recognition and MediaPipe gesture detection. When it sees a
        face it knows and the visitor holds up a peace sign, it tells an ESP32
        on the other end of the WiFi network to swing a servo against that
        inch-tall button. A web portal at a Tailscale URL lets me see the live
        feed and unlock manually from a phone. If someone unknown loiters for
        twelve seconds, every subscriber gets a snapshot in their inbox.
      </p>

      <p>
        That’s the marketing copy. The actual project is six months of arguments
        with the Linux video subsystem, three rewrites of an auto-exposure
        controller, and a long education in the difference between &quot;works in
        the kitchen&quot; and &quot;works at three in the afternoon when the sun
        is hitting the door at exactly the wrong angle.&quot;
      </p>

      <h2>The architecture, and why it’s split this way</h2>

      <p>
        There are three machines in the system. The Pi captures frames; the Mac
        does the heavy ML work; the ESP32 turns one boolean into one servo
        sweep. The Pi is not in the unlock path — the Mac talks directly to the
        ESP32, so even if the Pi dies, remote unlocking from a phone still
        works. The ESP32 is not in the analysis path — even if my Mac is
        rebooting, the Pi keeps streaming, and the portal can still be hit
        directly. Each box has one job; each can fail without taking the
        others with it.
      </p>

      <p>
        I picked the Pi Zero 2 W because it costs $15 and fits behind a peephole.
        I picked the Mac because face recognition on an Intel laptop runs at
        50–80% of one core in active mode, and I happened to have a 2015 MacBook
        with no battery left to lose. I picked the ESP32 because it has WiFi,
        thirty GPIO pins, and an Arduino IDE I could spell.
      </p>

      <h2>The Pi’s job is harder than it looks</h2>

      <p>
        The Pi captures from a Logitech C920x USB webcam via V4L2 and POSTs
        JPEG frames to the Mac. That sounds boring. It is not. Every time the
        Mac responds to a frame, it piggybacks a set of headers telling the Pi
        what to do next: the target FPS, the target resolution, the target JPEG
        quality, and the target manual exposure value. The Pi applies those
        targets on the next iteration. Old Pi plus new server, and new Pi plus
        old server, both degrade gracefully because the headers are optional.
      </p>

      <p>
        Why the dance? Because the Pi Zero 2 W is single-stream 802.11n in a
        dense SF RF environment, sustained goodput is 8–15 Mbps with
        100–400 ms retransmit tails, and 720p at 20 fps overruns the radio
        before it overruns anything else. Idle is{' '}
        <code>848×480 @ 5 fps</code>; active (someone’s watching, or motion is
        in frame, or someone’s loitering) is <code>848×480 @ 20 fps</code>.
        Same resolution, just FPS — because I learned the expensive way that
        changing capture resolution calls <code>VIDIOC_S_FMT</code>, which
        resets the C920’s auto-exposure state and triggers a 1–3 second
        re-bootstrap. So I leave resolution alone and ramp only what’s cheap
        to ramp.
      </p>

      <blockquote>
        The dominant glass-to-glass latency in the portal turned out not to be
        the network. It was V4L2’s default four-deep ring buffer. With
        <code> CAP_PROP_BUFFERSIZE=1</code>, <code>cap.read()</code> returns
        the freshest queued frame. Without it, you get the oldest, which at
        5 fps idle is 800 ms of driver-side staleness before a single packet
        leaves the Pi.
      </blockquote>

      <h2>The auto-exposure rewrite</h2>

      <p>
        The first version of doorpi recognized my face perfectly at night.
        Then it became spring. The sun started hitting the door directly at
        14:30 every afternoon, and suddenly the camera’s native auto-exposure
        was metering for a bright sky and rendering everyone’s face as a
        silhouette. Face recognition needs to see faces. I needed to teach
        the system how to see one.
      </p>

      <p>
        Three rewrites later, the controller has a shape I’m actually willing
        to defend. The headline ideas:
      </p>

      <h3>1. Use percentiles, not means.</h3>

      <p>
        Mean-Y is wrong for bimodal scenes. A backlit visitor in front of a
        bright sky reads mean-Y ≈ 130 while the sky pixels are saturating at
        255. The controller meters the face ROI at the 80th percentile of the
        luma channel, and it guards the scene by checking{' '}
        <code>scene_clip_frac</code> — the fraction of pixels at Y≥250.
        Mean-Y as a step-up guard let peak blowout slip past it on a real
        recording; clip-frac caught the same scene cleanly.
      </p>

      <h3>2. Camera native auto first.</h3>

      <p>
        Earlier versions tried to second-guess the C920’s native auto-exposure
        from any mode. This produced a fast flap loop: the controller would
        force a step-down, the camera would unwind it, the controller would
        force it again. The fix was layered: leave native auto alone in
        normal scenes, switch to manual stepping only when the face is dark
        AND the scene has highlight headroom, and only trigger scene-emergency
        rescue when the controller itself is in manual mode and the scene is
        clipping.
      </p>

      <h3>3. Lift the face in software, not the scene in hardware.</h3>

      <p>
        For installs where backlight is permanent — like mine — there is no
        camera exposure that gives you a non-silhouetted face without blowing
        out the sky. The answer is to leave the camera alone and apply CLAHE
        to the L channel of the LAB colorspace before the face detector sees
        the image. The same operation runs on enrolled face images, so the
        embeddings stay symmetric. The user-visible MJPEG stream is untouched;
        only the recognition pipeline sees the lifted pixels. Cost is about
        one millisecond per recognition call.
      </p>

      <h2>The loiter detector wanted to be smarter than it was</h2>

      <p>
        Version one of the loiter alert was a motion-blob detector with a
        twelve-second timer. It fired on every passing car. Version two
        gated on EfficientDet-Lite0 person detection, but the bbox size of a
        person varies by an order of magnitude depending on whether they’re
        at the door or across the street. A 20%-height face means someone is
        leaning at the door. A 20%-height person means someone is walking on
        the far sidewalk.
      </p>

      <p>
        Version three has two thresholds — one for face bbox, one for person
        bbox — and a gate ROI polygon that anchors each detection at its
        bottom-center. It accumulates qualifying time only across frames whose
        delta is ≤0.5 seconds, so brief detector dropouts don’t inflate the
        timer. And a per-identity cooldown means Alice loitering at noon
        doesn’t silence Bob loitering at 12:02.
      </p>

      <p>
        Almost every line of that paragraph is a bug I shipped at least once.
      </p>

      <h2>What I’d tell someone starting</h2>

      <p>
        The most useful thing I built wasn’t the recognition pipeline or the
        exposure controller. It was a synthetic probe running on a second
        Tailscale node that hits the public URL every 15 minutes, verifies a
        multipart boundary plus a JPEG start marker, and posts a beacon back
        to the server. 672 samples a week is the difference between &quot;the
        site sometimes feels slow&quot; and &quot;the 95th-percentile first-
        frame time is 1.4s and it’s the TLS handshake.&quot; Build the
        thing that tells you the truth before you build the thing that
        does the work.
      </p>

      <hr />

      <p>
        Repo:{' '}
        <a
          href="https://github.com/wallychang88/doorpi"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/wallychang88/doorpi
        </a>
        . MIT-licensed. The README is the operational manual; this page is the
        story.
      </p>
    </ArticleShell>
  );
}
