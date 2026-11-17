"use client";

import { useEffect, useRef } from "react";

// Two procedural hands drawn as ASCII on the black hero: a reaching hand on the left and a
// pointing hand on the right. Each hand is a set of tapered capsules (arm, palm, finger
// joints, thumb) combined into one smooth signed-distance field. Every frame the field is
// sampled on a 5x8px character grid; distance and light pick the glyph. Motion: the wrists
// sway and bob, the hands slowly roll around their long axis and the fingers flex. Glyphs
// shimmer a few times a second. Runs on every animation frame (60/120 Hz), pauses off
// screen, and draws one still frame with prefers-reduced-motion.

const CW = 5; // character cell width (px)
const CH = 8; // character cell height (px)
const FONT = 'bold 8px ui-monospace, Menlo, "SF Mono", Consolas, monospace';
const RAMP = " .,:;-=+*xs$VWM#@"; // dark -> bright (white on black)

type Finger = { off: number; len: number[]; r: number; fan: number };
type Spec = {
  handAngle: number; // direction the hand points
  armAngle: number; // direction from the wrist toward the elbow
  curlSide: 1 | -1;
  curls: number[][]; // per finger, per joint
  thumbCurl: number[];
  fingers: Finger[];
};

const FINGERS: Finger[] = [
  { off: -21, len: [40, 25, 18], r: 7.5, fan: -0.14 },
  { off: -7, len: [45, 29, 19], r: 8, fan: -0.02 },
  { off: 7, len: [41, 26, 18], r: 7.2, fan: 0.1 },
  { off: 20, len: [32, 20, 15], r: 6.2, fan: 0.24 },
];

// Left: open, softly reaching hand.
const REACH: Spec = {
  handAngle: 0.55,
  armAngle: Math.PI + 0.42,
  curlSide: 1,
  curls: [
    [0.08, 0.14, 0.1],
    [0.2, 0.28, 0.22],
    [0.34, 0.42, 0.32],
    [0.48, 0.52, 0.38],
  ],
  thumbCurl: [0.12, 0.1],
  fingers: FINGERS,
};

// Right: pointing hand, index straight, other fingers curled in.
const POINT: Spec = {
  handAngle: Math.PI + 0.3,
  armAngle: 0.6,
  curlSide: -1,
  curls: [
    [0.02, 0.04, 0.02],
    [0.85, 0.8, 0.6],
    [0.95, 0.85, 0.62],
    [1.05, 0.9, 0.62],
  ],
  thumbCurl: [0.4, 0.32],
  fingers: FINGERS,
};

type Capsule = { ax: number; ay: number; ar: number; bx: number; by: number; br: number; x0: number; x1: number; y0: number; y1: number };

function capsule(a: number[], b: number[]): Capsule {
  const pad = Math.max(a[2], b[2]) + 12;
  return {
    ax: a[0], ay: a[1], ar: a[2], bx: b[0], by: b[1], br: b[2],
    x0: Math.min(a[0], b[0]) - pad, x1: Math.max(a[0], b[0]) + pad,
    y0: Math.min(a[1], b[1]) - pad, y1: Math.max(a[1], b[1]) + pad,
  };
}

// Thickness boost on top of the base scale: arms and palms a lot, fingers a little.
const ARM_THICK = 1.35;
const FINGER_THICK = 1.15;

// Builds the hand for one frame as capsules in screen space.
function buildHand(spec: Spec, wx: number, wy: number, s: number, roll: number, t: number): Capsule[] {
  const sa = s * ARM_THICK; // radius scale for arm and palm
  const sf = s * FINGER_THICK; // radius scale for fingers and thumb
  const cr = Math.cos(roll);
  const thick = 0.5 + 0.5 * Math.abs(cr);
  const hx = Math.cos(spec.handAngle);
  const hy = Math.sin(spec.handAngle);
  const px = -hy * spec.curlSide;
  const py = hx * spec.curlSide;
  const at = (a: number, b: number) => [wx + (hx * a + px * b) * s, wy + (hy * a + py * b) * s];
  const ax = Math.cos(spec.armAngle);
  const ay = Math.sin(spec.armAngle);
  const arm = (k: number, r: number) => [wx + ax * k * s, wy + ay * k * s, r * sa];

  const chains: number[][][] = [
    [arm(620, 26), arm(300, 28), arm(130, 24), arm(45, 19), [wx, wy, 16.5 * sa]],
    [[wx, wy, 16.5 * sa], [...at(18, 1), 22 * sa], [...at(46, 2), 30 * thick * sa], [...at(96, 0), 27 * thick * sa]],
  ];

  spec.fingers.forEach((f, i) => {
    const base = at(96, f.off * cr);
    const chain = [[base[0], base[1], f.r * sf]];
    let ang = f.fan;
    let x = base[0];
    let y = base[1];
    f.len.forEach((len, j) => {
      const flex = 1 + 0.14 * Math.sin(0.8 * t + roll + 0.9 * i);
      ang += spec.curls[i][j] * flex;
      const dx = hx * Math.cos(ang) + px * Math.sin(ang) * cr;
      const dy = hy * Math.cos(ang) + py * Math.sin(ang) * cr;
      x += dx * len * s;
      y += dy * len * s;
      chain.push([x, y, f.r * (1 - 0.13 * (j + 1)) * sf]);
    });
    chains.push(chain);
  });

  const tb = at(34, -24 * cr);
  const thumb = [[tb[0], tb[1], 11.5 * sf]];
  let ta = -0.55;
  let tx = tb[0];
  let ty = tb[1];
  [38, 30].forEach((len, j) => {
    ta += spec.thumbCurl[j];
    const dx = hx * Math.cos(ta) - px * Math.sin(ta) * cr;
    const dy = hy * Math.cos(ta) - py * Math.sin(ta) * cr;
    tx += dx * len * s;
    ty += dy * len * s;
    thumb.push([tx, ty, (10 - 2.2 * j) * sf]);
  });
  chains.push(thumb);

  const caps: Capsule[] = [];
  for (const c of chains) for (let i = 1; i < c.length; i++) caps.push(capsule(c[i - 1], c[i]));
  return caps;
}

function sdCapsule(c: Capsule, x: number, y: number) {
  const ex = c.bx - c.ax;
  const ey = c.by - c.ay;
  const l2 = ex * ex + ey * ey || 1;
  const h = Math.min(1, Math.max(0, ((x - c.ax) * ex + (y - c.ay) * ey) / l2));
  const dx = x - (c.ax + ex * h);
  const dy = y - (c.ay + ey * h);
  return Math.sqrt(dx * dx + dy * dy) - (c.ar + (c.br - c.ar) * h);
}

// Smooth union of all capsules (k = blend radius in px).
function field(caps: Capsule[], x: number, y: number, k: number) {
  let d = Infinity;
  for (const c of caps) {
    if (x < c.x0 || x > c.x1 || y < c.y0 || y > c.y1) continue;
    const e = sdCapsule(c, x, y);
    if (d === Infinity) d = e;
    else {
      const hk = Math.max(k - Math.abs(d - e), 0) / k;
      d = Math.min(d, e) - hk * hk * k * 0.25;
    }
  }
  return d;
}

function hash(a: number, b: number) {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

export function AsciiHands() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let anchorY = 0;
    let mobile = false;
    let raf = 0;
    let running = false;

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = FONT;
      ctx.textBaseline = "top";
      ctx.fillStyle = "#ffffff";
      mobile = width < 768;
      const h1 = canvas.parentElement?.querySelector("h1");
      anchorY = h1 ? h1.getBoundingClientRect().top - rect.top + h1.getBoundingClientRect().height * 0.55 : height * 0.4;
    };

    const hands = [
      { spec: REACH, dir: 1, phase: 0, side: 0.1, dy: -20 },
      { spec: POINT, dir: -1, phase: 1.7, side: 0.93, dy: 50 },
    ];

    const draw = (ms: number) => {
      const t = ms / 1000;
      ctx.clearRect(0, 0, width, height);
      // Same idea as the reference: the hands scale with the viewport width.
      const s = mobile ? Math.max(0.55, width / 700) : Math.min(2, Math.max(0.85, width / 1000));
      const tick = Math.floor(t * 6); // glyph shimmer rate
      const sway = 0.5 + 0.5 * Math.sin(0.6 * t);
      const baseAlpha = mobile ? 0.4 : 1;

      for (const hand of hands) {
        const wx = width * (mobile ? (hand.dir > 0 ? 0.08 : 0.92) : hand.side) + hand.dir * sway * 30 * s;
        const wy = anchorY + hand.dy * s + (mobile ? hand.dir * -150 : 0) + 4 * Math.sin(0.45 * t + hand.phase);
        const roll = hand.dir * t * 0.5 + hand.phase;
        const caps = buildHand(hand.spec, wx, wy, s, roll, t);
        const light = 0.35 + 0.5 * Math.max(-0.5, Math.min(1, Math.sin(roll)));
        const k = 5 * s;

        // Only scan the cells around this hand.
        let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
        for (const c of caps) {
          x0 = Math.min(x0, c.x0); x1 = Math.max(x1, c.x1);
          y0 = Math.min(y0, c.y0); y1 = Math.max(y1, c.y1);
        }
        const c0 = Math.max(0, Math.floor(x0 / CW));
        const c1 = Math.min(Math.ceil(width / CW), Math.ceil(x1 / CW));
        const r0 = Math.max(0, Math.floor(y0 / CH));
        const r1 = Math.min(Math.ceil(height / CH), Math.ceil(y1 / CH));

        for (let col = c0; col < c1; col++) {
          const x = col * CW + CW / 2;
          for (let row = r0; row < r1; row++) {
            const y = row * CH + CH / 2;
            const d = field(caps, x, y, k);
            const n = hash(col, row + tick * 0.37);
            if (d > 3) {
              // Sparse dust around the hand.
              if (d < 60 && hash(col * 3.1, row * 1.7 + tick * 0.11) < 0.0025) {
                ctx.globalAlpha = 0.3 * baseAlpha;
                ctx.fillText(n > 0.5 ? "." : ",", col * CW, row * CH);
              }
              continue;
            }
            if (d > 0) {
              // Soft, broken outline.
              if (n > 0.55 - 0.15 * d) continue;
              ctx.globalAlpha = 0.6 * baseAlpha;
              ctx.fillText(RAMP[1 + Math.floor(n * 3)], col * CW, row * CH);
              continue;
            }
            // Inside: lit from the upper left. Compare with the field a little toward the light.
            const toward = field(caps, x - 6 * s, y - 8 * s, k);
            let b = 0.5 - 0.6 * Math.max(-1, Math.min(1, (toward - d) / 10));
            b = b * (0.8 + 0.4 * light) + 0.12 * Math.min(1, -d / 18) + 0.12;
            b *= 0.9 + 0.2 * n;
            const i = Math.max(1, Math.min(RAMP.length - 1, Math.round(b * (RAMP.length - 1))));
            ctx.globalAlpha = Math.min(1, 0.72 + 0.35 * b) * baseAlpha;
            ctx.fillText(RAMP[i], col * CW, row * CH);
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const frame = (ms: number) => {
      if (!running) return;
      draw(ms);
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // Draw a frame right away on every resize, so the hands are there even before (or
    // without) the animation loop.
    const ro = new ResizeObserver(() => {
      layout();
      draw(performance.now());
    });
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    ro.observe(canvas);
    io.observe(canvas);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-[min(100svh,960px)] w-full"
    />
  );
}
