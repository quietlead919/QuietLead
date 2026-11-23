"use client";

import { useEffect, useRef } from "react";

// Background after the hero: soft dark shapes that slowly drift and merge, lit only along
// their edges (blue, cyan, a touch of violet), with a large glass ring rising from below.
// One fullscreen WebGL quad, signed-distance shapes. Paused off screen; still frame with
// reduced motion.

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main() {
  vec2 frag = gl_FragCoord.xy;
  float aspect = uRes.x / uRes.y;
  vec2 uv = frag / uRes;
  vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
  float t = uTime * 0.12;

  // Drifting blobs, smoothly merged
  float d = 1e3;
  d = smin(d, length(p - vec2(-0.55 * aspect * 0.6 + 0.08 * sin(t * 1.1), 0.18 + 0.06 * cos(t))) - 0.34, 0.25);
  d = smin(d, length(p - vec2(0.42 * aspect * 0.6 + 0.07 * cos(t * 0.9), 0.32 + 0.05 * sin(t * 1.3))) - 0.27, 0.25);
  d = smin(d, length(p - vec2(0.62 * aspect * 0.6 + 0.05 * sin(t * 0.7), -0.28 + 0.06 * cos(t * 1.2))) - 0.3, 0.25);
  d = smin(d, length(p - vec2(-0.2 + 0.06 * sin(t * 1.4), -0.42 + 0.04 * cos(t))) - 0.22, 0.25);

  // Edge light of the blobs (bright rim, soft falloff outside, faint inside)
  float rim = exp(-abs(d) * 46.0);
  float halo = exp(-max(d, 0.0) * 9.0) * step(0.0, d);
  float inner = exp(d * 6.0) * step(d, 0.0);

  // Big glass ring rising from below
  vec2 rc = vec2(0.0, -0.95);
  float r = length((p - rc) * vec2(0.82, 1.0));
  float ringD = abs(r - 0.78 - 0.015 * sin(t * 2.0));
  float ring = exp(-ringD * 60.0) * 0.9 + exp(-ringD * 9.0) * 0.25;

  vec3 cyan = vec3(0.25, 0.78, 1.0);
  vec3 blue = vec3(0.16, 0.36, 1.0);
  vec3 violet = vec3(0.62, 0.45, 1.0);
  float hue = 0.5 + 0.5 * sin(atan(p.y, p.x) * 2.0 + t * 2.0);
  vec3 edge = mix(cyan, violet, hue * 0.45);

  vec3 col = vec3(0.0);
  col += edge * rim * 0.72;
  col += blue * halo * 0.2;
  col += vec3(0.03, 0.06, 0.18) * inner;
  col += mix(blue, cyan, 0.5 + 0.5 * p.x) * ring * 0.65;

  // Keep the left side (where the copy sits) calmer
  col *= mix(0.55, 1.0, smoothstep(0.1, 0.6, uv.x));
  // Continue the hero's blue light from the top
  col += vec3(0.05, 0.12, 0.45) * smoothstep(0.6, 1.0, uv.y) * 0.7;

  // Film grain
  col += (hash(frag + fract(uTime) * 91.0) - 0.5) * 0.035;

  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
`;

export function FlowLights({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas?.getContext("webgl", { antialias: false });
    if (!canvas || !gl) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
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

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    let t = 0;
    let last = performance.now();
    let raf = 0;
    let running = false;
    const draw = () => {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const frame = (now: number) => {
      if (!running) return;
      t += Math.min(0.05, (now - last) / 1000);
      last = now;
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
    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(canvas);
    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none block h-full w-full ${className}`} />;
}
