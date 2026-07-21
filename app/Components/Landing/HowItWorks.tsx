type Step = {
  step: string;
  title: string;
  description: string;
  icon: "tap" | "share" | "grow";
};

const steps: Step[] = [
  {
    step: "1",
    title: "Tap or Scan",
    description: "Tap your Hexa Card or scan the QR code",
    icon: "tap",
  },
  {
    step: "2",
    title: "Share Instantly",
    description: "Your digital profile opens instantly on their phone",
    icon: "share",
  },
  {
    step: "3",
    title: "Connect & Grow",
    description: "Save contact, follow, enquire or do business",
    icon: "grow",
  },
];

function TapIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 72 72"
      fill="none"
      stroke="url(#howTapGrad)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <defs>
        <linearGradient id="howTapGrad" x1="12" y1="8" x2="60" y2="64">
          <stop stopColor="#BC7C10" />
          <stop offset="1" stopColor="#BC7C10" />
        </linearGradient>
      </defs>
      <path d="M36 12c-5.5 0-10 4.5-10 10 0 2.8 1.1 5.3 2.9 7.2" />
      <path d="M36 12c5.5 0 10 4.5 10 10 0 2.8-1.1 5.3-2.9 7.2" />
      <path d="M36 29.2V42c0 3.2 2 5.8 5 6.5l10.5 2.5c3.8 1 6.5 4.5 6.5 8.5V58" />
      <path d="M31 48.5V58" />
      <path d="M26 44.5V58" />
      <path d="M21 48V58" />
      <circle cx="36" cy="22" r="2.5" fill="url(#howTapGrad)" stroke="none" />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 72 72"
      fill="none"
      stroke="url(#howShareGrad)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <defs>
        <linearGradient id="howShareGrad" x1="14" y1="10" x2="58" y2="62">
          <stop stopColor="#BC7C10" />
          <stop offset="1" stopColor="#BC7C10" />
        </linearGradient>
      </defs>
      <rect x="22" y="10" width="28" height="52" rx="5" />
      <circle cx="36" cy="30" r="7" />
      <path d="M27 48c3-5.5 7.5-8 9-8s6 2.5 9 8" />
      <path d="M30 16h12" />
    </svg>
  );
}

function GrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 72 72"
      fill="none"
      stroke="url(#howGrowGrad)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <defs>
        <linearGradient id="howGrowGrad" x1="10" y1="14" x2="62" y2="58">
          <stop stopColor="#BC7C10" />
          <stop offset="1" stopColor="#BC7C10" />
        </linearGradient>
      </defs>
      <path d="M14 54h44" />
      <path d="M20 54V40" />
      <path d="M30 54V28" />
      <path d="M40 54V34" />
      <path d="M50 54V18" />
      <path d="M42 14h14v14" />
      <path d="M56 14 34 36" />
    </svg>
  );
}

function StepIcon({ type }: { type: Step["icon"] }) {
  const className =
    "h-[72px] w-[72px] shrink-0 transition-transform duration-300 ease-out group-hover:scale-110 sm:h-20 sm:w-20";
  if (type === "tap") return <TapIcon className={className} />;
  if (type === "share") return <ShareIcon className={className} />;
  return <GrowIcon className={className} />;
}

function DottedConnector() {
  return (
    <div
      className="pointer-events-none absolute top-1/2 right-0 z-10 hidden w-6 -translate-y-1/2 translate-x-1/2 items-center md:flex lg:w-10"
      aria-hidden
    >
      <div className="h-px flex-1 border-t-2 border-dashed border-[#BC7C10]/45" />
      <svg
        className="h-2.5 w-2.5 shrink-0 text-[#BC7C10]"
        viewBox="0 0 10 10"
        fill="currentColor"
      >
        <path d="M1.5 0.5 9 5 1.5 9.5V0.5Z" />
      </svg>
    </div>
  );
}

function StepCard({ item }: { item: Step }) {
  return (
    <article className="group flex h-full items-center gap-4 rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_4px_24px_rgba(15,23,42,0.04)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#BC7C10]/35 hover:shadow-[0_16px_40px_rgba(188,124,16,0.12)] sm:gap-5 sm:p-6">
      <StepIcon type={item.icon} />

      <div className="min-w-0 flex-1 text-left">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#BC7C10] text-xs font-bold text-white transition-colors duration-300 group-hover:bg-[#9a650d]">
          {item.step}
        </span>

        <h3 className="mt-2.5 text-lg font-bold leading-tight text-[#141414] transition-colors duration-300 group-hover:text-[#9a650d] sm:text-xl">
          {item.title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-[#64748B] sm:text-[15px]">
          {item.description}
        </p>
      </div>
    </article>
  );
}

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-20 overflow-hidden bg-white py-16 sm:py-20"
    >
      {/* Gradients: top-left + bottom-right */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <div className="absolute -top-16 -left-16 h-[55%] w-[50%] max-w-lg rounded-full bg-[radial-gradient(ellipse_at_center,#F3EDE3_0%,rgba(188,124,16,0.10)_35%,transparent_70%)]" />
        <div className="absolute -right-16 -bottom-16 h-[55%] w-[50%] max-w-lg rounded-full bg-[radial-gradient(ellipse_at_center,#F3EDE3_0%,rgba(188,124,16,0.10)_35%,transparent_70%)]" />
        <div className="absolute top-0 left-0 h-40 w-40 bg-gradient-to-br from-[#BC7C10]/[0.08] to-transparent sm:h-56 sm:w-56" />
        <div className="absolute right-0 bottom-0 h-40 w-40 bg-gradient-to-tl from-[#BC7C10]/[0.08] to-transparent sm:h-56 sm:w-56" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
        <h2 className="text-center text-2xl font-extrabold tracking-[0.06em] text-[#141414] uppercase sm:text-3xl">
          How It Works
        </h2>

        <ol className="mt-10 grid list-none grid-cols-1 gap-5 p-0 sm:mt-12 md:grid-cols-3 md:gap-6 lg:gap-8">
          {steps.map((item, index) => (
            <li key={item.step} className="relative">
              {index < steps.length - 1 ? <DottedConnector /> : null}
              <StepCard item={item} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}