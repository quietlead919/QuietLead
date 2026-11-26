"use client";

import { useEffect, useRef } from "react";

// Page background: a cinematic wall of glossy ribs that stand upright, bend in a soft curve and
// run out across the floor towards the viewer, lit by a bright column in the middle.
// - On load the ribs fade in from the centre outwards.
// - The colour drifts slowly between blue and indigo; a soft light runs along the ribs.
// - Full strength behind the hero, dimmed further down so content stays readable.
// One fixed WebGL2 quad (procedural, no textures). Static with reduced motion.

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uReveal;
uniform float uDim;
out vec4 outColor;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  float px = (uv.x - 0.5) * aspect;
  float y = uv.y;

  // Horizon where the upright wall bends onto the floor (smooth, not a kink).
  float yh = 0.5;
  float k = 13.0;
  float below = log(1.0 + exp(k * (yh - y))) / k;   // softplus: 0 on the wall, grows on the floor
  float spread = 0.32 + 3.1 * below;                 // ribs fan out towards the viewer
  float u = px / spread;

  float N = 9.0;                                     // ribs per unit (about 50 across the wall)
  float s = u * N;
  float idx = floor(s);
  float f = fract(s);
  float aa = fwidth(s) * 1.5;

  // Rib profile: a rounded tube (bright crest, dark grooves), antialiased.
  float nx = f * 2.0 - 1.0;
  float tube = sqrt(max(0.0, 1.0 - nx * nx));
  float groove = smoothstep(0.0, 0.09 + aa, f) * smoothstep(1.0, 0.91 - aa, f);
  // Specular streak, slightly off-centre, tighter on the wall than on the floor.
  float spec = pow(max(0.0, 1.0 - abs(nx - 0.28) * 2.2), mix(24.0, 9.0, clamp(below * 6.0, 0.0, 1.0)));

  // Light: a bright column in the middle, falling off to the sides and down the floor.
  float column = exp(-pow(px * 1.25, 2.0));
  float core = exp(-pow(px * 9.0, 2.0)) * smoothstep(0.3, 0.95, y);
  float wallLight = mix(0.25, 1.0, smoothstep(0.25, 0.95, y));
  float floorFade = smoothstep(-0.05, yh + 0.05, y);
  float light = (0.42 + 0.75 * column) * wallLight * mix(0.5, 1.0, floorFade);

  // A slow sheen that travels down the ribs.
  float sheen = 0.5 + 0.5 * sin(y * 7.0 - uTime * 0.35 + idx * 0.21);
  light *= 0.85 + 0.25 * sheen;

  // Colour drift between deep blue and indigo-violet.
  float drift = 0.5 + 0.5 * sin(uTime * 0.07);
  vec3 deep = mix(vec3(0.012, 0.045, 0.34), vec3(0.050, 0.030, 0.30), drift);
  vec3 mid = mix(vec3(0.060, 0.230, 0.95), vec3(0.230, 0.180, 0.95), drift);
  vec3 hi = vec3(0.62, 0.78, 1.0);

  vec3 col = deep * (0.6 + 0.4 * tube);
  col = mix(col, mid, clamp(pow(tube, 1.6) * light, 0.0, 1.0));
  col += hi * spec * (0.25 + light) * 1.25;          // glossy streak on every rib
  col *= mix(0.12, 1.0, groove);                     // deep grooves between ribs
  col += vec3(0.85, 0.92, 1.0) * core * 0.55;        // glowing centre seam

  // Dark channel running down the floor in the middle, like the reference.
  float floorMask = 1.0 - floorFade;
  col *= mix(1.0, mix(0.25, 1.0, smoothstep(0.02, 0.22, abs(px))), floorMask);

  // Ribs fade in from the centre outwards on load.
  float reveal = clamp((uReveal * 34.0 - abs(idx + 0.5)) / 3.0, 0.0, 1.0);
  col *= reveal;

  // Cinematic finish: tone map, vignette, deeper floor, grain.
  col = aces(col * 1.2);
  float vig = smoothstep(1.25, 0.35, length((uv - vec2(0.5, 0.55)) * vec2(aspect * 0.75, 1.0)));
  col *= mix(0.45, 1.0, vig);
  col *= mix(0.35, 1.0, smoothstep(0.0, 0.35, y));
  col *= uDim;
  col += (hash(gl_FragCoord.xy + fract(uTime) * 73.0) - 0.5) * 0.025;

  outColor = vec4(max(col, 0.0), 1.0);
}
`;

export function CinematicRibs() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas?.getContext("webgl2", { antialias: false, powerPreference: "high-performance" });
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
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uReveal = gl.getUniformLocation(prog, "uReveal");
    const uDim = gl.getUniformLocation(prog, "uDim");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    // Full strength while the hero is on screen, calmer once you scroll into the content.
    const targetDim = () => {
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      const end = hero ? hero.offsetHeight * 0.7 : window.innerHeight;
      const t = Math.min(1, Math.max(0, window.scrollY / Math.max(1, end)));
      return 1 - t * 0.6;
    };

    let t = 0;
    let reveal = reduce ? 1 : 0;
    let dim = targetDim();
    let last = performance.now();
    const born = last;
    let raf = 0;
    const draw = () => {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uReveal, reveal);
      gl.uniform1f(uDim, dim);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      // Wall-clock based, so a throttled tab still finishes the reveal on time.
      reveal = Math.min(1, (now - born) / 2600);
      dim += (targetDim() - dim) * (1 - Math.exp(-dt * 4));
      draw();
      raf = requestAnimationFrame(frame);
    };

    resize();
    if (reduce) {
      draw();
      const onScroll = () => {
        dim = targetDim();
        draw();
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      const ro = new ResizeObserver(() => {
        resize();
        draw();
      });
      ro.observe(canvas);
      return () => {
        window.removeEventListener("scroll", onScroll);
        ro.disconnect();
      };
    }
    raf = requestAnimationFrame(frame);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 block h-[100lvh] w-full"
    />
  );
}
