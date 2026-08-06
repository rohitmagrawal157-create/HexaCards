"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Share2,
  Camera,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";
import {
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaGoogle,
  FaGlobe,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import CardContactForm from "@/components/user-dashboard/CardContactForm";
import CardLayoutFooter from "./CardLayoutFooter";
import CardShareModal from "./CardShareModal";
import {
  DEFAULT_CARD_AVATAR,
  DEFAULT_CARD_BANNER,
  formatDialNumber,
  openBrochureDownload,
  phoneDigitsForLink,
  resolveCardAccent,
  type HexaCardProfile,
} from "@/lib/card-profile";

type SocialProps = {
  profile: HexaCardProfile;
  onChangeBackground?: () => void;
  onChangeProfile?: () => void;
};

type GridItem = {
  label: string;
  href?: string;
  onClick?: () => void;
  bg: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: any;
};

const ICON_TILE =
  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-[0_4px_10px_rgba(0,0,0,0.14)] transition group-hover:-translate-y-0.5 group-hover:shadow-lg";
const ICON_GLYPH = "h-5 w-5 shrink-0";

function GridIconTile({
  label,
  href,
  onClick,
  bg,
  Icon,
}: GridItem) {
  const inner = (
    <>
      <span className={ICON_TILE} style={{ backgroundColor: bg }}>
        <Icon className={ICON_GLYPH} />
      </span>
      <span className="w-full truncate text-center text-[11px] font-medium leading-tight text-[#4a4a52]">
        {label}
      </span>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        title={label}
        className="group flex min-w-0 flex-col items-center gap-1.5"
      >
        {inner}
      </button>
    );
  }

  return (
    <a
      href={href || "#"}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noreferrer" : undefined}
      aria-label={label}
      title={label}
      className="group flex min-w-0 flex-col items-center gap-1.5"
      onClick={(e) => {
        if (!href || href === "#") e.preventDefault();
      }}
    >
      {inner}
    </a>
  );
}

/**
 * Social card layout — dark brand card with centered avatar,
 * exchange-contact CTA, and a colored social/contact icon grid.
 */
export default function Social({
  profile,
  onChangeBackground,
  onChangeProfile,
}: SocialProps) {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [bioExpanded, setBioExpanded] = useState(false);
  const [waShareNumber, setWaShareNumber] = useState("");

  const accentTheme = resolveCardAccent(profile.appearance.accentColor);
  const accent = accentTheme.solid;
  const accentMuted = accentTheme.muted;

  const name =
    profile.contact.cardName.trim() ||
    profile.contact.businessName.trim() ||
    "Your Name";
  const titleLine = profile.contact.title.trim();
  const businessName = profile.contact.businessName.trim();
  const bio = profile.business.about?.trim() || "";
  const services = (profile.business.services ?? []).filter((s) => s.trim());
  const coverUrl = profile.appearance.coverImage || DEFAULT_CARD_BANNER;
  const avatarUrl =
    profile.appearance.logoImage || DEFAULT_CARD_AVATAR;
  const country = profile.contact.countryCode || "IN";
  const mobile = profile.contact.mobile?.trim() || "";
  const whatsapp = profile.contact.whatsapp?.trim() || mobile;
  const email = profile.contact.email?.trim() || "";
  const websiteRaw = profile.contact.website?.trim() || "";
  const websiteHref = websiteRaw
    ? /^https?:\/\//i.test(websiteRaw)
      ? websiteRaw
      : `https://${websiteRaw}`
    : "";
  const fullAddress = [
    profile.contact.address,
    profile.contact.city,
    profile.contact.state,
  ]
    .filter(Boolean)
    .join(", ");

  const mobileDigits = mobile ? phoneDigitsForLink(country, mobile) : "";
  const waDigits = whatsapp ? phoneDigitsForLink(country, whatsapp) : "";

  const hasBrochure = Boolean(profile.contact.brochureName);

  function handleWhatsAppShare(toNumber?: string) {
    const text = "Hi, check out my HexaCards digital profile";
    const digits = (toNumber || "").replace(/\D/g, "");
    if (digits) {
      if (digits.length !== 10) {
        window.alert("Enter a 10-digit WhatsApp number.");
        return;
      }
      const dial = phoneDigitsForLink(country, digits);
      window.open(
        `https://wa.me/${dial}?text=${encodeURIComponent(text)}`,
        "_blank",
        "noopener,noreferrer",
      );
      return;
    }
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  async function handleBrochure() {
    if (!hasBrochure) return;
    const opened = await openBrochureDownload(profile.contact.brochureName);
    if (!opened) {
      window.alert("Brochure file not found. Please re-upload it in Edit card.");
    }
  }

  const contactItems: GridItem[] = [];
  if (mobileDigits) {
    contactItems.push({ label: "Call", href: `tel:+${mobileDigits}`, bg: "#34A853", Icon: Phone });
  }
  if (waDigits) {
    contactItems.push({ label: "WhatsApp", href: `https://wa.me/${waDigits}`, bg: "#25D366", Icon: FaWhatsapp });
  }
  if (email) {
    contactItems.push({ label: "Email", href: `mailto:${email}`, bg: "#EA4335", Icon: Mail });
  }
  if (websiteHref) {
    contactItems.push({
      label: "Website",
      href: websiteHref,
      bg: "#0A84FF",
      Icon: FaGlobe,
    });
  }
  if (fullAddress) {
    contactItems.push({
      label: "Location",
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`,
      bg: "#4285F4",
      Icon: MapPin,
    });
  }
  if (hasBrochure) {
    contactItems.push({
      label: "Brochure",
      onClick: () => void handleBrochure(),
      bg: "#BC7C10",
      Icon: FileText,
    });
  }

  const socialItems: GridItem[] = [];
  if (profile.social.linkedin?.trim()) {
    socialItems.push({ label: "LinkedIn", href: profile.social.linkedin, bg: "#0A66C2", Icon: FaLinkedinIn });
  }
  if (profile.social.instagram?.trim()) {
    socialItems.push({ label: "Instagram", href: profile.social.instagram, bg: "#C13584", Icon: FaInstagram });
  }
  if (profile.social.twitter?.trim()) {
    socialItems.push({ label: "X", href: profile.social.twitter, bg: "#111111", Icon: FaXTwitter });
  }
  if (profile.social.facebook?.trim()) {
    socialItems.push({ label: "Facebook", href: profile.social.facebook, bg: "#1877F2", Icon: FaFacebookF });
  }
  if (profile.social.youtube?.trim()) {
    socialItems.push({ label: "YouTube", href: profile.social.youtube, bg: "#FF0000", Icon: FaYoutube });
  }
  if (profile.social.googleReview?.trim()) {
    socialItems.push({ label: "Google Reviews", href: profile.social.googleReview, bg: "#4285F4", Icon: FaGoogle });
  }

  return (
    <div
      className="mx-auto max-w-[520px] overflow-hidden rounded-2xl border-2 bg-[#FAFAF8] shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
      style={{ borderColor: accent }}
    >
      {/* WhatsApp share bar */}
      <div
        className="flex items-center justify-between gap-2 border-b bg-white px-4 py-2"
        style={{ borderColor: accentTheme.soft }}
      >
        <input
          type="tel"
          inputMode="numeric"
          maxLength={10}
          placeholder="Enter WhatsApp Number"
          value={waShareNumber}
          onChange={(e) =>
            setWaShareNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
          }
          className="min-w-0 flex-1 bg-transparent text-sm text-[#141414] outline-none placeholder:text-[#a0a0a8]"
        />
        <button
          type="button"
          onClick={() => handleWhatsAppShare(waShareNumber)}
          className="flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: accent }}
        >
          <FaWhatsapp className="h-4 w-4" />
          Share
        </button>
      </div>

      {/* Branded cover */}
      <div
        className="relative bg-cover bg-center"
        style={{
          backgroundImage: `url("${coverUrl.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}")`,
        }}
      >
        <div className="relative flex items-center justify-end gap-2 px-4 pt-4">
          {onChangeBackground ? (
            <button
              type="button"
              onClick={onChangeBackground}
              aria-label="Change background image"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/90 text-[#141414] shadow-sm transition hover:bg-white"
            >
              <Camera className="h-4 w-4" strokeWidth={2.25} />
            </button>
          ) : null}
          {/* <button
            type="button"
            onClick={() => setShareModalOpen(true)}
            aria-label="Share"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/90 shadow-sm transition hover:bg-white"
            style={{ color: accent }}
          >
            <Share2 className="h-4 w-4" />
          </button> */}
        </div>

        <div className="relative mt-6 flex justify-center">
          <div className="relative z-10">
            <div
              className="h-28 w-28 overflow-hidden rounded-full border-4 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.28)]"
              style={{ borderColor: accent }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarUrl}
                alt=""
                className="h-full w-full object-cover object-center"
              />
            </div>
            {onChangeProfile ? (
              <button
                type="button"
                onClick={onChangeProfile}
                aria-label="Change profile picture"
                className="absolute right-0 bottom-0 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white text-[#050505] shadow-sm"
              >
                <Camera className="h-[15px] w-[15px]" strokeWidth={2.25} />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Light identity card */}
      <div
        className="relative mx-4 -mt-14 rounded-3xl border bg-white px-5 pt-16 pb-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
        style={{ borderColor: accentMuted }}
      >
        <div className="text-center">
          <h1 className="font-dashboard text-xl font-extrabold text-[#141414]">
            {name}
          </h1>
          {titleLine || businessName ? (
            <p className="mt-1 text-sm font-medium text-[#6b6560]">
              {titleLine}
              {titleLine && businessName ? " @ " : ""}
              {businessName ? (
                <span style={{ color: accent }}>{businessName}</span>
              ) : null}
            </p>
          ) : (
            <p className="mt-1 text-sm text-[#8a8a92]">Hexa NFC Business Card</p>
          )}
          {bio ? (
            <p
              className={`mt-2 text-xs leading-relaxed text-[#8a8a92] ${
                bioExpanded ? "" : "line-clamp-5"
              }`}
            >
              {bio}
            </p>
          ) : null}

          {bio || services.length > 0 ? (
            <button
              type="button"
              onClick={() => setBioExpanded((v) => !v)}
              aria-expanded={bioExpanded}
              className="mt-2 inline-flex items-center gap-1 text-xs font-bold transition-opacity hover:opacity-80"
              style={{ color: accent }}
            >
              {bioExpanded ? "View less" : "View more"}
              {bioExpanded ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>
          ) : null}

          {bioExpanded && services.length > 0 ? (
            <div
              className="mt-3 rounded-xl border bg-[#FAFAF8] p-3 text-left"
              style={{ borderColor: accentMuted }}
            >
              <h3 className="text-xs font-bold text-[#141414]">
                Services / Products
              </h3>
              <ul className="mt-2 space-y-1.5">
                {services.map((service, index) => (
                  <li
                    key={`${service}-${index}`}
                    className="flex items-start gap-2"
                  >
                    <span
                      className="mt-1.5 h-0 w-0 shrink-0 border-y-[4px] border-l-[6px] border-y-transparent"
                      style={{ borderLeftColor: accent }}
                      aria-hidden
                    />
                    <span className="text-xs text-[#4a4a52]">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="mt-5 flex items-center gap-2">
          <a
            href={
              mobileDigits
                ? `tel:+${mobileDigits}`
                : email
                  ? `mailto:${email}`
                  : "#save-contact"
            }
            className="flex-1 rounded-full py-3 text-center text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: accent }}
          >
            Save Contact
          </a>
          <button
            type="button"
            onClick={() => setShareModalOpen(true)}
            aria-label="Share"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border bg-white transition-colors hover:bg-[#FAFAF8]"
            style={{ borderColor: accentMuted, color: accent }}
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        {/* {mobile ? (
          <p className="mt-3 text-center text-[11px] text-[#8a8a92]">
            {formatDialNumber(country, mobile)}
          </p>
        ) : null} */}
      </div>

      {/* Contact information */}
      <section className="mx-4 mt-5 rounded-2xl border bg-white p-4 shadow-[0_3px_14px_rgba(0,0,0,0.04)]"
        style={{ borderColor: accentMuted }}
      >
        <h2 className="text-sm font-extrabold text-[#141414]">
          Contact Information
        </h2>
        {contactItems.length > 0 ? (
          <div className="mt-4 grid grid-cols-3 gap-x-3 gap-y-4">
            {contactItems.map((item) => (
              <GridIconTile key={item.label} {...item} />
            ))}
          </div>
        ) : (
          <p className="mt-2 text-xs text-[#8a8a92]">
            Add phone, email, WhatsApp, address, or brochure in Edit card.
          </p>
        )}
      </section>

      {/* Social media */}
      <section className="mx-4 mt-4 rounded-2xl border bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
        style={{ borderColor: accentMuted }}
      >
        <h2 className="text-sm font-extrabold text-[#141414]">Social Media</h2>
        {socialItems.length > 0 ? (
          <div className="mt-4 grid grid-cols-3 gap-x-3 gap-y-4">
            {socialItems.map((item) => (
              <GridIconTile key={item.label} {...item} />
            ))}
          </div>
        ) : (
          <p className="mt-2 text-xs text-[#8a8a92]">
            Add social links in Edit card.
          </p>
        )}
      </section>

      {/* Contact form — bottom */}
      <div className="mx-4 mt-4 mb-2">
        <CardContactForm accentColor={accent} />
      </div>

      <div className="mt-4">
        <CardLayoutFooter accent={accent} />
      </div>

      <CardShareModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        accent={accent}
        cardName={name}
      />
    </div>
  );
}
