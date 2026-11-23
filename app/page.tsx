import Image from "next/image";
import { Nav } from "@/components/Nav";
import { HeroMockup } from "@/components/HeroMockup";
import { WaitlistForm } from "@/components/WaitlistForm";
import { Reveal } from "@/components/Reveal";
import { PipelineCalculator } from "@/components/PipelineCalculator";
import { HeroMotion } from "@/components/HeroMotion";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ScrollWords } from "@/components/ScrollWords";
import { StepsStory } from "@/components/StepsStory";
import { GlassLights } from "@/components/GlassLights";
import { ChromeLogo } from "@/components/ChromeLogo";
import { CtaArcs } from "@/components/CtaArcs";
import { Marquee } from "@/components/Marquee";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const marquee = [
  "Up to 50 leads a day",
  "You approve every message",
  "Sent from your own inbox",
  "Real research on every lead",
  "Buying-signal alerts",
  "Designed for GDPR",
  "Built in Frankfurt",
];

type Panel = {
  title: string;
  intro: React.ReactNode;
  items: { title: string; text: string }[];
};

const panels: Panel[] = [
  {
    title: "Describe your customer. Skip the busywork.",
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
        title: "Signal-based timing (Studio)",
        text: "New hires, funding, outdated websites, new locations. QuietLead flags when a company may need you right now, not when a sequence says so.",
      },
    ],
  },
  {
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
        title: "Up to 50 leads a day",
        text: "From a few a day on Quiet to around 50 on Studio. Small enough to treat every lead well. Quality over volume.",
      },
    ],
  },
  {
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
        text: "Each draft is built on public information about the company, so it can reference something specific instead of a generic opener. You check every detail before sending.",
      },
      {
        title: "Your writing style (Steady and Studio)",
        text: "Give QuietLead a few of your own emails and it adapts the drafts to your tone, so they read more like you.",
      },
    ],
  },
  {
    title: "You stay in control. Always.",
    intro: (
      <>
        Nothing leaves your account without your click. QuietLead does the work, <em>you make the call</em>.
      </>
    ),
    items: [
      {
        title: "Approve every message",
        text: "Review, edit or skip each draft. On Steady and Studio one click sends it from your own Gmail or Outlook; on Quiet you copy it into your inbox yourself.",
      },
      {
        title: "Built for Europe",
        text: "Designed with GDPR in mind: low volume, relevant contacts and human review. German and English outreach. Built in Frankfurt.",
      },
    ],
  },
];

const trust = ["You approve every message", "Sent from your own inbox", "Built in Frankfurt, designed for GDPR"];

const comparison = [
  ["Volume", "Often thousands of emails", "Up to 50 per day"],
  ["Personalization", "{{firstName}} templates", "Real research per lead"],
  ["Control", "Runs on autopilot", "You approve every message"],
  ["Deliverability", "High volume can hurt your domain", "Your inbox, low volume"],
  ["How it feels", "Easy to mistake for spam", "Personal and relevant"],
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
    a: "Many outreach tools focus on sending as much as possible. QuietLead focuses on fewer, better-researched leads and a human approving every message. The goal is to send less and earn more replies.",
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
  return popular ? "btn-light" : "btn-primary";
}

// Apple-style section headline: big, medium weight, tight tracking. Lights up word by word
// while scrolling (a newline in the text = line break).
function SectionHead({
  eyebrow,
  title,
  text,
  tone = "dark",
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  tone?: "dark" | "light";
}) {
  return (
    <div className="mx-auto max-w-[820px] text-center">
      {eyebrow && <p className={`text-[17px] font-medium ${tone === "light" ? "text-ink-faint" : "text-ink-soft"}`}>{eyebrow}</p>}
      <ScrollWords
        text={title}
        tone={tone}
        className="mt-2 text-[40px] leading-[1.05] font-medium tracking-[-0.03em] text-balance sm:text-[56px]"
      />
      {text && (
        <Reveal>
          <p className="mx-auto mt-5 max-w-[620px] text-[19px] leading-snug text-pretty text-ink-soft sm:text-[21px]">{text}</p>
        </Reveal>
      )}
    </div>
  );
}

function Check({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`h-4 w-4 shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

function Cross({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`h-4 w-4 shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M7 7l10 10M17 7 7 17" />
    </svg>
  );
}

function Chevron() {
  return (
    <span className="arrow" aria-hidden="true">
      <svg viewBox="0 0 24 24" className="h-[0.8em] w-[0.8em]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5l7 7-7 7" />
      </svg>
    </span>
  );
}

// "<" written as the JSON escape < (backslash built from its char code), so the data
// can never close the surrounding script tag.
const LT_ESCAPE = String.fromCharCode(92) + "u003c";

// Structured data for Google: the product, its price range and the FAQ.
function jsonLd() {
  const prices = plans.map((p) => Number(p.price));
  return [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: SITE_NAME,
      url: SITE_URL,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: SITE_DESCRIPTION,
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "EUR",
        lowPrice: Math.min(...prices).toFixed(2),
        highPrice: Math.max(...prices).toFixed(2),
        offerCount: plans.length,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // Static data from this file only, escaped so it cannot close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()).replaceAll("<", LT_ESCAPE) }}
      />
      <Nav />
      <ScrollProgress />
      <HeroMotion />

      <main id="top">
        {/* HERO: black, centered, big type */}
        <section data-hero className="hero-bg dark-section relative overflow-hidden px-4 pt-36 pb-24 text-center text-white sm:pt-44 sm:pb-32">
          <div className="hero-glass" aria-hidden="true">
            <GlassLights />
          </div>
          <div data-hero-copy className="hero-veil relative z-10 mx-auto max-w-[980px]">
            <div className="fade-up">
              <p className="inline-flex items-center gap-2 text-[17px] font-medium text-ink-faint">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-white text-white" />
                Private beta<span className="hidden sm:inline">&nbsp;· early access opening soon</span>
              </p>
            </div>
            <div className="fade-up" style={{ animationDelay: "100ms" }}>
              <h1 className="mt-5 text-[48px] leading-[1.02] font-medium tracking-[-0.035em] text-balance sm:text-[72px] lg:text-[88px]">
                Find Your Next Customers{" "}
                <em className="draw-underline relative inline-block not-italic">Without</em> the Noise
              </h1>
            </div>
            <div className="fade-up" style={{ animationDelay: "200ms" }}>
              <p className="mx-auto mt-7 max-w-[640px] text-[19px] leading-snug text-pretty text-[#a1a1a6] sm:text-[24px]">
                QuietLead is your AI sales assistant. It finds well-matched leads, watches for the right moment and drafts
                personal outreach you approve.
              </p>
            </div>
            <div className="fade-up mt-10" style={{ animationDelay: "300ms" }}>
              <WaitlistForm source="hero" onDark center />
            </div>
            <ul
              className="fade-up mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[14px] text-[#a1a1a6]"
              style={{ animationDelay: "400ms" }}
            >
              {trust.map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="text-white" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="fade-up relative mx-auto mt-20 max-w-[860px] text-left" style={{ animationDelay: "500ms" }}>
            <HeroMockup />
          </div>
          <p className="relative mx-auto mt-8 max-w-xl text-[12px] text-ink-faint">
            Sending from Gmail or Outlook is included in Steady and Studio. QuietLead never sends anything without your approval.
          </p>
        </section>

        {/* Endless marquee band */}
        <section aria-label="Why QuietLead" className="dark-section border-t border-line-dark bg-black py-7 text-[24px] font-medium tracking-[-0.01em] text-[#86868b] uppercase sm:py-9 sm:text-[36px]">
          <Marquee items={marquee} />
        </section>

        {/* STEPS: pinned scroll story on white */}
        <StepsStory />
        <div className="relative -mt-14 px-4 pb-28 text-center sm:-mt-20">
          <Reveal>
            <a href="#waitlist" className="btn-primary h-[52px] px-8 text-[17px]">
              Get early access
            </a>
            <p className="mt-4 text-[14px] text-ink-faint">Built for agencies, consultants and B2B teams</p>
          </Reveal>
        </div>

        {/* FEATURES: white tiles with hairline borders on light grey */}
        <section id="features" className="scroll-mt-12 bg-mist px-4 py-28 sm:py-36">
          <SectionHead eyebrow="Features" title={"Everything you need.\nNothing you don't."} />
          <div className="mx-auto mt-16 max-w-[980px] space-y-5">
            {panels.map((p) => (
              <Reveal key={p.title}>
                <div className="panel px-7 py-10 sm:px-14 sm:py-14">
                  <ScrollWords
                    text={p.title}
                    className="max-w-[680px] text-[30px] leading-[1.1] font-medium tracking-[-0.025em] text-ink sm:text-[40px]"
                  />
                  <p className="mt-4 max-w-[640px] text-[19px] leading-snug text-ink-soft [&_em]:not-italic [&_em]:text-ink">
                    {p.intro}
                  </p>
                  <div className="mt-10 grid border-t border-line md:grid-cols-2">
                    {p.items.map((it, i) => (
                      <div
                        key={it.title}
                        className={`pt-7 pb-2 ${i === 0 ? "md:border-r md:border-line md:pr-10" : "border-t border-line md:border-t-0 md:pl-10"}`}
                      >
                        <h3 className="text-[19px] font-medium tracking-tight text-ink">{it.title}</h3>
                        <p className="mt-2 text-[17px] leading-relaxed text-ink-soft">{it.text}</p>
                      </div>
                    ))}
                  </div>
                  <a href="#waitlist" className="link-arrow mt-9">
                    Join the waitlist
                    <Chevron />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* COMPARISON */}
        <section className="px-4 py-28 sm:py-36">
          <SectionHead
            title={"Everyone's Sending More.\nWhy Not Send Better?"}
            text="Volume tools fill inboxes. QuietLead helps you write to fewer people, better."
          />
          <Reveal className="mx-auto mt-16 max-w-[860px]">
            <div className="glass overflow-hidden rounded-[28px]">
              <div className="grid grid-cols-3 border-b border-line bg-mist px-5 py-4 text-[14px] font-medium sm:px-8">
                <span />
                <span className="text-ink-faint">Volume tools</span>
                <span className="flex items-center gap-2 text-ink">
                  <Image src="/brand/quietlead-icon.png" alt="" width={20} height={20} className="logo-mono rounded-[5px]" />
                  QuietLead
                </span>
              </div>
              {comparison.map(([label, them, us]) => (
                <div
                  key={label}
                  className="grid grid-cols-3 gap-3 border-b border-line px-5 py-5 text-[14px] last:border-0 sm:px-8 sm:text-[17px]"
                >
                  <span className="font-medium">{label}</span>
                  <span className="text-ink-faint">{them}</span>
                  <span className="text-ink">{us}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* CALCULATOR */}
        <section className="bg-mist px-4 py-28 sm:py-36">
          <SectionHead
            title="Calculate your monthly pipeline"
            text="Move the sliders to see what a quiet, steady flow of leads can mean for your business."
          />
          <Reveal className="mx-auto mt-16 max-w-[980px]">
            <div className="glass rounded-[28px] p-6 sm:p-10">
              <PipelineCalculator />
            </div>
          </Reveal>
        </section>

        {/* PRICING */}
        <section id="pricing" className="scroll-mt-12 px-4 py-28 sm:py-36">
          <SectionHead
            eyebrow="Pricing"
            title="Simple plans. Start small, grow quietly."
            text="Every plan starts with a 7-day free trial. Cancel before it ends and you pay nothing."
          />
          <div className="mx-auto mt-16 grid max-w-[980px] items-stretch gap-5 md:grid-cols-3">
            {plans.map((p, i) => (
              <Reveal key={p.name} delay={i * 100}>
                <div
                  className={`relative flex h-full flex-col rounded-[28px] p-8 ${
                    p.popular ? "glass-accent text-white" : "glass"
                  }`}
                >
                  {p.popular && (
                    <span className="absolute top-7 right-7 rounded-full border border-white/25 px-2.5 py-1 text-[12px]">
                      Recommended
                    </span>
                  )}
                  <h3 className="text-[24px] font-medium tracking-tight">{p.name}</h3>
                  <p className={`mt-1 text-[14px] ${p.popular ? "text-[#a1a1a6]" : "text-ink-soft"}`}>{p.for}</p>
                  {/* Free during the 7-day trial; the price after the trial stays visible right below. */}
                  <div className="mt-8 flex items-baseline gap-2">
                    <span className="text-[48px] font-medium tracking-[-0.03em]">€0</span>
                    <span className={`text-[14px] ${p.popular ? "text-[#a1a1a6]" : "text-ink-soft"}`}>for 7 days</span>
                  </div>
                  <p className={`mt-1 text-[14px] ${p.popular ? "text-white" : "text-ink"}`}>then €{p.price} / month</p>
                  <p className={`mt-1 text-[12px] ${p.popular ? "text-[#a1a1a6]" : "text-ink-faint"}`}>{p.leads}</p>
                  <ul
                    className={`mt-7 flex-1 space-y-3 border-t pt-7 text-[15px] ${p.popular ? "border-line-dark" : "border-line"}`}
                  >
                    {p.features.map((f) =>
                      f === p.highlight ? (
                        <li key={f} className="flex items-center gap-2.5">
                          <Check />
                          <span className="font-medium text-ink">{f}</span>
                          <span className="shrink-0 rounded-full border border-line px-2 py-0.5 text-[11px] whitespace-nowrap text-ink-soft">
                            Only in Studio
                          </span>
                        </li>
                      ) : (
                        <li key={f} className="flex items-center gap-2.5">
                          <Check />
                          <span className={p.popular ? "text-white" : "text-ink"}>{f}</span>
                        </li>
                      ),
                    )}
                    {p.missing.map((f) => (
                      <li key={f} className="flex items-center gap-2.5">
                        <Cross className={p.popular ? "text-[#6e6e73]" : "text-ink-faint"} />
                        <span className={`line-through ${p.popular ? "text-[#6e6e73]" : "text-ink-faint"}`}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  {checkoutEnabled ? (
                    <form action="/api/checkout" method="post" className="mt-9">
                      <input type="hidden" name="plan" value={p.name.toLowerCase()} />
                      <button type="submit" className={`h-12 w-full text-[17px] ${planButton(p.popular)}`}>
                        Start 7-day free trial
                      </button>
                    </form>
                  ) : (
                    <a href="#waitlist" className={`mt-9 h-12 text-[17px] ${planButton(p.popular)}`}>
                      Join the waitlist
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-center text-[12px] text-ink-faint">
            Prices per month, excl. VAT. VAT is shown before you pay. No setup fees, cancel anytime.
          </p>
        </section>

        {/* FAQ: Apple-style list with hairlines */}
        <section id="faq" className="scroll-mt-12 bg-mist px-4 py-28 sm:py-36">
          <SectionHead title="Got Questions? We've Got Answers." />
          <div className="mx-auto mt-14 max-w-[820px] border-t border-line">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <details className="group border-b border-line py-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[19px] font-medium tracking-tight sm:text-[21px]">
                    {f.q}
                    <span className="faq-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-transform duration-500 ease-[cubic-bezier(0.28,0.11,0.32,1)]">
                      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 max-w-[680px] text-[17px] leading-relaxed text-ink-soft">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </section>

        {/* FINAL CTA: full-bleed black chapter */}
        <section id="waitlist" className="dark-section cta-glow scroll-mt-12 px-4 py-32 text-center text-white sm:py-44">
          <CtaArcs />
          <Reveal className="mx-auto max-w-[980px]">
            <div role="img" aria-label="QuietLead logo" className="flex justify-center">
              <ChromeLogo size={112} />
            </div>
            <ScrollWords
              tone="light"
              text="Your Next Customers Are Out There. Reach Them *Quietly*."
              className="mx-auto mt-8 max-w-[820px] text-[40px] leading-[1.05] font-medium tracking-[-0.03em] text-balance sm:text-[64px]"
            />
            <p className="mx-auto mt-6 max-w-lg text-[19px] text-[#a1a1a6] sm:text-[21px]">
              Join the waitlist and be among the first to get access.
            </p>
            <div className="mt-10">
              <WaitlistForm source="footer-cta" onDark center />
            </div>
          </Reveal>
        </section>
      </main>

      {/* FOOTER: Apple-style small print on light grey */}
      <footer className="border-t border-line bg-black px-4 pt-10 pb-12 text-[12px] text-ink-soft">
        <div className="mx-auto max-w-[980px]">
          <p className="border-b border-line pb-5 leading-relaxed text-ink-faint">
            No tracking. The only cookies are the ones the waitlist needs to work, so there is nothing to consent to.{" "}
            <a href="/cookies" className="text-ink-soft underline underline-offset-2 hover:text-ink">
              Cookie policy
            </a>
          </p>
          <div className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Image src="/brand/quietlead-icon.png" alt="" width={18} height={18} className="logo-mono rounded-[4px]" />
              <span className="text-ink">QuietLead</span>
              <span className="text-ink-faint">· Made in Frankfurt · © 2026</span>
            </div>
            <div className="flex flex-wrap gap-x-0 gap-y-2">
              {[
                ["/imprint", "Imprint"],
                ["/privacy", "Privacy Policy"],
                ["/terms", "Terms of Service"],
                ["/refunds", "Refund Policy"],
                ["/cookies", "Cookie Policy"],
                ["/delete-my-data", "Delete my data"],
              ].map(([href, label], i) => (
                <a
                  key={href}
                  href={href}
                  className={`px-2.5 hover:text-ink hover:underline ${i > 0 ? "border-l border-line" : "pl-0"}`}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
