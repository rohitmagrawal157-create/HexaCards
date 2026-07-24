"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Play,
  ChevronLeft,
  ChevronRight,
  Check,
  Smartphone,
  Zap,
  Shield,
  RefreshCw,
  Palette,
  Truck,
  ArrowRight,
  Phone,
  UserRound,
  Share2,
} from "lucide-react";

type MediaItem =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; thumbnail: string; youtubeId: string; alt: string };

const media: MediaItem[] = [
  {
    type: "image",
    src: "/Images/Products/digitalCard.jpg",
    alt: "HexaCards NFC digital business card",
  },
  {
    type: "image",
    src: "/Images/Products/productd1.jpg",
    alt: "HexaCards product detail 1",
  },
  {
    type: "image",
    src: "/Images/Products/productd2.jpg",
    alt: "HexaCards product detail 2",
  },
  {
    type: "image",
    src: "/Images/Products/productd3.jpg",
    alt: "HexaCards product detail 3",
  },
];

const highlights = [
  "One-time payment — no monthly fees",
  "Works on iPhone & Android — no app needed",
  "One card, one profile, unlimited shares",
  "Free design mockup before you pay",
];

const features = [
  {
    icon: Zap,
    title: "Instant share",
    body: "Tap or scan — contacts open your profile in their browser in seconds.",
  },
  {
    icon: Smartphone,
    title: "No app required",
    body: "Recipients don’t need HexaCards or any app. Any modern phone works.",
  },
  {
    icon: RefreshCw,
    title: "Edit anytime",
    body: "Update phone, links, and socials from your dashboard — card stays the same.",
  },
  {
    icon: Palette,
    title: "Premium finishes",
    body: "Black or white body with gold/silver foil or custom accent colors.",
  },
  {
    icon: Shield,
    title: "Lifetime digital",
    body: "Your digital profile stays active with no subscription renewals.",
  },
  {
    icon: Truck,
    title: "Fast India delivery",
    body: "Design in 1–2 days, then express shipping across major cities.",
  },
];

const finishes = [
  { name: "Black · Gold", hint: "Classic foil on matte black" },
  { name: "Black · Silver", hint: "Chrome foil on matte black" },
  { name: "White · Custom", hint: "Accent colors you choose" },
];

const included = [
  "Physical NFC + QR Hexa Card",
  "Lifetime digital profile",
  "Free design assistance on WhatsApp",
  "Print after your approval only",
  "Packaging ready to gift or carry",
];

const deliveryTimes = [
  { city: "Delhi NCR", time: "Next-day delivery*" },
  { city: "Mumbai, Bangalore, Ahmedabad", time: "2 days express" },
  { city: "Other states", time: "2–3 days express" },
];

const price = 799;
const compareAtPrice = 2199;
const discountPercent = Math.round((1 - price / compareAtPrice) * 100);

const trustBadges = [
  { label: "Fast Shipping", icon: "truck" as const },
  { label: "Digital Card Included", icon: "user" as const },
  { label: "Unlimited Sharing", icon: "share" as const },
  { label: "Made in India", icon: "india" as const },
];

function IndiaFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 30 20"
      className={className}
      aria-hidden
      role="img"
    >
      <rect width="30" height="20" fill="#FF9933" />
      <rect y="6.67" width="30" height="6.66" fill="#FFFFFF" />
      <rect y="13.33" width="30" height="6.67" fill="#138808" />
      <circle cx="15" cy="10" r="2.4" fill="none" stroke="#000080" strokeWidth="0.7" />
      <circle cx="15" cy="10" r="0.45" fill="#000080" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      className="group border-b border-black/[0.08] py-4 first:pt-0"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-[#141414] sm:text-base">
        {title}
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFFCF7] text-[#BC7C10] ring-1 ring-[#BC7C10]/20 transition-transform duration-200 group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-[#5c5346]">
        {children}
      </div>
    </details>
  );
}

export default function ProductDetails() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = media[activeIndex];

  function prev() {
    setActiveIndex((i) => (i - 1 + media.length) % media.length);
  }
  function next() {
    setActiveIndex((i) => (i + 1) % media.length);
  }

  return (
    <section className="bg-[#FFFCF7]">
      {/* Slim intro bar */}
      <div className="border-b border-black/[0.06] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-baseline gap-2 px-5 py-3 sm:gap-3 sm:px-8 sm:py-4">
          <p className="text-[10px] font-bold tracking-[0.14em] text-[#BC7C10] uppercase sm:text-xs">
            Product
          </p>
          <h1 className="text-base font-extrabold tracking-tight text-[#141414] sm:text-lg lg:text-xl">
            Hexa NFC Business Card
          </h1>
          <p className="ml-auto hidden text-xs text-[#5c5346] lg:block">
            Design online · Approve · We print & ship
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-5 py-8 sm:gap-10 sm:px-8 sm:py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-12">
        {/* Gallery */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_16px_48px_rgba(15,23,42,0.06)] sm:rounded-3xl">
            {active.type === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={active.src}
                alt={active.alt}
                className="h-full w-full object-contain p-4 sm:p-6"
              />
            ) : (
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${active.youtubeId}?modestbranding=1&rel=0`}
                title={active.alt}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}

            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute top-1/2 left-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/95 text-[#141414] shadow-md transition-transform hover:scale-105"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute top-1/2 right-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/95 text-[#141414] shadow-md transition-transform hover:scale-105"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {media.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`View media ${i + 1}`}
                aria-current={i === activeIndex}
                className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-colors sm:h-16 sm:w-16 ${
                  i === activeIndex
                    ? "border-[#BC7C10]"
                    : "border-black/[0.06] hover:border-black/15"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.type === "image" ? item.src : item.thumbnail}
                  alt=""
                  className="h-full w-full object-contain p-1"
                />
                {item.type === "video" ? (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <Play className="h-4 w-4 fill-white text-white" />
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        {/* Buy / details column */}
        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-[#BC7C10] uppercase">
            Digital Business Card
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#141414] sm:text-3xl">
            NFC Business Card — Hexa Digital Card
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#5c5346] sm:text-base">
            Share contacts, socials, and your brand with one tap or QR scan.
            Premium print finishes, lifetime digital profile, and free design
            help from HexaCards.
          </p>

          <ul className="mt-4 space-y-2">
            {highlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-[#5c5346]"
              >
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#BC7C10]/12 text-[#BC7C10]">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-2xl font-extrabold text-[#141414] sm:text-3xl">
              ₹{price.toLocaleString("en-IN")}
            </span>
            <span className="text-base text-[#5c5346]/70 line-through">
              ₹{compareAtPrice.toLocaleString("en-IN")}
            </span>
            <span className="rounded-full bg-[#BC7C10]/12 px-2.5 py-1 text-xs font-bold text-[#BC7C10]">
              {discountPercent}% OFF
            </span>
          </div>
          <p className="mt-1.5 text-xs text-[#5c5346]">
            Inclusive of design support · Pay after you approve the mockup
          </p>

          <Link
            href="/design-your-card#card-studio"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#BC7C10] py-3.5 text-sm font-bold text-white shadow-md shadow-[#BC7C10]/25 transition-all hover:bg-[#9a650d] active:scale-[0.99]"
          >
            Design Your Card
            <ArrowRight className="h-4 w-4" />
          </Link>

          <a
            href="https://api.whatsapp.com/send?phone=919226286898"
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex items-center gap-3 transition-opacity hover:opacity-95"
          >
            <span className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {/* <img
                src="/Images/Hexacards.jpeg"
                alt=""
                className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow-md"
              /> */}
              {/* <span className="absolute -right-0.5 -bottom-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5">
                <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
              </span> */}
            </span>
            <span className="flex min-w-0 flex-1 flex-col justify-center rounded-2xl bg-[#25D366] px-4 py-2.5 text-white shadow-sm">
              <span className="flex items-center gap-2 text-xs font-medium text-white/95">
                Contact HexaCards
                <span className="rounded-full bg-black/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase">
                  Online
                </span>
              </span>
              <span className="mt-0.5 text-sm font-bold sm:text-base">
                Looking for free design assistance?
              </span>
            </span>
          </a>

          {/* Trust badges — below WhatsApp */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-2">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex flex-col items-center gap-1.5 text-center"
              >
                <span className="flex h-9 w-9 items-center justify-center text-[#141414]">
                  {badge.icon === "truck" ? (
                    <Truck className="h-6 w-6" strokeWidth={1.75} />
                  ) : badge.icon === "user" ? (
                    <UserRound className="h-6 w-6" strokeWidth={1.75} />
                  ) : badge.icon === "share" ? (
                    <Share2 className="h-6 w-6" strokeWidth={1.75} />
                  ) : (
                    <IndiaFlag className="h-5 w-7 rounded-[2px] shadow-sm" />
                  )}
                </span>
                <p className="text-[11px] leading-tight font-medium text-[#141414] sm:text-xs">
                  {badge.label}
                </p>
              </div>
            ))}
          </div>

          {/* Finishes */}
          <div className="mt-8 rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm sm:p-5">
            <p className="text-xs font-bold tracking-wide text-[#BC7C10] uppercase">
              Available finishes
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {finishes.map((f) => (
                <div
                  key={f.name}
                  className="rounded-xl bg-[#FFFCF7] px-3 py-2.5 ring-1 ring-black/[0.04]"
                >
                  <p className="text-sm font-semibold text-[#141414]">
                    {f.name}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#5c5346]">{f.hint}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What’s included */}
          <div className="mt-4 rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm sm:p-5">
            <p className="text-xs font-bold tracking-wide text-[#BC7C10] uppercase">
              What’s included
            </p>
            <ul className="mt-3 space-y-2">
              {included.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-[#5c5346]"
                >
                  <Check
                    className="h-4 w-4 shrink-0 text-[#BC7C10]"
                    strokeWidth={2.5}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Feature grid */}
      <div className="border-t border-black/[0.06] bg-white">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
          <p className="text-xs font-bold tracking-[0.14em] text-[#BC7C10] uppercase">
            Why HexaCards
          </p>
          <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-[#141414] sm:text-3xl">
            Built for real networking
          </h3>
          <p className="mt-2 max-w-2xl text-sm text-[#5c5346] sm:text-base">
            Everything you need to look premium in person and stay editable
            online — without subscriptions or apps on the other side.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-black/[0.06] bg-[#FFFCF7] p-4 sm:p-5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#BC7C10] ring-1 ring-[#BC7C10]/15">
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </span>
                <p className="mt-3 text-sm font-bold text-[#141414]">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-[#5c5346]">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Accordion details */}
      <div className="border-t border-black/[0.06] bg-[#FFFCF7]">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
          <div className="mx-auto max-w-3xl rounded-2xl border border-black/[0.06] bg-white px-4 py-2 shadow-sm sm:px-6">
            <AccordionItem title="Description" defaultOpen>
              <h4 className="text-base font-bold text-[#141414]">
                Replace paper stacks with one Hexa NFC card
              </h4>
              <p>
                The Hexa NFC Business Card lets clients and partners open your
                website, socials, gallery, and contact details with a simple tap
                or QR scan — no app download required.
              </p>
              <div>
                <h5 className="font-semibold text-[#141414]">How to order</h5>
                <ol className="mt-1 list-decimal space-y-1 pl-5">
                  <li>
                    <strong>Design online:</strong> Open Card Studio and pick
                    colors, text, and logo.
                  </li>
                  <li>
                    <strong>Approve:</strong> Chat on WhatsApp for a free
                    mockup — pay only after you approve.
                  </li>
                  <li>
                    <strong>We print & ship:</strong> Premium finish, NFC + QR
                    programmed, delivered to your door.
                  </li>
                </ol>
              </div>
              <div>
                <h5 className="font-semibold text-[#141414]">How it works</h5>
                <ol className="mt-1 list-decimal space-y-1 pl-5">
                  <li>
                    <strong>Tap or scan:</strong> NFC phone or camera QR.
                  </li>
                  <li>
                    <strong>View profile:</strong> Browser opens your Hexa
                    digital card.
                  </li>
                  <li>
                    <strong>Save instantly:</strong> Contacts save your details
                    in one tap.
                  </li>
                  <li>
                    <strong>Edit anytime:</strong> Change links without
                    reprinting.
                  </li>
                </ol>
              </div>
            </AccordionItem>

            <AccordionItem title="Why HexaCards">
              <p>
                Premium materials with high-quality print or foil, paired with a
                lifetime digital profile — no monthly or yearly subscription.
              </p>
              <p>
                <strong>Free design service</strong> — we print only after you
                approve the mockup.
              </p>
              <p>
                <strong>No app needed</strong> for the person receiving your
                details.
              </p>
              <p>
                <strong>Sustainable</strong> — one Hexa card replaces hundreds
                of paper cards.
              </p>
            </AccordionItem>

            <AccordionItem title="Need help?">
              <p>
                Questions about NFC, finishes, or bulk orders? Reach us by call
                or WhatsApp.
              </p>
              <p className="flex flex-wrap gap-4">
                <a
                  href="tel:+919226286898"
                  className="inline-flex items-center gap-1.5 font-semibold text-[#BC7C10] underline-offset-2 hover:underline"
                >
                  <Phone className="h-3.5 w-3.5" />
                  Call us
                </a>
                <a
                  href="https://wa.me/9226286898"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-[#25D366] underline-offset-2 hover:underline"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5" />
                  WhatsApp
                </a>
              </p>
            </AccordionItem>

            <AccordionItem title="Delivery">
              <p>
                Custom design typically takes 1–2 days. Total shipping is
                usually 4–5 business days from order placement.
              </p>
              <table className="mt-3 w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-black/10">
                    <th className="py-2 font-semibold text-[#141414]">City</th>
                    <th className="py-2 font-semibold text-[#141414]">
                      Delivery time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryTimes.map((row) => (
                    <tr key={row.city} className="border-b border-black/5">
                      <td className="py-2 text-[#5c5346]">{row.city}</td>
                      <td className="py-2 text-[#5c5346]">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </AccordionItem>
          </div>
        </div>
      </div>
    </section>
  );
}
