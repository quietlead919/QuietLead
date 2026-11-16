"use client";

import { useEffect, useRef } from "react";

// Two pointing hands drawn as white ASCII characters on the black hero, one on each side,
// pointing at the headline. They stay in place, float gently, flicker a little and turn
// toward the mouse on a spring (with a small overshoot). Rendered on one canvas; paused when
// the hero is off screen; static with prefers-reduced-motion. Small and faint on phones.

const SRC = "/brand/hand-point.png";
const RAMP = " .:-=+*xsV$WM#@";
const MAX_TURN = 0.2; // radians the hands may turn toward the mouse
const BASE_TURN = 0.1; // resting tilt: left points slightly down, right slightly up

type Grid = { cols: number; rows: number; idx: Uint8Array };

// Turns the image into a grid of ramp indices (0 = empty). Finds the hand's bounding box
// first so stray specks and white margins are ignored.
function buildGrid(img: HTMLImageElement, cols: number): Grid {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d", { willReadFrequently: true })!;
  g.drawImage(img, 0, 0);
  const data = g.getImageData(0, 0, w, h).data;
  const colCount = new Uint32Array(w);
  const rowCount = new Uint32Array(h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (data[i] + data[i + 1] + data[i + 2] < 384) {
        colCount[x]++;
        rowCount[y]++;
      }
    }
  }
  const minHits = 3;
  let x0 = 0, x1 = w - 1, y0 = 0, y1 = h - 1;
  while (x0 < w && colCount[x0] < minHits) x0++;
  while (x1 > x0 && colCount[x1] < minHits) x1--;
  while (y0 < h && rowCount[y0] < minHits) y0++;
  while (y1 > y0 && rowCount[y1] < minHits) y1--;
  const bw = x1 - x0 + 1;
  const bh = y1 - y0 + 1;

  // A monospace cell is about 0.6 as wide as it is tall.
  const rows = Math.max(1, Math.round(cols * (bh / bw) * 0.6));
  const s = document.createElement("canvas");
  s.width = cols;
  s.height = rows;
  const sg = s.getContext("2d", { willReadFrequently: true })!;
  sg.fillStyle = "#fff";
  sg.fillRect(0, 0, cols, rows);
  sg.imageSmoothingEnabled = true;
  sg.imageSmoothingQuality = "high";
  sg.drawImage(img, x0, y0, bw, bh, 0, 0, cols, rows);
  const px = sg.getImageData(0, 0, cols, rows).data;
  const idx = new Uint8Array(cols * rows);
  for (let i = 0; i < cols * rows; i++) {
    const dark = 1 - (px[i * 4] + px[i * 4 + 1] + px[i * 4 + 2]) / 765;
    if (dark < 0.14) continue;
    idx[i] = Math.min(RAMP.length - 1, 1 + Math.floor(Math.pow(dark, 0.9) * (RAMP.length - 1)));
  }
  return { cols, rows, idx };
}

function mirror(g: Grid): Grid {
  const idx = new Uint8Array(g.idx.length);
  for (let r = 0; r < g.rows; r++)
    for (let c = 0; c < g.cols; c++) idx[r * g.cols + c] = g.idx[r * g.cols + (g.cols - 1 - c)];
  return { ...g, idx };
}

type Hand = {
  grid: Grid;
  side: "left" | "right";
  angle: number;
  vel: number;
  phase: number;
  flick: Int8Array;
  life: Uint8Array;
};

export function AsciiHands() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const img = new Image();
    img.src = SRC;

    let hands: Hand[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let mobile = false;
    let anchorY = 0;
    let handW = 0;
    let mouse: { x: number; y: number } | null = null;
    let raf = 0;
    let running = false;
    let last = 0;
    let lastDraw = 0;

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      mobile = width < 768;
      const h1 = canvas.parentElement?.querySelector("h1");
      anchorY = h1 ? h1.getBoundingClientRect().top - rect.top + h1.getBoundingClientRect().height / 2 : height * 0.4;
      handW = mobile ? width * 0.62 : Math.min(560, Math.max(260, width * 0.3));
      if (img.complete && img.naturalWidth) {
        // Fixed character size (about 6.5px wide), so the glyphs stay readable as ASCII.
        const cols = Math.max(36, Math.min(86, Math.round(handW / 6.5)));
        const right = buildGrid(img, cols);
        const make = (grid: Grid, side: Hand["side"], phase: number): Hand => ({
          grid,
          side,
          angle: BASE_TURN,
          vel: 0,
          phase,
          flick: new Int8Array(grid.idx.length),
          life: new Uint8Array(grid.idx.length),
        });
        hands = [make(mirror(right), "left", 0), make(right, "right", 2.1)];
      }
    };

    // The wrist sits just outside the edge; left a bit above the headline, right a bit below.
    const pivot = (hand: Hand) => {
      const offset = mobile ? (hand.side === "left" ? -150 : 150) : hand.side === "left" ? -40 : 60;
      const overhang = handW * 0.06;
      return { x: hand.side === "left" ? -overhang : width + overhang, y: anchorY + offset };
    };

    const draw = (t: number, dt: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const s = Math.min(3, dt / 16.67);

      for (const hand of hands) {
        const { grid } = hand;
        const cw = handW / grid.cols;
        const ch = cw / 0.6;
        const p = pivot(hand);

        // Target: turn toward the mouse (within limits), otherwise rest.
        let target = BASE_TURN;
        if (mouse && !mobile && !reduce) {
          const aim = Math.atan2(mouse.y - p.y, mouse.x - p.x);
          const tip = hand.side === "left" ? 0 : Math.PI;
          let d = aim - tip - BASE_TURN;
          d = Math.atan2(Math.sin(d), Math.cos(d));
          target = BASE_TURN + Math.max(-MAX_TURN, Math.min(MAX_TURN, d * 0.5));
        }
        // Spring with light damping: a small overshoot, the "ping".
        hand.vel += ((target - hand.angle) * 0.045 - hand.vel * 0.12) * s;
        hand.angle += hand.vel * s;

        const floatY = reduce ? 0 : Math.sin(t * 0.0008 + hand.phase) * (mobile ? 4 : 8);
        const sway = reduce ? 0 : Math.sin(t * 0.0006 + hand.phase) * 0.015;

        // Flicker: a few cells shift density for a few frames.
        if (!reduce) {
          const n = Math.ceil(grid.idx.length * 0.012);
          for (let k = 0; k < n; k++) {
            const i = (Math.random() * grid.idx.length) | 0;
            if (!grid.idx[i]) continue;
            hand.flick[i] = Math.random() < 0.5 ? -2 : 2;
            hand.life[i] = 3 + ((Math.random() * 6) | 0);
          }
        }

        ctx.save();
        ctx.translate(p.x, p.y + floatY);
        ctx.rotate(hand.angle + sway);
        ctx.font = `${ch.toFixed(2)}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#fff";
        ctx.globalAlpha = mobile ? 0.18 : 0.7;
        const x0 = hand.side === "left" ? 0 : -handW;
        const y0 = -(grid.rows * ch) / 2;
        for (let r = 0; r < grid.rows; r++) {
          for (let c = 0; c < grid.cols; c++) {
            const i = r * grid.cols + c;
            const base = grid.idx[i];
            if (!base) continue;
            let v = base;
            if (hand.life[i]) {
              v = Math.max(1, Math.min(RAMP.length - 1, base + hand.flick[i]));
              hand.life[i]--;
            }
            ctx.fillText(RAMP[v], x0 + c * cw, y0 + r * ch + ch / 2);
          }
        }
        ctx.restore();
      }
    };

    const frame = (t: number) => {
      if (!running) return;
      const dt = last ? t - last : 16.67;
      last = t;
      // ~40 fps is plenty for this look and keeps the main thread calm.
      if (t - lastDraw >= 24) {
        draw(t, t - lastDraw || dt);
        lastDraw = t;
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      last = 0;
      lastDraw = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => {
      mouse = null;
    };

    const ro = new ResizeObserver(() => {
      layout();
      if (reduce) draw(0, 16.67);
    });
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));

    img.onload = () => {
      layout();
      if (reduce) draw(0, 16.67);
      ro.observe(canvas);
      io.observe(canvas);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      img.onload = null;
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
