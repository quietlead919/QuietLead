import Image from "next/image";
import { Nav } from "@/components/Nav";
import { HeroMockup } from "@/components/HeroMockup";
import { WaitlistForm } from "@/components/WaitlistForm";
import { Reveal } from "@/components/Reveal";
import { PipelineCalculator } from "@/components/PipelineCalculator";

const steps = [
  { n: 1, title: "Describe your customer", text: "Tell QuietLead who you want to reach, in plain words." },
  { n: 2, title: "AI finds the right moment", text: "It scans companies for buying signals and researches each lead." },
  { n: 3, title: "Approve and send", text: "Get a personal draft, approve it, send it from your own inbox." },
];

type Panel = {
  tone: "blue" | "green" | "purple" | "pink";
  title: string;
  intro: React.ReactNode;
  items: { title: string; text: string }[];
};

const panels: Panel[] = [
  {
    tone: "blue",
    title: "Describe your customer. Get leads instantly.",
    intro: (
      <>
        No filters, no spreadsheets. Write who you want to reach and QuietLead does the searching, <em>quietly</em>.
      </>
    ),
    items: [
      {
        title: "Plain-language targeting",
        text: "“Web agencies in Germany with 5 to 30 people that are hiring.” That's your whole setup. QuietLead turns it into a list of real companies and decision makers.",
      },
      {
        title: "Signal-based timing",
        text: "New hires, funding, outdated websites, new locations. QuietLead reaches out when a company actually needs you, not when your sequence says so.",
      },
    ],
  },
  {
    tone: "green",
    title: "Daily briefings our AI prepares for you.",
    intro: (
      <>
        Every morning you get a short list of hand-picked leads, each with the research already done, so you can skip the
        guesswork and reach out <em>with confidence</em>.
      </>
    ),
    items: [
      {
        title: "Research on every lead",
        text: "What the company does, where its problem is and the best angle to open with. Summarized in a few lines, not a wall of data.",
      },
      {
        title: "10 to 50 leads a day",
        text: "Enough to keep your pipeline full, small enough to treat every lead well. Quality over volume, every single day.",
      },
    ],
  },
  {
    tone: "purple",
    title: "Drafts that sound like you, not a template.",
    intro: (
      <>
        QuietLead writes a personal first message for every lead, built from real research. No <em>{"{{firstName}}"}</em>{" "}
        and a guess.
      </>
    ),
    items: [
      {
        title: "Real personalization",
        text: "Each draft references something true and relevant about the company. Prospects notice when someone actually looked them up.",
      },
      {
        title: "Your writing style",
        text: "Give QuietLead a few of your own emails and it learns your tone, so every draft reads like you wrote it on a good day.",
      },
    ],
  },
  {
    tone: "pink",
    title: "You stay in control. Always.",
    intro: (
      <>
        Nothing leaves your account without your click. QuietLead does the work, <em>you make the call</em>.
      </>
    ),
    items: [
      {
        title: "Approve every message",
        text: "Review, edit or skip each draft. One click sends it from your own Gmail or Outlook, at a pace that keeps your domain healthy.",
      },
      {
        title: "Built for Europe",
        text: "GDPR in mind from day one, German and English outreach, low volume and human review. Made in Frankfurt.",
      },
    ],
  },
];

const trust = ["You approve every message", "Sends from your own inbox", "GDPR-ready, made in Germany"];

const comparison = [
  ["Volume", "Thousands of emails", "10 to 50 per day"],
  ["Personalization", "{{firstName}} templates", "Real research per lead"],
  ["Control", "Runs on autopilot", "You approve every message"],
  ["Deliverability", "Burns your domain", "Your inbox, low volume"],
  ["How it feels", "Spam", "“They actually looked us up.”"],
];

// The one feature everyone wants (buying-signal alerts) is Studio only.
const plans = [
  {
    name: "Quiet",
    price: "18.99",
    leads: "50 leads / month",
    for: "Try it out, one lead at a time",
    features: ["Lead briefings", "AI-written first drafts", "Copy and send yourself", "Email support"],
    missing: ["Send from Gmail or Outlook", "Buying-signal alerts"],
  },
  {
    name: "Steady",
    price: "49.99",
    leads: "300 leads / month",
    for: "Freelancers and small agencies",
    features: [
      "Everything in Quiet",
      "Send from Gmail or Outlook",
      "Your own writing style",
      "Follow-up drafts",
      "Reply tracking",
      "CRM export",
    ],
    missing: ["Buying-signal alerts"],
    popular: true,
  },
  {
    name: "Studio",
    price: "129.99",
    leads: "1,000 leads / month",
    for: "Teams that want it all",
    features: ["Everything in Steady", "Buying-signal alerts", "3 team seats", "Multiple ideal customer profiles", "Priority support"],
    highlight: "Buying-signal alerts",
    missing: [] as string[],
  },
];

const faqs = [
  {
    q: "How is QuietLead different from Apollo, Lemlist or Instantly?",
    a: "Those tools are built for volume. QuietLead is built for quality: fewer leads, real research and a human approving every message. You send less and get more replies.",
  },
  {
    q: "Does QuietLead send emails automatically?",
    a: "No. QuietLead prepares a briefing and a draft for each lead. You review, edit if you want, and send with one click from your own inbox.",
  },
  {
    q: "Is cold outreach legal in Germany and the EU?",
    a: "Rules like GDPR and the German UWG apply to B2B outreach. QuietLead is designed with this in mind: low volume, relevant contacts and human review. You remain responsible for your outreach, so check your setup with a legal advisor.",
  },
  {
    q: "Which plan should I pick?",
    a: "Quiet lets you try QuietLead with a handful of leads. Steady covers almost everything a freelancer or small agency needs. Studio adds buying-signal alerts, so you hear the moment a company is ready to buy.",
  },
  {
    q: "When does QuietLead launch?",
    a: "We're onboarding a small private beta first. Waitlist members get access in the order they signed up.",
  },
];

// Pricing buttons open Stripe Checkout only when this flag is on (set it to
// "true" in .env.local for testing, leave it off in production until launch).
const checkoutEnabled = process.env.NEXT_PUBLIC_CHECKOUT_ENABLED === "true";

function planButton(popular?: boolean) {
  return popular
    ? "inline-flex items-center justify-center rounded-full bg-white font-medium text-brand transition-transform hover:-translate-y-px"
    : "btn-primary";
}

function SectionHead({ eyebrow, title, text }: { eyebrow?: string; title: React.ReactNode; text?: string }) {
  return (
    <Reveal className="mx-auto max-w-3xl text-center">
      {eyebrow && <p className="text-sm font-semibold text-brand">{eyebrow}</p>}
      <h2 className="mt-2 text-[34px] leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl">{title}</h2>
      {text && <p className="mx-auto mt-4 max-w-xl text-lg text-pretty text-ink-soft">{text}</p>}
    </Reveal>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 shrink-0">
      <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.18" />
      <path d="M6 10.4l2.6 2.6L14 7.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <Nav />

      <main id="top">
        {/* HERO */}
        <section className="hero-bg relative overflow-hidden px-4 pt-32 pb-10 text-center text-white sm:pt-40">
          <div className="relative mx-auto max-w-5xl">
            <div className="fade-up">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-medium text-white backdrop-blur">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-400 text-emerald-400" />
                Private beta<span className="hidden sm:inline">&nbsp;· early access opening soon</span>
              </p>
            </div>
            <div className="fade-up" style={{ animationDelay: "80ms" }}>
              <h1 className="mt-7 text-[44px] leading-[1.05] font-medium tracking-[-0.025em] text-balance sm:text-6xl lg:text-[76px]">
                Find Your Next Customers{" "}
                <em className="font-semibold underline decoration-white/45 decoration-[3px] underline-offset-[10px]">
                  Without
                </em>{" "}
                the Noise
              </h1>
            </div>
            <div className="fade-up" style={{ animationDelay: "160ms" }}>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pretty text-white/85 sm:text-xl">
                QuietLead is your AI sales assistant. It finds perfect-fit leads, spots the right moment and drafts
                personal outreach you approve.
              </p>
            </div>
            <div className="fade-up mt-9" style={{ animationDelay: "240ms" }}>
              <WaitlistForm source="hero" onDark center />
            </div>
            <ul
              className="fade-up mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-white/90"
              style={{ animationDelay: "320ms" }}
            >
              {trust.map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="fade-up relative mx-auto mt-16 max-w-3xl text-left" style={{ animationDelay: "300ms" }}>
            <HeroMockup />
          </div>
          <p className="relative mt-8 text-xs text-ink-faint">
            *Works with Gmail and Outlook. QuietLead never sends anything without your approval.
          </p>
        </section>

        {/* STEPS */}
        <section id="how" className="scroll-mt-24 px-4 py-24">
          <SectionHead title="Describe. Discover. Send." text="In three easy steps, start filling your pipeline quietly." />
          <div className="mx-auto mt-12 max-w-xl space-y-4">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 90}>
                <div className="step-card px-6 py-7 text-center">
                  <span className="inline-block rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
                    Step {s.n}
                  </span>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-1.5 text-[15px] text-ink-soft">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 text-center">
            <a href="#waitlist" className="btn-primary h-14 rounded-2xl px-8 text-base">
              Get early access →
            </a>
            <p className="mt-4 text-sm text-ink-faint">Built for agencies, consultants and B2B teams</p>
          </Reveal>
        </section>

        {/* FEATURE PANELS */}
        <section id="features" className="scroll-mt-24 space-y-6 px-4 pb-24">
          {panels.map((p) => (
            <Reveal key={p.title} className="mx-auto max-w-6xl">
              <div className={`panel panel-${p.tone} px-6 py-10 sm:px-12 sm:py-14`}>
                <h2 className="text-[28px] leading-tight font-semibold tracking-tight text-[var(--panel-ink)] sm:text-[34px]">
                  {p.title}
                </h2>
                <p className="mt-3 max-w-3xl text-[17px] leading-relaxed text-ink-soft [&_em]:font-medium [&_em]:text-[var(--panel-ink)]">
                  {p.intro}
                </p>
                <div className="mt-9 grid gap-8 md:grid-cols-2 md:gap-12">
                  {p.items.map((it) => (
                    <div key={it.title}>
                      <h3 className="text-xl font-semibold text-[var(--panel-ink)]">{it.title}</h3>
                      <p className="mt-2.5 leading-relaxed text-ink-soft">{it.text}</p>
                    </div>
                  ))}
                </div>
                <a href="#waitlist" className="link-arrow mt-10">
                  Join the waitlist
                  <span className="arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              </div>
            </Reveal>
          ))}
        </section>

        {/* COMPARISON */}
        <section className="px-4 py-24">
          <SectionHead
            title={
              <>
                Everyone&apos;s Sending More.
                <br />
                Why Not Send Better?
              </>
            }
            text="Volume tools fill inboxes. QuietLead fills calendars."
          />
          <Reveal className="mx-auto mt-14 max-w-4xl">
            <div className="overflow-hidden rounded-[28px] border border-[#e3eaf8] bg-white">
              <div className="grid grid-cols-3 border-b border-ink/5 bg-mist/60 px-5 py-4 text-sm font-semibold sm:px-8">
                <span />
                <span className="text-ink-faint">Volume tools</span>
                <span className="flex items-center gap-2 text-brand">
                  <Image src="/brand/quietlead-icon.png" alt="" width={20} height={20} className="rounded-md" />
                  QuietLead
                </span>
              </div>
              {comparison.map(([label, them, us]) => (
                <div
                  key={label}
                  className="grid grid-cols-3 gap-3 border-b border-ink/5 px-5 py-4 text-sm last:border-0 sm:px-8 sm:text-[15px]"
                >
                  <span className="font-semibold">{label}</span>
                  <span className="text-ink-faint">{them}</span>
                  <span className="font-medium text-ink">{us}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* CALCULATOR */}
        <section className="px-4 pb-24">
          <SectionHead
            title="Calculate your monthly pipeline"
            text="Move the sliders to see what a quiet, steady flow of leads can mean for your business."
          />
          <Reveal className="mx-auto mt-12 max-w-6xl">
            <PipelineCalculator />
          </Reveal>
        </section>

        {/* PRICING */}
        <section id="pricing" className="scroll-mt-24 px-4 py-24">
          <SectionHead
            eyebrow="Pricing"
            title="Simple plans. Start small, grow quietly."
            text="Every plan starts with a 7-day free trial. Cancel anytime."
          />
          <div className="mx-auto mt-14 grid max-w-5xl items-stretch gap-5 md:grid-cols-3">
            {plans.map((p, i) => (
              <Reveal key={p.name} delay={i * 90}>
                <div
                  className={`relative flex h-full flex-col rounded-3xl p-7 ${
                    p.popular ? "bg-brand text-white" : "glass"
                  }`}
                >
                  {p.popular && (
                    <span className="absolute top-6 right-6 rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-lg font-medium">{p.name}</h3>
                  <p className={`mt-1 text-sm ${p.popular ? "text-white/70" : "text-ink-soft"}`}>{p.for}</p>
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-5xl font-medium tracking-tight">€{p.price}</span>
                    <span className={`text-sm ${p.popular ? "text-white/70" : "text-ink-soft"}`}>/ month</span>
                  </div>
                  <p className={`mt-1 text-xs ${p.popular ? "text-white/70" : "text-ink-faint"}`}>
                    {p.leads}
                  </p>
                  <ul className="mt-6 flex-1 space-y-2.5 text-[15px]">
                    {p.features.map((f) =>
                      f === p.highlight ? (
                        <li key={f} className="flex items-center gap-2.5">
                          <span className="text-brand">✓</span>
                          <span className="font-semibold text-ink">{f}</span>
                          <span className="shrink-0 rounded-full bg-mist px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap text-brand">
                            Only in Studio
                          </span>
                        </li>
                      ) : (
                        <li key={f} className="flex gap-2.5">
                          <span className={p.popular ? "text-white" : "text-brand"}>✓</span>
                          <span className={p.popular ? "text-white/90" : "text-ink-soft"}>{f}</span>
                        </li>
                      ),
                    )}
                    {p.missing.map((f) => (
                      <li key={f} className="flex gap-2.5">
                        <span className={p.popular ? "text-white/35" : "text-ink-faint/60"}>✕</span>
                        <span className={`line-through ${p.popular ? "text-white/45" : "text-ink-faint"}`}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  {checkoutEnabled ? (
                    <form action="/api/checkout" method="post" className="mt-8">
                      <input type="hidden" name="plan" value={p.name.toLowerCase()} />
                      <button type="submit" className={`h-12 w-full text-[15px] ${planButton(p.popular)}`}>
                        Start 7-day free trial
                      </button>
                    </form>
                  ) : (
                    <a href="#waitlist" className={`mt-8 h-12 text-[15px] ${planButton(p.popular)}`}>
                      Join the waitlist
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-ink-faint">Prices excl. VAT. Yearly billing: 2 months free.</p>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-24 px-4 py-24">
          <SectionHead title="Got Questions? We've Got Answers." />
          <div className="mx-auto mt-12 max-w-3xl space-y-3">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <details className="group rounded-2xl border border-[#e3eaf8] bg-white px-6 py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold">
                    {f.q}
                    <span className="faq-icon flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mist text-brand transition-transform duration-300">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-ink-soft">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section id="waitlist" className="scroll-mt-24 px-4 pt-6 pb-28">
          <Reveal className="mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-[40px] bg-brand px-6 py-16 text-center text-white sm:px-16 sm:py-20">
              
              <div className="relative">
                <Image
                  src="/brand/quietlead-icon.png"
                  alt="QuietLead logo"
                  width={64}
                  height={64}
                  className="mx-auto rounded-2xl ring-1 ring-white/30"
                />
                <h2 className="mx-auto mt-6 max-w-3xl text-[34px] leading-[1.1] font-semibold tracking-tight text-balance sm:text-6xl">
                  Your Next Customers Are Out There. Reach Them <em>Quietly</em>.
                </h2>
                <p className="mx-auto mt-5 max-w-lg text-lg text-white/85">
                  Join the waitlist and be among the first to get access.
                </p>
                <div className="mt-9">
                  <WaitlistForm source="footer-cta" onDark center />
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-ink/5 px-4 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-ink-soft sm:flex-row">
          <div className="flex items-center gap-2.5">
            <Image src="/brand/quietlead-icon.png" alt="" width={26} height={26} className="rounded-lg" />
            <span className="font-semibold text-ink">QuietLead</span>
            <span className="text-ink-faint">· Made in Frankfurt</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="/imprint" className="hover:text-ink">Imprint</a>
            <a href="/privacy" className="hover:text-ink">Privacy Policy</a>
            <a href="/terms" className="hover:text-ink">Terms of Service</a>
            <span className="text-ink-faint">© 2026 QuietLead</span>
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-6xl text-center text-xs text-ink-faint sm:text-left">
          No cookies, no tracking. This site sets no cookies, so there is nothing to consent to.{" "}
          <a href="/privacy" className="underline underline-offset-2 hover:text-ink">Cookie &amp; privacy details</a>
        </p>
      </footer>
    </>
  );
}
