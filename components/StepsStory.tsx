"use client";

import { useRef, useState } from "react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

// "Describe. Discover. Send." as a pinned scroll story: the section sticks while a single
// product card morphs through the three steps (typing a request -> leads appear ->
// a draft is approved and sent). Without motion everything is shown statically.

const steps = [
  { n: 1, title: "Describe your customer", text: "Tell QuietLead who you want to reach, in plain words." },
  { n: 2, title: "AI finds the right moment", text: "It scans companies for buying signals and researches each lead." },
  { n: 3, title: "Approve and send", text: "Get a personal draft, approve it, send it from your own inbox." },
];

const PROMPT = "Web agencies in Germany, 5–30 people, hiring right now";

const rows = [
  { name: "Pixelwerk Studio", meta: "Cologne · hiring 2 designers", score: 94 },
  { name: "Kranich Digital", meta: "Berlin · new office", score: 89 },
  { name: "Fjord & Form", meta: "Hamburg · raised seed round", score: 84 },
];

export function StepsStory() {
  const root = useRef<HTMLElement>(null);
  const replayRef = useRef<() => void>(() => {});
  const [done, setDone] = useState(false);
  const [spin, setSpin] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        // The story only ever moves forward: scrolling down drives it, scrolling up never
        // rewinds it. Once it has reached "Sent" it stays there. Only after you have scrolled
        // back above the section and come down into it again does it start over.
        const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });
        let finished = false;
        let reached = 0;
        let leftAbove = false;
        const st = ScrollTrigger.create({
          trigger: q("[data-pin]")[0],
          start: "top top",
          end: "+=2600",
          pin: true,
          anticipatePin: 1,
          onLeaveBack() {
            leftAbove = true;
          },
          onEnter() {
            if (!leftAbove) return;
            leftAbove = false;
            finished = false;
            reached = 0;
            gsap.killTweensOf(tl);
            tl.timeScale(1).progress(0);
            setDone(false);
          },
          onUpdate(self) {
            if (finished || self.direction < 0) return;
            reached = Math.max(reached, self.progress);
            gsap.to(tl, { progress: reached, duration: 0.8, ease: "power3.out", overwrite: true });
            if (reached > 0.97) {
              finished = true;
              gsap.to(tl, { progress: 1, duration: 0.6, ease: "power2.out", overwrite: true });
              setDone(true);
            }
          },
        });
        replayRef.current = () => {
          gsap.killTweensOf(tl);
          tl.timeScale(1.5).restart();
        };

        // Starting states (the static markup shows every scene).
        gsap.set(q("[data-scene=leads], [data-scene=send]"), { autoAlpha: 0 });
        gsap.set(q("[data-char]"), { opacity: 0 });
        gsap.set(q("[data-row]"), { autoAlpha: 0, y: 24 });
        gsap.set(q("[data-step]"), { opacity: 0.35 });
        gsap.set(q("[data-step='1']"), { opacity: 1 });
        gsap.set(q("[data-fill]"), { scaleY: 0 });
        gsap.set(q("[data-card]"), { rotateX: 14, rotateY: -10, scale: 0.92 });

        tl
          // Step 1: card straightens up, the request types itself
          .to(q("[data-card]"), { rotateX: 0, rotateY: 0, scale: 1, duration: 1 })
          .to(q("[data-char]"), { opacity: 1, stagger: 0.02, duration: 0.05, ease: "none" }, "<0.2")
          .to(q("[data-find]"), { scale: 0.94, duration: 0.15, yoyo: true, repeat: 1 })
          .to(q("[data-fill]"), { scaleY: 0.5, duration: 0.6 }, "<")

          // Step 2: the prompt morphs into a slim search bar, leads slide in
          .to(q("[data-step='1']"), { opacity: 0.35, duration: 0.3 })
          .to(q("[data-step='2']"), { opacity: 1, duration: 0.3 }, "<")
          .to(q("[data-scene=describe]"), { autoAlpha: 0, y: -30, scale: 0.96, duration: 0.6 }, "<")
          .to(q("[data-card]"), { backgroundColor: "rgba(234,241,255,0.92)", duration: 0.6 }, "<")
          .to(q("[data-scene=leads]"), { autoAlpha: 1, duration: 0.4 }, "<0.3")
          .to(q("[data-row]"), { autoAlpha: 1, y: 0, stagger: 0.18, duration: 0.5 }, "<")
          .from(q("[data-bar]"), { scaleX: 0, stagger: 0.18, duration: 0.6 }, "<0.1")
          .from(q("[data-chip]"), { scale: 0, stagger: 0.18, duration: 0.3, ease: "back.out(2)" }, "<0.2")

          // Step 3: the top lead grows into a draft, gets approved, flies out
          .to(q("[data-step='2']"), { opacity: 0.35, duration: 0.3 }, "+=0.3")
          .to(q("[data-step='3']"), { opacity: 1, duration: 0.3 }, "<")
          .to(q("[data-fill]"), { scaleY: 1, duration: 0.8 }, "<")
          .to(q("[data-scene=leads]"), { autoAlpha: 0, scale: 0.94, duration: 0.5 }, "<")
          .to(q("[data-card]"), { backgroundColor: "rgba(255,255,255,0.9)", duration: 0.5 }, "<")
          .fromTo(q("[data-scene=send]"), { autoAlpha: 0, scale: 1.06 }, { autoAlpha: 1, scale: 1, duration: 0.6 }, "<0.2")
          .to(q("[data-approve]"), { scale: 0.93, duration: 0.15, yoyo: true, repeat: 1 }, "+=0.3")
          .to(q("[data-draft]"), { x: 160, y: -120, rotate: 14, scale: 0.2, autoAlpha: 0, duration: 0.7, ease: "power2.in" })
          .fromTo(q("[data-sent]"), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, "<0.4")
          .to({}, { duration: 0.4 }); // short hold before unpinning

        return () => st.kill();
      });
    },
    { scope: root },
  );

  return (
    <section id="how" ref={root} className="scroll-mt-24">
      <div data-pin className="flex min-h-screen items-center px-4 py-20">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          {/* Left: headline + steps with a progress line */}
          <div>
            <h2 className="text-[34px] leading-[1.1] font-semibold tracking-tight sm:text-5xl">Describe. Discover. Send.</h2>
            <p className="mt-4 max-w-md text-lg text-ink-soft">In three easy steps, start filling your pipeline quietly.</p>
            <ol className="relative mt-10 space-y-8 pl-10">
              <span className="absolute top-2 bottom-2 left-[13px] w-0.5 rounded-full bg-haze" aria-hidden="true" />
              <span
                data-fill
                className="absolute top-2 bottom-2 left-[13px] w-0.5 origin-top rounded-full bg-brand"
                aria-hidden="true"
              />
              {steps.map((s) => (
                <li key={s.n} data-step={s.n} className="relative">
                  <span className="absolute top-0.5 -left-10 flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
                    {s.n}
                  </span>
                  <h3 className="text-xl font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-1 text-[15px] text-ink-soft">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Right: one card that morphs through the three scenes */}
          <div className="[perspective:1400px]">
            <div
              data-card
              className="glass-strong relative mx-auto h-[380px] w-full max-w-[520px] overflow-hidden rounded-[32px] sm:h-[420px]"
            >
              <div className="flex items-center gap-2 border-b border-ink/5 px-6 py-4">
                <span className="h-3 w-3 rounded-full bg-ink/10" />
                <span className="h-3 w-3 rounded-full bg-ink/10" />
                <span className="h-3 w-3 rounded-full bg-ink/10" />
                <span className="ml-auto text-xs font-medium text-ink-faint">QuietLead</span>
              </div>

              {/* Scene 1: describe */}
              <div data-scene="describe" aria-hidden="true" className="absolute inset-x-0 top-[60px] bottom-0 p-6 sm:p-8">
                <p className="text-[11px] font-semibold tracking-[0.08em] text-ink-faint uppercase">Who do you want to reach?</p>
                <div className="mt-3 min-h-[96px] rounded-2xl bg-white p-4 text-[17px] leading-relaxed text-ink ring-1 ring-brand/25">
                  {PROMPT.split("").map((c, i) => (
                    <span key={i} data-char>
                      {c}
                    </span>
                  ))}
                  <span className="ml-0.5 inline-block h-5 w-0.5 translate-y-1 animate-pulse bg-brand" />
                </div>
                <div className="mt-5 flex justify-end">
                  <span data-find className="inline-flex h-11 items-center rounded-xl bg-brand px-5 text-[15px] font-semibold text-white">
                    Find leads →
                  </span>
                </div>
              </div>

              {/* Scene 2: leads appear with signals and fit scores */}
              <div data-scene="leads" aria-hidden="true" className="absolute inset-x-0 top-[60px] bottom-0 p-6 sm:p-8">
                <div className="flex h-10 items-center rounded-xl bg-white px-4 text-[13px] text-ink-soft ring-1 ring-ink/5">
                  🔍&nbsp; {PROMPT}
                </div>
                <ul className="mt-4 space-y-3">
                  {rows.map((r) => (
                    <li key={r.name} data-row className="rounded-2xl bg-white px-4 py-3.5 ring-1 ring-ink/5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[15px] font-semibold text-ink">{r.name}</span>
                        <span data-chip className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                          Signal
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-3">
                        <span className="flex-1 text-[12px] text-ink-faint">{r.meta}</span>
                        <span className="h-1.5 w-20 overflow-hidden rounded-full bg-haze">
                          <span data-bar className="block h-full origin-left rounded-full bg-brand" style={{ width: `${r.score}%` }} />
                        </span>
                        <span className="w-6 text-right text-[12px] font-semibold text-brand tabular-nums">{r.score}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Scene 3: draft, approve, sent */}
              <div data-scene="send" className="absolute inset-x-0 top-[60px] bottom-0 p-6 sm:p-8">
                <div data-draft aria-hidden="true" className="rounded-2xl bg-white p-5 ring-1 ring-ink/5">
                  <p className="text-[11px] font-semibold tracking-[0.08em] text-ink-faint uppercase">Draft to Lena, Founder</p>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-ink">
                    Hi Lena, saw you&apos;re hiring two designers. Congrats on the growth. Most studios your size tell me new
                    clients still come only through referrals…
                  </p>
                  <div className="mt-4 flex gap-2.5">
                    <span data-approve className="inline-flex h-10 items-center rounded-xl bg-brand px-4 text-[14px] font-semibold text-white">
                      Approve &amp; send
                    </span>
                    <span className="inline-flex h-10 items-center rounded-xl bg-mist px-4 text-[14px] font-semibold text-ink">Edit</span>
                  </div>
                </div>
                <div data-sent className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">✓</span>
                  <p className="text-lg font-semibold text-ink">Sent from your inbox</p>
                  <p className="text-[13px] text-ink-faint">Approved by you. Personal. Quiet.</p>
                  {done && (
                    <button
                      type="button"
                      onClick={() => {
                        setSpin((n) => n + 1);
                        replayRef.current();
                      }}
                      className="group/replay pop-in mt-3 inline-flex h-10 items-center gap-2 rounded-xl bg-mist px-4 text-[14px] font-semibold text-brand transition-[transform,background-color] duration-150 hover:bg-haze active:scale-95"
                    >
                      <svg
                        key={spin}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className={`h-4 w-4 transition-transform duration-500 group-hover/replay:-rotate-180 ${spin ? "replay-spin" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 12a9 9 0 1 0 3-6.7" />
                        <path d="M3 4v5h5" />
                      </svg>
                      Replay
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
