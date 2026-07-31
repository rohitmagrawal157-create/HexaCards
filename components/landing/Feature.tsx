"use client";

import {
  Phone,
  Mail,
  Globe,
  FileText,
  MessageCircle,
  Share2,
  ChevronLeft,
  IdCard,
  Link2,
  BookOpen,
  CalendarClock,
  UserPlus,
} from "lucide-react";

type IconProps = { className?: string; strokeWidth?: number };

function LinkedinIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.94 6.5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0zM3.5 8.75h3v11.5h-3V8.75zM9.25 8.75h2.87v1.57h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6v6.89h-3v-6.11c0-1.46-.03-3.33-2.03-3.33-2.03 0-2.34 1.59-2.34 3.23v6.21h-3V8.75z" />
    </svg>
  );
}

function InstagramIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2zM17.5 6.95a1.12 1.12 0 1 1-2.24 0 1.12 1.12 0 0 1 2.24 0z" />
      <path d="M12 3.5c-2.4 0-2.7.01-3.65.05a5.57 5.57 0 0 0-3.8 3.8C4.51 8.3 4.5 8.6 4.5 12s.01 3.7.05 4.65a5.57 5.57 0 0 0 3.8 3.8c.95.04 1.25.05 3.65.05s2.7-.01 3.65-.05a5.57 5.57 0 0 0 3.8-3.8c.04-.95.05-1.25.05-3.65s-.01-3.7-.05-4.65a5.57 5.57 0 0 0-3.8-3.8C14.7 3.51 14.4 3.5 12 3.5zm0 1.7c2.36 0 2.64.01 3.57.05 1.9.09 2.79.99 2.88 2.88.04.93.05 1.21.05 3.57s-.01 2.64-.05 3.57c-.09 1.9-.98 2.79-2.88 2.88-.93.04-1.21.05-3.57.05s-2.64-.01-3.57-.05c-1.9-.09-2.79-.98-2.88-2.88-.04-.93-.05-1.21-.05-3.57s.01-2.64.05-3.57c.09-1.89.98-2.79 2.88-2.88.93-.04 1.21-.05 3.57-.05z" />
    </svg>
  );
}

function XIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.66 3H20.5l-6.54 7.48L21.5 21h-5.9l-4.62-6.04L5.7 21H2.85l7-8.01L2.5 3h6.05l4.17 5.52L17.66 3zm-1.04 16.2h1.63L7.45 4.7H5.7l10.92 14.5z" />
    </svg>
  );
}

const includes = [
  { label: "Contact details", Icon: IdCard },
  { label: "Social media links", Icon: Link2 },
  { label: "Brochures or PDFs", Icon: BookOpen },
  { label: "Meeting links", Icon: CalendarClock },
];

const quickActions = [
  { label: "Phone", Icon: Phone, bg: "#34C759" },
  { label: "Email", Icon: Mail, bg: "#0A84FF" },
  { label: "Website", Icon: Globe, bg: "#0A84FF" },
  { label: "Brochure", Icon: FileText, bg: "#D32F2F" },
];

const socialActions = [
  { label: "LinkedIn", Icon: LinkedinIcon, bg: "#0A66C2" },
  {
    label: "Instagram",
    Icon: InstagramIcon,
    bg: "linear-gradient(135deg,#F58529,#DD2A7B,#8134AF)",
  },
  { label: "WhatsApp", Icon: MessageCircle, bg: "#25D366" },
  { label: "X", Icon: XIcon, bg: "#171412" },
];

const callouts = [
  { label: "Your Cover Img", top: "14%" },
  { label: "Your Bio", top: "46%" },
  { label: "Your Social icons", top: "78%" },
];

/** Right-side hex nest — different from hero (pointy-top, gold tint, right-anchored) */
function FeatureRightBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-y-0 right-0 z-0 w-full overflow-hidden sm:w-[58%] lg:w-[52%]"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_65%_at_78%_45%,#ffffff_0%,transparent_72%)]" />

      <svg
        className="absolute inset-0 h-full w-full opacity-[0.4]"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMaxYMid slice"
      >
        <defs>
          <pattern
            id="featureHexTile"
            width="92"
            height="106"
            patternUnits="userSpaceOnUse"
          >
            {/* Pointy-top hex — different orientation from hero */}
            <path
              d="M46 4 L84 26 L84 70 L46 92 L8 70 L8 26 Z"
              fill="none"
              stroke="#64748b"
              strokeOpacity="0.28"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            <path
              d="M46 4 L84 26 L84 70 L46 92 L8 70 L8 26 Z"
              fill="#BC7C10"
              fillOpacity="0.03"
            />
            <path
              d="M92 57 L130 79 L130 123 L92 145 L54 123 L54 79 Z"
              fill="none"
              stroke="#64748b"
              strokeOpacity="0.18"
              strokeWidth="1"
              strokeLinejoin="round"
              transform="translate(-46 -53)"
            />
          </pattern>

          <linearGradient id="featureHexFadeL" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFFCF6" stopOpacity="1" />
            <stop offset="28%" stopColor="#FFFCF6" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#FFFCF6" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="featureHexFadeY" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFCF6" stopOpacity="0.9" />
            <stop offset="18%" stopColor="#FFFCF6" stopOpacity="0" />
            <stop offset="82%" stopColor="#FFFCF6" stopOpacity="0" />
            <stop offset="100%" stopColor="#FFFCF6" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#featureHexTile)" />
        <rect width="100%" height="100%" fill="url(#featureHexFadeL)" />
        <rect width="100%" height="100%" fill="url(#featureHexFadeY)" />
      </svg>
    </div>
  );
}

function PhoneMockup() {
  return (
    <div className="relative w-[260px] shrink-0 sm:w-[280px]">
      <div className="relative overflow-hidden rounded-[2.5rem] border-[10px] border-[#141414] bg-[#141414] shadow-2xl shadow-black/25">
        <div className="absolute top-0 left-1/2 z-20 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-[#141414]" />

        <div className="relative overflow-hidden rounded-[1.9rem] bg-[#0f0f12]">
          <div className="relative z-10 flex items-center justify-between px-5 pt-3 pb-1 text-[11px] font-semibold text-white">
            <span>9:41</span>
            <span className="h-2.5 w-3.5 rounded-sm border border-white" />
          </div>

          <div className="relative h-24 w-full bg-gradient-to-br from-[#7a8fa6] to-[#c7d2dd]">
            <span className="absolute top-2 left-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white">
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </span>
            <span className="absolute top-2 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white">
              <Share2 className="h-3.5 w-3.5" aria-hidden />
            </span>
          </div>

          <div className="relative -mt-8 rounded-t-3xl bg-[#1c1c22] px-4 pt-10 pb-4">
            <div className="absolute -top-8 left-1/2 h-16 w-16 -translate-x-1/2 overflow-hidden rounded-full border-4 border-[#1c1c22] bg-[#BC7C10]">
              <div className="flex h-full w-full items-center justify-center text-lg font-bold text-white">
                HC
              </div>
            </div>

            <div className="text-center">
              <p className="text-base font-bold text-white">Alex Morgan</p>
              <p className="mt-0.5 text-xs font-medium text-white/50">
                Graphic Designer
              </p>
              <p className="mt-3 text-[11px] leading-relaxed text-white/60">
                Passionate about clean design and clear communication. Always
                open to new collaborations and creative challenges.
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className="flex-1 rounded-full border border-white/20 py-2.5 text-center text-xs font-bold text-white">
                Exchange Contact
              </span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-white">
                <UserPlus className="h-4 w-4" aria-hidden />
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-1.5 px-3 py-3">
            {quickActions.map(({ label, Icon, bg }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                  style={{ background: bg }}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </span>
                <span className="text-[8px] font-medium text-white/60">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-1.5 px-3 pb-5">
            {socialActions.map(({ label, Icon, bg }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                  style={{ background: bg }}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-[8px] font-medium text-white/60">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Feature() {
  return (
    <section
      id="features"
      className="relative scroll-mt-20 overflow-hidden bg-[#FFFCF6] py-16 sm:py-24"
    >
      <FeatureRightBackground />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-10 xl:gap-16">
          {/* Copy */}
          <div className="max-w-xl">
            <h2 className="text-3xl font-extrabold leading-[1.15] tracking-tight text-[#0f0f12] sm:text-4xl lg:text-5xl">
              Your First Impression, Unique and Smart-Always
            </h2>

            <p className="mt-5 text-base leading-relaxed text-[#4a4a52] sm:text-lg">
              Create your digital profile in minutes and share it with anyone,
              anywhere — seamlessly and efficiently.
            </p>

            <p className="mt-4 text-base leading-relaxed text-[#4a4a52] sm:text-lg">
              With Hexa Cards, you can share all your details instantly and
              update them in real time. Whether it&apos;s for business,
              networking, or personal branding, your profile is always up to
              date and ready to impress.
            </p>

            <p className="mt-6 text-base font-semibold text-[#0f0f12] sm:text-lg">
              Share anything you need, including:
            </p>

            <ul className="mt-4 space-y-3 sm:mt-5 sm:space-y-4">
              {includes.map(({ label, Icon }) => (
                <li key={label} className="flex items-center gap-3">
                  <Icon
                    className="h-5 w-5 shrink-0 text-[#1a1a1a]"
                    strokeWidth={1.75}
                  />
                  <span className="text-sm font-semibold text-[#0f0f12] sm:text-base">
                    {label}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href="#products"
              className="mt-8 inline-flex rounded-full bg-[#BC7C10] px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-black/10 transition-transform active:scale-[0.98] sm:px-8 sm:py-4 sm:text-base"
            >
              Get Your Hexa Card
            </a>
          </div>

          {/* Phone + callouts */}
          <div className="flex flex-col items-center gap-6 lg:items-end">
            <div className="relative flex items-start">
              <PhoneMockup />

              {/* Desktop callouts — own column, never compresses the phone */}
              <div
                className="relative ml-1 hidden h-[520px] w-[160px] shrink-0 xl:ml-2 xl:w-[200px] lg:block"
                aria-hidden
              >
                {callouts.map(({ label, top }) => (
                  <div
                    key={label}
                    className="absolute left-0 flex items-center"
                    style={{ top }}
                  >
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-[#1a1a1a] bg-white" />
                    <span className="h-px w-10 shrink-0 bg-[#1a1a1a] xl:w-14" />
                    <span className="ml-2 text-base leading-tight font-bold whitespace-nowrap text-[#0f0f12] xl:text-xl">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile labels */}
            <ul className="flex flex-wrap justify-center gap-2 lg:hidden">
              {callouts.map(({ label }) => (
                <li
                  key={label}
                  className="rounded-full border border-black/10 bg-[#f7f7f8] px-3 py-1.5 text-xs font-semibold text-[#0f0f12]"
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
