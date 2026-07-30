"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  Camera,
  Phone,
  Mail,
  Globe,
  MapPin,
  UserPlus,
  FileText,
  Share2,
  Home,
  ChevronUp,
  ImagePlus,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
  FaGoogle,
} from "react-icons/fa";
import type { HexaCardProfile } from "./cardProfile";

type ProfileBannerProps = {
  profile: HexaCardProfile;
  userName?: string;
  user?: { name: string };
  slug?: string;
  compact?: boolean;
  onUploadBackground?: (file: File) => void;
  onUploadProfile?: (file: File) => void;
};

export default function ProfileBanner({
  profile,
  userName,
  user,
  onUploadBackground,
  onUploadProfile,
}: ProfileBannerProps) {
  const coverInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const accent = profile.appearance.accentColor || "#BD7F14";
  const name =
    profile.contact.cardName.trim() ||
    userName ||
    user?.name ||
    "HexaCards User";
  const about =
    profile.business.about.trim() ||
    (profile.contact.businessName
      ? `${profile.contact.businessName} — connect instantly through this Hexa digital card.`
      : "");
  const services = profile.business.services.filter((s) => s.trim());

  const coverUrl =
    profile.appearance.coverImage ||
    profile.appearance.shareImage ||
    "/Images/Products/digitalCard.jpg";

  const socialLinks = [
    {
      label: "Facebook",
      Icon: FaFacebookF,
      bg: "#1877F2",
      href: profile.social.facebook || "#",
    },
    {
      label: "Instagram",
      Icon: FaInstagram,
      bg: "#C13584",
      href: profile.social.instagram || "#",
    },
    {
      label: "LinkedIn",
      Icon: FaLinkedinIn,
      bg: "#0A66C2",
      href: profile.social.linkedin || "#",
    },
    {
      label: "Twitter",
      Icon: FaTwitter,
      bg: "#1DA1F2",
      href: profile.social.twitter || "#",
    },
    {
      label: "YouTube",
      Icon: FaYoutube,
      bg: "#FF0000",
      href: profile.social.youtube || "#",
    },
    {
      label: "Google",
      Icon: FaGoogle,
      bg: "#4285F4",
      href: profile.social.googleReview || "#",
    },
  ].filter((s) => s.href && s.href !== "#");

  return (
    <div className="mx-auto max-w-[520px] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.1)]">
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && onUploadBackground) onUploadBackground(file);
          e.target.value = "";
        }}
      />
      <input
        ref={profileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && onUploadProfile) onUploadProfile(file);
          e.target.value = "";
        }}
      />

      <div className="flex items-center justify-between gap-2 border-b border-black/5 bg-white px-4 py-3">
        <input
          type="text"
          placeholder="Enter WhatsApp Number"
          className="min-w-0 flex-1 bg-transparent text-sm text-[#a0a0a8] outline-none placeholder:text-[#a0a0a8]"
        />
        <button
          type="button"
          className="flex shrink-0 items-center gap-1.5 rounded-md bg-[#25D366] px-4 py-2 text-sm font-bold text-white"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91S17.5 2 12.04 2zm5.83 14.13c-.24.68-1.38 1.3-1.9 1.37-.49.07-1.1.1-1.77-.11a11.6 11.6 0 0 1-1.65-.61c-2.9-1.25-4.79-4.15-4.93-4.34-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.13 1.01-2.42.27-.29.58-.36.78-.36h.56c.18 0 .42-.03.66.5.24.57.82 1.98.89 2.13.07.14.12.31.02.5-.1.19-.15.31-.29.47-.14.16-.3.36-.43.48-.14.14-.29.29-.13.57.17.29.75 1.24 1.6 2.01 1.11 1 2.04 1.31 2.33 1.46.29.14.46.12.63-.07.17-.19.71-.83.9-1.11.19-.28.38-.24.63-.14.26.1 1.65.78 1.94.92.28.14.47.21.54.33.07.12.07.68-.17 1.36z" />
          </svg>
          Share
        </button>
      </div>

      {/* Banner + overlapping profile (avatar is sibling so it is not clipped) */}
      <div className="relative">
        <div
          className={`relative h-44 w-full overflow-hidden bg-[#d8dde3] sm:h-48 ${
            onUploadBackground ? "cursor-pointer" : ""
          }`}
          style={{
            backgroundImage: `url("${coverUrl.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}")`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
          role={onUploadBackground ? "button" : undefined}
          tabIndex={onUploadBackground ? 0 : undefined}
          onClick={() => {
            if (onUploadBackground) coverInputRef.current?.click();
          }}
          onKeyDown={(e) => {
            if (!onUploadBackground) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              coverInputRef.current?.click();
            }
          }}
          aria-label={onUploadBackground ? "Change background image" : undefined}
        >
          {onUploadBackground ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                coverInputRef.current?.click();
              }}
              className="absolute top-3 left-3 z-30 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1.5 text-[11px] font-semibold text-white shadow-md backdrop-blur-sm transition-colors hover:bg-black/80"
            >
              <ImagePlus className="h-3.5 w-3.5" />
              Change background
            </button>
          ) : null}
        </div>

        {/* Full-width overlap used to steal clicks — keep events only on the avatar */}
        <div className="pointer-events-none relative z-20 -mt-14 flex justify-center">
          <div className="pointer-events-auto relative">
            <div className="flex h-[112px] w-[112px] items-center justify-center overflow-hidden rounded-full border-[5px] border-white bg-[#f5f5f4] shadow-[0_8px_24px_rgba(0,0,0,0.18)] ring-1 ring-black/5">
              {profile.appearance.logoImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.appearance.logoImage}
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <span className="text-2xl font-bold tracking-tight text-black/20">
                  {name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            {onUploadProfile ? (
              <button
                type="button"
                onClick={() => profileInputRef.current?.click()}
                aria-label="Change profile picture"
                className="absolute right-1 bottom-1 z-30 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white bg-[#141414] text-white shadow-md transition-colors hover:bg-[#2a2a2a]"
              >
                <Camera className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="px-5 pt-4 pb-5 text-center">
        <h1 className="font-dashboard text-xl font-extrabold text-[#0f0f12]">
          {name}
        </h1>
        <p className="mt-1 text-sm text-[#8a8a92]">
          {profile.contact.title ||
            profile.contact.businessName ||
            "Hexa NFC Business Card"}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full bg-[#1a1a1a] px-3.5 py-2 text-[11px] font-semibold text-white"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Save Contact
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full bg-[#1a1a1a] px-3.5 py-2 text-[11px] font-semibold text-white"
          >
            <FileText className="h-3.5 w-3.5" />
            Brochure
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full bg-[#1a1a1a] px-3.5 py-2 text-[11px] font-semibold text-white"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 px-4 pb-4">
        {profile.contact.mobile ? (
          <div className="rounded-xl border border-black/[0.08] p-3">
            <div className="flex items-center gap-2 text-[#a0a0a8]">
              <Phone className="h-3.5 w-3.5" strokeWidth={2} />
              <span className="text-xs">Mobile</span>
            </div>
            <p className="mt-1 truncate text-sm font-semibold text-[#0f0f12]">
              {profile.contact.mobile}
            </p>
          </div>
        ) : null}

        {profile.contact.email ? (
          <div className="rounded-xl border border-black/[0.08] p-3">
            <div className="flex items-center gap-2 text-[#a0a0a8]">
              <Mail className="h-3.5 w-3.5" strokeWidth={2} />
              <span className="text-xs">Email</span>
            </div>
            <p className="mt-1 truncate text-sm font-semibold text-[#0f0f12]">
              {profile.contact.email}
            </p>
          </div>
        ) : null}

        {profile.contact.website ? (
          <div className="rounded-xl border border-black/[0.08] p-3">
            <div className="flex items-center gap-2 text-[#a0a0a8]">
              <Globe className="h-3.5 w-3.5" strokeWidth={2} />
              <span className="text-xs">Website</span>
            </div>
            <p className="mt-1 truncate text-sm font-semibold text-[#0f0f12]">
              {profile.contact.website}
            </p>
          </div>
        ) : null}

        {profile.contact.whatsapp || profile.contact.mobile ? (
          <div className="rounded-xl border border-black/[0.08] p-3">
            <div className="flex items-center gap-2 text-[#a0a0a8]">
              <Phone className="h-3.5 w-3.5" strokeWidth={2} />
              <span className="text-xs">Whatsapp</span>
            </div>
            <p className="mt-1 truncate text-sm font-semibold text-[#0f0f12]">
              {profile.contact.whatsapp || profile.contact.mobile}
            </p>
          </div>
        ) : null}

        {profile.contact.address ? (
          <div className="col-span-2 rounded-xl border border-black/[0.08] p-3">
            <div className="flex items-center gap-2 text-[#a0a0a8]">
              <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
              <span className="text-xs">Address</span>
            </div>
            <p className="mt-1 text-sm leading-snug font-semibold text-[#0f0f12]">
              {[
                profile.contact.address,
                profile.contact.city,
                profile.contact.state,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        ) : null}
      </div>

      <div className="mx-4 mb-5 rounded-2xl border border-black/[0.08] p-4">
        <div className="flex items-center gap-2">
          <Home className="h-4 w-4 text-[#a0a0a8]" strokeWidth={1.75} />
          <h3 className="text-base font-bold text-[#0f0f12]">
            Business Information
          </h3>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-[#4a4a52]">
          {about ||
            "Add company details in the Company tab — about your business and services will show here."}
        </p>

        <h4 className="mt-4 text-sm font-bold text-[#0f0f12]">
          Services / Products
        </h4>
        {services.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {services.map((service) => (
              <li key={service} className="flex items-start gap-2">
                <span
                  className="mt-1.5 h-0 w-0 shrink-0 border-y-[5px] border-l-[7px] border-y-transparent"
                  style={{ borderLeftColor: accent }}
                  aria-hidden
                />
                <span className="text-sm text-[#4a4a52]">{service}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-xs text-[#8a8a92]">
            Add services or products from the Company tab.
          </p>
        )}
      </div>

      <div className="pb-6 text-center">
        <h3 className="text-base font-bold text-[#0f0f12]">Social Media Links</h3>
        {socialLinks.length > 0 ? (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5">
            {socialLinks.map(({ label, Icon, bg, href }) => (
              <a
                key={label}
                href={href.startsWith("http") ? href : `https://${href}`}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-transform hover:scale-105"
                style={{ backgroundColor: bg }}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-xs text-[#8a8a92]">
            Add social links to show icons here
          </p>
        )}
      </div>

      <div
        className="relative border-t-2 bg-[#f7f7f5] px-4 pt-6 pb-8 text-center"
        style={{ borderColor: accent }}
      >
        <Image
          src="/Images/Hexacards.png"
          alt="Hexa Cards"
          width={180}
          height={50}
          className="mx-auto h-8 w-auto object-contain"
        />
        <a
          href="/products"
          className="mt-3 inline-block text-sm font-bold"
          style={{ color: accent }}
        >
          Create Your Own NFC Card
        </a>
        <button
          type="button"
          aria-label="Scroll to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="absolute right-4 bottom-4 flex h-9 w-9 items-center justify-center rounded-md text-white"
          style={{ backgroundColor: accent }}
        >
          <ChevronUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
