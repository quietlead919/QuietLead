"use client";

import { useEffect, useRef } from "react";

// Hero background: blue light seen through vertical ribs of refracted glass. One fullscreen
// WebGL quad; each rib re-samples a soft, slowly drifting light field with a lens-like bend.
// The light leans toward the mouse. Paused off screen; a single still frame with reduced motion.

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uRib;

float beams(float x, float t) {
  float b = 0.0;
  b += exp(-pow((x - 0.22 - 0.06 * sin(t * 0.21)) * 5.0, 2.0)) * 0.9;
  b += exp(-pow((x - 0.48 - 0.08 * sin(t * 0.17 + 1.3)) * 4.0, 2.0)) * 1.0;
  b += exp(-pow((x - 0.78 - 0.05 * sin(t * 0.23 + 2.1)) * 5.5, 2.0)) * 0.85;
  b += 0.06 + 0.06 * sin(x * 21.0 + t * 0.4) * sin(x * 7.0 - t * 0.25);
  return b;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float ribs = uRes.x / uRib;
  float sx = uv.x * ribs;
  float id = floor(sx);
  float f = fract(sx);

  // Lens inside each rib: the light field is sampled mirrored and stretched across the rib.
  float bend = (0.5 - f) * 2.6;
  float x = (id + 0.5 + bend) / ribs;

  float light = beams(x, uTime);
  // Light leans toward the pointer.
  light += exp(-pow((x - uMouse.x) * 4.0, 2.0)) * (0.35 + 0.2 * uMouse.y);

  // Brighter at the top, sinking into black at the bottom.
  float vert = pow(clamp(uv.y, 0.0, 1.0), 1.9);
  float I = light * vert * 0.62;

  vec3 navy = vec3(0.004, 0.02, 0.07);
  vec3 blue = vec3(0.10, 0.30, 1.00);
  vec3 ice = vec3(0.55, 0.75, 1.00);
  vec3 col = mix(navy, blue, clamp(I, 0.0, 1.0));
  col += ice * pow(clamp(I - 0.5, 0.0, 1.0), 2.0) * 0.9;

  // Rib edges: a bright rim on one side, a shadow on the other.
  float rim = smoothstep(0.9, 1.0, f);
  float shade = 1.0 - smoothstep(0.0, 0.18, f);
  col += vec3(0.45, 0.62, 1.0) * rim * 0.22 * (0.15 + I);
  col *= 1.0 - shade * 0.55;

  // Fade the very bottom to pure black so it blends into the page.
  col *= smoothstep(0.02, 0.45, uv.y);
  gl_FragColor = vec4(col, 1.0);
}
`;

export function GlassLights({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas?.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!canvas || !gl) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uRib = gl.getUniformLocation(prog, "uRib");

    const mouse = { x: 0.5, y: 0.6, tx: 0.5, ty: 0.6 };
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    let raf = 0;
    let running = false;
    let last = performance.now();
    let t = 0;
    const draw = () => {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uRib, (canvas.clientWidth < 640 ? 34 : 52) * dpr);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const frame = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      const k = 1 - Math.exp(-dt * 3);
      mouse.x += (mouse.tx - mouse.x) * k;
      mouse.y += (mouse.ty - mouse.y) * k;
      draw();
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      mouse.ty = Math.min(1, Math.max(0, 1 - (e.clientY - r.top) / r.height));
    };

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none block h-full w-full ${className}`} />;
}
