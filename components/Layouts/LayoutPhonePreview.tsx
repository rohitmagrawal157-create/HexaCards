"use client";

import {
  DEFAULT_CARD_AVATAR,
  DEFAULT_CARD_BANNER,
} from "@/lib/card-profile";

type LayoutPhonePreviewProps = {
  layoutId: "classic" | "basic" | string;
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
 * Compact, screen-filling mini of Classic / Basic for the Appearance phone frame.
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

  const contactCards = (
    <div className="grid grid-cols-2 gap-1 px-1.5 pb-1.5">
      <div
        className="rounded-md border bg-white px-1.5 py-1.5"
        style={{ borderColor: borderSoft }}
      >
        <p className="text-[7px] text-[#a0a0a8]" style={{ color: accent }}>
          Mobile
        </p>
        <p className="mt-0.5 truncate text-[8px] font-semibold text-[#0f0f12]">
          {mobile?.trim() || "+91 ·····"}
        </p>
      </div>
      <div
        className="rounded-md border bg-white px-1.5 py-1.5"
        style={{ borderColor: borderSoft }}
      >
        <p className="text-[7px] text-[#a0a0a8]" style={{ color: accent }}>
          Email
        </p>
        <p className="mt-0.5 truncate text-[8px] font-semibold text-[#0f0f12]">
          {email?.trim() || "you@email.com"}
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
      <span className="text-[9px] leading-none opacity-80">▾</span>
    </div>
  );

  if (layoutId === "basic") {
    return (
      <div className="flex h-full flex-col bg-[#F4F5F7]">
        {/* WhatsApp share bar */}
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
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="h-5 w-5 rounded-full shadow-sm"
              style={{ backgroundColor: accent }}
            />
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
