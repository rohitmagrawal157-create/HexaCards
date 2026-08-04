"use client";

import {
  Phone,
  Mail,
  Globe,
  MapPin,
  ChevronDown,
  Share2,
  UserPlus,
  MessageCircle,
} from "lucide-react";
import {
  DEFAULT_CARD_AVATAR,
  DEFAULT_CARD_BANNER,
} from "@/lib/card-profile";

type LayoutPhonePreviewProps = {
  layoutId: "classic" | "basic" | "modern" | "compact" | string;
  name: string;
  titleLine: string;
  coverUrl?: string | null;
  avatarUrl?: string | null;
  accent?: string;
  mobile?: string;
  email?: string;
};

function escUrl(url: string) {
  return url.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/**
 * Compact, screen-filling mini of Classic / Basic / Modern for the Appearance phone frame.
 */
export default function LayoutPhonePreview({
  layoutId,
  name,
  titleLine,
  coverUrl,
  avatarUrl,
  accent = "#BC7C10",
  mobile,
  email,
}: LayoutPhonePreviewProps) {
  const cover = coverUrl || DEFAULT_CARD_BANNER;
  const avatar = avatarUrl || DEFAULT_CARD_AVATAR;
  const borderSoft = `${accent}33`;
  const mobileLabel = mobile?.trim() || "+91 ·····";
  const emailLabel = email?.trim() || "you@email.com";

  const contactCards = (
    <div className="grid grid-cols-2 gap-1 px-1.5 pb-1.5">
      <div
        className="rounded-md border bg-white px-1.5 py-1.5"
        style={{ borderColor: borderSoft }}
      >
        <p className="text-[7px]" style={{ color: accent }}>
          Mobile
        </p>
        <p className="mt-0.5 truncate text-[8px] font-semibold text-[#0f0f12]">
          {mobileLabel}
        </p>
      </div>
      <div
        className="rounded-md border bg-white px-1.5 py-1.5"
        style={{ borderColor: borderSoft }}
      >
        <p className="text-[7px]" style={{ color: accent }}>
          Email
        </p>
        <p className="mt-0.5 truncate text-[8px] font-semibold text-[#0f0f12]">
          {emailLabel}
        </p>
      </div>
      <div
        className="col-span-2 rounded-md border bg-white px-1.5 py-1.5"
        style={{ borderColor: borderSoft }}
      >
        <p className="text-[7px]" style={{ color: accent }}>
          Address
        </p>
        <p className="mt-0.5 truncate text-[8px] font-semibold text-[#0f0f12]">
          City · Open in Maps
        </p>
      </div>
    </div>
  );

  const businessBar = (
    <div
      className="mx-1.5 mb-1.5 flex items-center justify-between rounded-lg px-2 py-1.5 text-white"
      style={{ backgroundColor: accent }}
    >
      <span className="text-[8px] font-semibold">Business Information</span>
      <ChevronDown className="h-3 w-3 opacity-90" strokeWidth={2.5} />
    </div>
  );

  if (layoutId === "compact") {
    const topIcons = [Phone, MessageCircle, Globe, UserPlus, Share2];
    const compactRows = [
      { label: "Mobile", value: mobileLabel, Icon: Phone },
      { label: "Email", value: emailLabel, Icon: Mail },
      { label: "Website", value: "yoursite.com", Icon: Globe },
      { label: "Address", value: "City · Maps", Icon: MapPin },
    ] as const;

    return (
      <div className="flex h-full flex-col bg-[#F3F5FA]">
        <div className="flex items-center gap-1 border-b border-black/[0.06] bg-white px-1.5 py-1">
          <span className="min-w-0 flex-1 truncate text-[7px] text-[#a0a0a8]">
            Enter WhatsApp Number
          </span>
          <span className="rounded bg-[#25D366] px-1.5 py-0.5 text-[7px] font-bold text-white">
            Share
          </span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col bg-white">
          <div
            className="relative flex h-[78px] w-full shrink-0 items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `url("${escUrl(cover)}")` }}
          >
            <div className="h-11 w-11 overflow-hidden rounded-full border-[3px] border-white bg-[#f5f5f4] shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={avatar} alt="" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="mt-1.5 px-1.5 text-center">
            <p className="max-w-full truncate text-[10px] font-extrabold text-[#0f0f12]">
              {name}
            </p>
            <p className="mt-0.5 line-clamp-1 max-w-full text-[7px] text-[#8a8a92]">
              {titleLine}
            </p>
          </div>

          <div className="mt-2 flex justify-center gap-1.5 px-1.5">
            {topIcons.map((Icon, i) => (
              <span
                key={i}
                className="flex h-5 w-5 items-center justify-center rounded-full text-white shadow-sm"
                style={{ backgroundColor: accent }}
              >
                <Icon className="h-[10px] w-[10px]" strokeWidth={2.5} />
              </span>
            ))}
          </div>

          <div className="mx-1.5 mt-2 flex gap-0.5 rounded-md bg-black/[0.04] p-0.5">
            {["Contact", "Socials", "Message"].map((label, i) => (
              <span
                key={label}
                className={`flex-1 rounded py-1.5 text-center text-[7px] font-bold ${
                  i === 0 ? "text-white" : "text-[#8a8a92]"
                }`}
                style={i === 0 ? { backgroundColor: accent } : undefined}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="mt-1.5 flex min-h-0 flex-1 flex-col gap-1 px-1.5 pb-1.5">
            {compactRows.map(({ label, value, Icon }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 rounded-md border border-black/[0.06] bg-white px-1.5 py-1.5"
              >
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px]"
                  style={{ backgroundColor: `${accent}18`, color: accent }}
                >
                  <Icon className="h-[11px] w-[11px]" strokeWidth={2.5} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[6px] leading-none text-[#8a8a92]">{label}</p>
                  <p className="mt-0.5 truncate text-[8px] font-semibold text-[#0f0f12]">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="shrink-0 px-1.5 pb-1.5 pt-1">
          <div
            className="flex items-center justify-between rounded-md px-2 py-1.5 text-white"
            style={{ backgroundColor: accent }}
          >
            <span className="text-[8px] font-semibold">Business Information</span>
            <ChevronDown className="h-3 w-3 opacity-90" strokeWidth={2.5} />
          </div>
        </div>
      </div>
    );
  }

  if (layoutId === "modern") {
    const modernRows = [
      { label: "Mobile", value: mobileLabel, Icon: Phone },
      { label: "Email", value: emailLabel, Icon: Mail },
      { label: "Website", value: "yoursite.com", Icon: Globe },
    ] as const;

    const topIcons = [Phone, MessageCircle, Globe, UserPlus, Share2];

    return (
      <div className="flex h-full flex-col bg-[#F3F5FA]">
        <div className="flex items-center gap-1 border-b border-black/[0.06] bg-white px-1.5 py-1">
          <span className="min-w-0 flex-1 truncate text-[7px] text-[#a0a0a8]">
            Enter WhatsApp Number
          </span>
          <span className="rounded bg-[#25D366] px-1.5 py-0.5 text-[7px] font-bold text-white">
            Share
          </span>
        </div>

        <div className="bg-white pb-1.5">
          {/* Banner with profile centered inside */}
          <div
            className="relative flex h-[88px] w-full items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `url("${escUrl(cover)}")` }}
          >
            <div className="h-12 w-12 overflow-hidden rounded-full border-[3px] border-white bg-[#f5f5f4] shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={avatar} alt="" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="mt-1.5 px-1.5 text-center">
            <p className="max-w-full truncate text-[9px] font-extrabold text-[#0f0f12]">
              {name}
            </p>
            <p className="mt-0.5 line-clamp-1 max-w-full text-[6px] text-[#8a8a92]">
              {titleLine}
            </p>
          </div>

          {/* Top quick actions — solid circles with visible white icons */}
          <div className="mt-1.5 flex justify-center gap-1 px-1.5">
            {topIcons.map((Icon, i) => (
              <span
                key={i}
                className="flex h-[18px] w-[18px] items-center justify-center rounded-full text-white shadow-sm"
                style={{ backgroundColor: accent }}
              >
                <Icon className="h-[9px] w-[9px]" strokeWidth={2.5} />
              </span>
            ))}
          </div>

          {/* Bottom rows — soft tinted icons (different from top) */}
          <div className="mt-1.5 space-y-1 px-1.5">
            {modernRows.map(({ label, value, Icon }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 rounded-md border border-black/[0.06] bg-white px-1.5 py-1"
              >
                <span
                  className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px]"
                  style={{ backgroundColor: `${accent}18`, color: accent }}
                >
                  <Icon className="h-[10px] w-[10px]" strokeWidth={2.5} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[6px] leading-none text-[#8a8a92]">{label}</p>
                  <p className="mt-0.5 truncate text-[7px] font-semibold text-[#0f0f12]">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto px-1.5 pb-1.5 pt-1">
          <div
            className="flex items-center justify-between rounded-md px-2 py-1.5 text-white"
            style={{ backgroundColor: accent }}
          >
            <span className="text-[8px] font-semibold">Business Information</span>
            <ChevronDown className="h-3 w-3 opacity-90" strokeWidth={2.5} />
          </div>
        </div>
      </div>
    );
  }

  if (layoutId === "basic") {
    const basicTop = [Phone, MessageCircle, MapPin, Globe, UserPlus, Share2];

    return (
      <div className="flex h-full flex-col bg-[#F4F5F7]">
        <div className="flex items-center gap-1 border-b border-black/[0.06] bg-white px-1.5 py-1">
          <span className="min-w-0 flex-1 truncate text-[7px] text-[#a0a0a8]">
            Enter WhatsApp Number
          </span>
          <span className="rounded bg-[#25D366] px-1.5 py-0.5 text-[7px] font-bold text-white">
            Share
          </span>
        </div>

        <div
          className="h-[72px] w-full shrink-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${escUrl(cover)}")` }}
        />
        <div className="relative z-10 -mt-6 flex flex-col items-center px-1.5 text-center">
          <div
            className="h-12 w-12 overflow-hidden rounded-full border-[2.5px] border-white bg-[#f5f5f4] shadow"
            style={{ outline: `1.5px solid ${accent}` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={avatar} alt="" className="h-full w-full object-cover" />
          </div>
          <p className="mt-1.5 max-w-full truncate text-[10px] font-extrabold text-[#0f0f12]">
            {name}
          </p>
          <p className="mt-0.5 line-clamp-1 max-w-full text-[7px] text-[#8a8a92]">
            {titleLine}
          </p>
        </div>

        <div className="mt-2 flex justify-center gap-1 px-1.5">
          {basicTop.map((Icon, i) => (
            <span
              key={i}
              className="flex h-5 w-5 items-center justify-center rounded-full text-white shadow-sm"
              style={{ backgroundColor: accent }}
            >
              <Icon className="h-[10px] w-[10px]" strokeWidth={2.5} />
            </span>
          ))}
        </div>

        <div className="mt-2 flex min-h-0 flex-1 flex-col justify-between">
          {contactCards}
          {businessBar}
        </div>
      </div>
    );
  }

  // Classic (default)
  return (
    <div className="flex h-full flex-col bg-white">
      <div
        className="h-[78px] w-full shrink-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${escUrl(cover)}")` }}
      />
      <div className="relative z-10 -mt-7 flex flex-col items-center px-1.5 text-center">
        <div
          className="h-14 w-14 overflow-hidden rounded-full border-[3px] border-white bg-[#f5f5f4] shadow"
          style={{ outline: `1.5px solid ${accent}` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatar} alt="" className="h-full w-full object-cover" />
        </div>
        <p className="mt-1.5 max-w-full truncate text-[10px] font-extrabold text-[#0f0f12]">
          {name}
        </p>
        <p className="mt-0.5 line-clamp-1 max-w-full text-[7px] text-[#8a8a92]">
          {titleLine}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1">
          <span
            className="rounded-full px-2 py-0.5 text-[7px] font-semibold text-white"
            style={{ backgroundColor: accent }}
          >
            Save Contact
          </span>
          <span
            className="rounded-full px-2 py-0.5 text-[7px] font-semibold text-white"
            style={{ backgroundColor: accent }}
          >
            Share
          </span>
        </div>
      </div>

      <div className="mt-2 flex min-h-0 flex-1 flex-col justify-between">
        {contactCards}
        {businessBar}
      </div>
    </div>
  );
}
