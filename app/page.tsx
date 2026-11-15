import Image from "next/image";
import { Nav } from "@/components/Nav";
import { HeroMockup } from "@/components/HeroMockup";
import { WaitlistForm } from "@/components/WaitlistForm";
import { Reveal } from "@/components/Reveal";

const problems = [
  {
    title: "Inboxes are full",
    text: "Your prospects get dozens of cold emails a day. Templates with a first name don't stand out anymore.",
  },
  {
    title: "Volume burns your domain",
    text: "Blasting thousands of emails lands you in spam. One bad week can hurt your sender reputation for months.",
  },
  {
    title: "Research takes forever",
    text: "Writing one truly personal message takes 20 minutes. Nobody running a small team has that time every day.",
  },
];

const steps = [
  {
    n: "01",
    title: "Describe your ideal customer",
    text: "In plain words. “Web agencies in Germany with 5 to 30 people that are hiring.” That's it.",
  },
  {
    n: "02",
    title: "QuietLead finds the right moment",
    text: "AI scans companies for buying signals: new hires, funding, outdated websites, new locations.",
  },
  {
    n: "03",
    title: "You get a briefing and a draft",
    text: "Every lead comes with a short research note and a personal message that sounds like you.",
  },
  {
    n: "04",
    title: "Approve, send, learn",
    text: "Send from your own inbox with one click. Every reply makes tomorrow's leads better.",
  },
];

const features = [
  { icon: "◎", title: "Signal-based leads", text: "Reach companies when they actually need you, not when your sequence says so." },
  { icon: "✎", title: "Real personalization", text: "Drafts built from real research, not {{firstName}} and a guess." },
  { icon: "✓", title: "Human approval", text: "Nothing goes out without your click. You stay in control of every word." },
  { icon: "✉", title: "Your own inbox", text: "Sends through Gmail or Outlook. Low volume keeps your domain healthy." },
  { icon: "☰", title: "Daily briefings", text: "10 to 50 hand-picked leads a day. Enough to grow, small enough to do well." },
  { icon: "§", title: "Built for Europe", text: "GDPR in mind from day one, German and English outreach, EU-friendly by design." },
];

const comparison = [
  ["Volume", "Thousands of emails", "10 to 50 per day"],
  ["Personalization", "{{firstName}} templates", "Real research per lead"],
  ["Control", "Runs on autopilot", "You approve every message"],
  ["Deliverability", "Burns your domain", "Your inbox, low volume"],
  ["How it feels", "Spam", "“They actually looked us up.”"],
];

const plans = [
  {
    name: "Quiet",
    price: 49,
    leads: "150 leads / month",
    for: "Freelancers and consultants",
    features: ["Lead briefings and drafts", "Send from Gmail or Outlook", "Reply tracking", "Email support"],
  },
  {
    name: "Steady",
    price: 149,
    leads: "500 leads / month",
    for: "Small agencies",
    features: ["Everything in Quiet", "Buying-signal alerts", "Custom writing style", "Follow-up drafts"],
    popular: true,
  },
  {
    name: "Studio",
    price: 349,
    leads: "1,500 leads / month",
    for: "Growing teams",
    features: ["Everything in Steady", "3 team seats", "Multiple ICPs", "CRM export"],
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
    q: "What does the founding member offer include?",
    a: "The first 50 customers get 50% off their plan for as long as they stay subscribed. Join the waitlist to secure a spot.",
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

function SectionHead({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-medium text-brand">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-medium tracking-tight text-balance sm:text-[44px] sm:leading-[1.1]">
        {title}
      </h2>
      {text && <p className="mt-4 text-lg text-pretty text-ink-soft">{text}</p>}
    </Reveal>
  );
}

export default function Home() {
  return (
    <>
      <Nav />

      <main id="top">
        {/* HERO */}
        <section className="relative overflow-hidden px-4 pt-36 pb-24 sm:pt-44">
          <div className="blob -top-24 -left-24 h-[420px] w-[420px] bg-sky/50" />
          <div className="blob top-40 -right-32 h-[460px] w-[460px] bg-brand/30 [animation-delay:-8s]" />
          <div className="blob bottom-0 left-1/3 h-[300px] w-[300px] bg-white [animation-delay:-14s]" />

          <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] [&>*]:min-w-0">
            <div>
              <div className="fade-up">
                <p className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium text-ink-soft">
                  <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-brand text-brand" />
                  Private beta · Founding spots open
                </p>
              </div>
              <div className="fade-up" style={{ animationDelay: "80ms" }}>
                <h1 className="mt-6 text-[44px] leading-[1.04] font-medium tracking-[-0.035em] text-balance sm:text-6xl lg:text-[68px]">
                  Finding leads <span className="text-brand">without the noise.</span>
                </h1>
              </div>
              <div className="fade-up" style={{ animationDelay: "160ms" }}>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-pretty text-ink-soft">
                  QuietLead finds a handful of perfect-fit prospects every day, spots the right moment and
                  drafts a message as personal as if you took 20 minutes. You approve. It sends. Quietly.
                </p>
              </div>
              <div className="fade-up mt-8" style={{ animationDelay: "240ms" }}>
                <WaitlistForm source="hero" />
              </div>
            </div>

            <div className="fade-up" style={{ animationDelay: "200ms" }}>
              <HeroMockup />
            </div>
          </div>
        </section>

        {/* PROBLEM */}
        <section className="px-4 py-24">
          <SectionHead
            eyebrow="The problem"
            title="Cold outreach got loud. And it stopped working."
            text="Most sales tools sell volume. More emails, more sequences, more noise. Your prospects learned to ignore all of it."
          />
          <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-3">
            {problems.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <div className="glass h-full rounded-3xl p-7">
                  <h3 className="text-lg font-medium">{p.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-soft">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="scroll-mt-24 px-4 py-24">
          <SectionHead
            eyebrow="How it works"
            title="Fewer leads. Better timing. Real conversations."
          />
          <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 80}>
                <div className="glass flex h-full gap-5 rounded-3xl p-7">
                  <span className="text-sm font-medium text-brand tabular-nums">{s.n}</span>
                  <div>
                    <h3 className="text-lg font-medium">{s.title}</h3>
                    <p className="mt-2 leading-relaxed text-ink-soft">{s.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="scroll-mt-24 px-4 py-24">
          <SectionHead
            eyebrow="Features"
            title="Everything you need to prospect like a human. At AI speed."
          />
          <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 80}>
                <div className="glass h-full rounded-3xl p-7">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-lg text-white shadow-md shadow-brand/30">
                    {f.icon}
                  </span>
                  <h3 className="mt-5 text-lg font-medium">{f.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-soft">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* COMPARISON */}
        <section className="px-4 py-24">
          <SectionHead eyebrow="Why QuietLead" title="Built for quality, not volume." />
          <Reveal className="mx-auto mt-14 max-w-4xl">
            <div className="glass overflow-hidden rounded-3xl">
              <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-ink/5 px-5 py-4 text-sm font-medium sm:px-8">
                <span className="text-ink-faint" />
                <span className="text-ink-faint">Volume tools</span>
                <span className="flex items-center gap-2 text-brand">
                  <Image src="/brand/quietlead-icon.png" alt="" width={20} height={20} className="rounded-md" />
                  QuietLead
                </span>
              </div>
              {comparison.map(([label, them, us]) => (
                <div
                  key={label}
                  className="grid grid-cols-[1fr_1fr_1fr] gap-3 border-b border-ink/5 px-5 py-4 text-sm last:border-0 sm:px-8 sm:text-[15px]"
                >
                  <span className="font-medium">{label}</span>
                  <span className="text-ink-faint">{them}</span>
                  <span className="font-medium text-ink">{us}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* PRICING */}
        <section id="pricing" className="scroll-mt-24 px-4 py-24">
          <SectionHead
            eyebrow="Pricing"
            title="Simple plans. Founding price for life."
            text="The first 50 customers get 50% off, forever. Every plan starts with a 7-day free trial."
          />
          <div className="mx-auto mt-14 grid max-w-5xl items-stretch gap-5 md:grid-cols-3">
            {plans.map((p, i) => (
              <Reveal key={p.name} delay={i * 90}>
                <div
                  className={`relative flex h-full flex-col rounded-3xl p-7 ${
                    p.popular ? "bg-brand text-white shadow-2xl shadow-brand/30" : "glass"
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
                    <span className="text-5xl font-medium tracking-tight">€{(p.price / 2).toFixed(p.price % 2 ? 2 : 0)}</span>
                    <span className={`text-sm line-through ${p.popular ? "text-white/50" : "text-ink-faint"}`}>
                      €{p.price}
                    </span>
                    <span className={`text-sm ${p.popular ? "text-white/70" : "text-ink-soft"}`}>/ month</span>
                  </div>
                  <p className={`mt-1 text-xs ${p.popular ? "text-white/70" : "text-ink-faint"}`}>
                    Founding price · {p.leads}
                  </p>
                  <ul className="mt-6 flex-1 space-y-2.5 text-[15px]">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-2.5">
                        <span className={p.popular ? "text-white" : "text-brand"}>✓</span>
                        <span className={p.popular ? "text-white/90" : "text-ink-soft"}>{f}</span>
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
          <SectionHead eyebrow="FAQ" title="Questions, answered quietly." />
          <div className="mx-auto mt-14 max-w-3xl space-y-3">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <details className="glass group rounded-2xl px-6 py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-medium">
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
        <section id="waitlist" className="scroll-mt-24 px-4 pt-12 pb-28">
          <Reveal className="mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-[36px] bg-brand px-6 py-16 text-center text-white sm:px-16 sm:py-20">
              <div className="blob -top-20 -left-10 h-72 w-72 bg-sky opacity-70" />
              <div className="blob -right-16 -bottom-24 h-80 w-80 bg-white/40 [animation-delay:-10s]" />
              <div className="relative">
                <Image
                  src="/brand/quietlead-icon.png"
                  alt="QuietLead logo"
                  width={64}
                  height={64}
                  className="mx-auto rounded-2xl ring-1 ring-white/30"
                />
                <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-medium tracking-tight text-balance sm:text-5xl">
                  Your next customers are out there. Reach them quietly.
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-lg text-white/75">
                  Join the waitlist and lock in 50% off for life as a founding member.
                </p>
                <div className="mt-8 flex justify-center">
                  <WaitlistForm source="footer-cta" onDark />
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-ink/5 px-4 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm text-ink-soft sm:flex-row">
          <div className="flex items-center gap-2.5">
            <Image src="/brand/quietlead-icon.png" alt="" width={26} height={26} className="rounded-lg" />
            <span className="font-medium text-ink">QuietLead</span>
            <span className="text-ink-faint">· Made in Frankfurt</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-ink">Imprint</a>
            <a href="#" className="hover:text-ink">Privacy</a>
            <span className="text-ink-faint">© 2026 QuietLead</span>
          </div>
        </div>
      </footer>
    </>
  );
}
