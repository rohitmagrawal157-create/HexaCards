"use client";

import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";
import {
  Camera,
  Phone,
  Mail,
  Globe,
  MapPin,
  UserPlus,
  FileText,
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
  FaWhatsapp,
} from "react-icons/fa";
import {
  cardPublicUrl,
  formatDialNumber,
  openBrochureDownload,
  phoneDigitsForLink,
  type HexaCardProfile,
} from "@/lib/card-profile";
import { saveCardMessage } from "@/lib/card-messages";

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
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    message: "",
  });
  const [contactSent, setContactSent] = useState(false);
  const [contactError, setContactError] = useState("");
  const [waShareNumber, setWaShareNumber] = useState("");

  const accent = profile.appearance.accentColor || "#BC7C10";
  const accentSoft = `${accent}33`;
  const accentMuted = `${accent}55`;
  const name =
    profile.contact.cardName.trim() ||
    userName ||
    user?.name ||
    "HexaCards User";
  const titleLine = [profile.contact.title.trim(), profile.contact.businessName.trim()]
    .filter(Boolean)
    .join(" - ");
  const about =
    profile.business.about.trim() ||
    (profile.contact.businessName
      ? `${profile.contact.businessName} — connect instantly through this Hexa digital card.`
      : "");
  const services = profile.business.services.filter((s) => s.trim());
  const hasBrochure = Boolean(profile.contact.brochureName);
  const shareUrl = cardPublicUrl(profile);

  const ctaClass =
    "flex items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-semibold text-white transition-opacity hover:opacity-90";
  const infoCardClass =
    "min-w-0 rounded-xl border p-3 text-left transition-colors";
  const sectionCardClass = "rounded-2xl border bg-white p-4";

  async function handleBrochureClick() {
    if (!hasBrochure) return;
    const opened = await openBrochureDownload(profile.contact.brochureName);
    if (!opened) {
      window.alert("Brochure file not found. Please re-upload it in Edit card.");
    }
  }

  function handleWhatsAppShare(toNumber?: string) {
    const text = `Hi, check out my HexaCards digital profile:\n${shareUrl}`;
    const digits = (toNumber || "").replace(/\D/g, "");
    if (digits) {
      if (digits.length !== 10) {
        window.alert("Enter a 10-digit WhatsApp number.");
        return;
      }
      const countryDial = phoneDigitsForLink(
        profile.contact.countryCode,
        digits,
      );
      window.open(
        `https://wa.me/${countryDial}?text=${encodeURIComponent(text)}`,
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

  function handleContactSubmit(e: FormEvent) {
    e.preventDefault();
    setContactError("");
    if (
      !contactForm.name.trim() ||
      !contactForm.email.trim() ||
      !contactForm.message.trim()
    ) {
      setContactError("Please fill name, email, and message.");
      return;
    }
    if (contactForm.phone && contactForm.phone.length !== 10) {
      setContactError("Phone number must be 10 digits.");
      return;
    }
    saveCardMessage(contactForm);
    setContactForm({ name: "", email: "", phone: "", website: "", message: "" });
    setContactSent(true);
    window.setTimeout(() => setContactSent(false), 2800);
  }

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
    <div
      className="mx-auto max-w-[520px] overflow-hidden rounded-2xl border-2 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.1)]"
      style={{ borderColor: accent }}
    >
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

      <div
        className="flex items-center justify-between gap-2 border-b bg-white px-4 py-3"
        style={{ borderColor: accentSoft }}
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
          className="flex shrink-0 items-center gap-1.5 rounded-md px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: accent }}
        >
          <FaWhatsapp className="h-4 w-4" />
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
              className="absolute top-3 left-3 z-30 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white shadow-md transition-opacity hover:opacity-90"
              style={{ backgroundColor: accent }}
            >
              <ImagePlus className="h-3.5 w-3.5" />
              Change background
            </button>
          ) : null}
        </div>

        {/* Full-width overlap used to steal clicks — keep events only on the avatar */}
        <div className="pointer-events-none relative z-20 -mt-14 flex justify-center">
          <div className="pointer-events-auto relative">
            <div
              className="flex h-[112px] w-[112px] items-center justify-center overflow-hidden rounded-full border-[5px] border-white bg-[#f5f5f4] shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
              style={{ outline: `2px solid ${accent}` }}
            >
              {profile.appearance.logoImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.appearance.logoImage}
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <span
                  className="text-2xl font-bold tracking-tight"
                  style={{ color: accentMuted }}
                >
                  {name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            {onUploadProfile ? (
              <button
                type="button"
                onClick={() => profileInputRef.current?.click()}
                aria-label="Change profile picture"
                className="absolute right-1 bottom-1 z-30 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white text-white shadow-md transition-opacity hover:opacity-90"
                style={{ backgroundColor: accent }}
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
          {titleLine || "Hexa NFC Business Card"}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            className={ctaClass}
            style={{ backgroundColor: accent }}
          >
            <UserPlus className="h-3.5 w-3.5" />
            Save Contact
          </button>
          {hasBrochure ? (
            <button
              type="button"
              onClick={() => void handleBrochureClick()}
              className={ctaClass}
              style={{ backgroundColor: accent }}
            >
              <FileText className="h-3.5 w-3.5" />
              E Brochure
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => handleWhatsAppShare()}
            className={ctaClass}
            style={{ backgroundColor: accent }}
          >
            <FaWhatsapp className="h-3.5 w-3.5" />
            Share
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 px-4 pb-4">
        {profile.contact.mobile ? (
          <a
            href={`tel:+${phoneDigitsForLink(profile.contact.countryCode, profile.contact.mobile)}`}
            className={infoCardClass}
            style={{ borderColor: accentMuted }}
          >
            <div className="flex items-center gap-2" style={{ color: accent }}>
              <Phone className="h-3.5 w-3.5" strokeWidth={2} />
              <span className="text-xs text-[#a0a0a8]">Mobile</span>
            </div>
            <p className="mt-1 break-words text-[13px] leading-snug font-semibold text-[#0f0f12]">
              {formatDialNumber(
                profile.contact.countryCode,
                profile.contact.mobile,
              )}
            </p>
          </a>
        ) : null}

        {profile.contact.email ? (
          <div
            className={infoCardClass}
            style={{ borderColor: accentMuted }}
          >
            <div className="flex items-center gap-2" style={{ color: accent }}>
              <Mail className="h-3.5 w-3.5" strokeWidth={2} />
              <span className="text-xs text-[#a0a0a8]">Email</span>
            </div>
            <p className="mt-1 truncate text-sm font-semibold text-[#0f0f12]">
              {profile.contact.email}
            </p>
          </div>
        ) : null}

        {profile.contact.website ? (
          <div
            className={infoCardClass}
            style={{ borderColor: accentMuted }}
          >
            <div className="flex items-center gap-2" style={{ color: accent }}>
              <Globe className="h-3.5 w-3.5" strokeWidth={2} />
              <span className="text-xs text-[#a0a0a8]">Website</span>
            </div>
            <p className="mt-1 truncate text-sm font-semibold text-[#0f0f12]">
              {profile.contact.website}
            </p>
          </div>
        ) : null}

        {profile.contact.whatsapp || profile.contact.mobile ? (
          <a
            href={`https://wa.me/${phoneDigitsForLink(
              profile.contact.countryCode,
              profile.contact.whatsapp || profile.contact.mobile,
            )}`}
            target="_blank"
            rel="noreferrer"
            className={infoCardClass}
            style={{ borderColor: accentMuted }}
          >
            <div className="flex items-center gap-2" style={{ color: accent }}>
              <FaWhatsapp className="h-3.5 w-3.5" />
              <span className="text-xs text-[#a0a0a8]">WhatsApp</span>
            </div>
            <p className="mt-1 break-words text-[13px] leading-snug font-semibold text-[#0f0f12]">
              {formatDialNumber(
                profile.contact.countryCode,
                profile.contact.whatsapp || profile.contact.mobile,
              )}
            </p>
          </a>
        ) : null}

        {profile.contact.address ? (
          <div
            className={`col-span-2 ${infoCardClass}`}
            style={{ borderColor: accentMuted }}
          >
            <div className="flex items-center gap-2" style={{ color: accent }}>
              <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
              <span className="text-xs text-[#a0a0a8]">Address</span>
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

      <div
        className={`mx-4 mb-5 ${sectionCardClass}`}
        style={{ borderColor: accentMuted }}
      >
        <div className="flex items-center gap-2">
          <Home className="h-4 w-4" strokeWidth={1.75} style={{ color: accent }} />
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

      {socialLinks.length > 0 ? (
        <div className="pb-5 text-center">
          <h3 className="text-base font-bold text-[#0f0f12]">
            Social Media Links
          </h3>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5">
            {socialLinks.map(({ label, Icon, href }) => (
              <a
                key={label}
                href={href.startsWith("http") ? href : `https://${href}`}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-transform hover:scale-105"
                style={{ backgroundColor: accent }}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      ) : null}

      <div
        className="mx-4 mb-6 rounded-2xl border bg-white p-5 shadow-[0_8px_28px_rgba(0,0,0,0.06)]"
        style={{ borderColor: accentMuted }}
      >
        <h3
          className="text-center text-base font-extrabold tracking-wide uppercase"
          style={{ color: accent }}
        >
          Contact Us
        </h3>
        <form className="mt-4 space-y-3" onSubmit={handleContactSubmit}>
          <input
            className="w-full rounded-xl border bg-[#F5F5F5] px-4 py-3 text-sm text-[#141414] outline-none transition placeholder:text-[#9a9a9a] focus:bg-white"
            style={{ borderColor: accentSoft }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = accent;
              e.currentTarget.style.boxShadow = `0 0 0 2px ${accentSoft}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = accentSoft;
              e.currentTarget.style.boxShadow = "none";
            }}
            placeholder="Your Name"
            value={contactForm.name}
            onChange={(e) =>
              setContactForm((f) => ({ ...f, name: e.target.value }))
            }
            autoComplete="name"
          />
          <input
            type="email"
            className="w-full rounded-xl border bg-[#F5F5F5] px-4 py-3 text-sm text-[#141414] outline-none transition placeholder:text-[#9a9a9a] focus:bg-white"
            style={{ borderColor: accentSoft }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = accent;
              e.currentTarget.style.boxShadow = `0 0 0 2px ${accentSoft}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = accentSoft;
              e.currentTarget.style.boxShadow = "none";
            }}
            placeholder="Email Address"
            value={contactForm.email}
            onChange={(e) =>
              setContactForm((f) => ({ ...f, email: e.target.value }))
            }
            autoComplete="email"
          />
          <input
            className="w-full rounded-xl border bg-[#F5F5F5] px-4 py-3 text-sm text-[#141414] outline-none transition placeholder:text-[#9a9a9a] focus:bg-white"
            style={{ borderColor: accentSoft }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = accent;
              e.currentTarget.style.boxShadow = `0 0 0 2px ${accentSoft}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = accentSoft;
              e.currentTarget.style.boxShadow = "none";
            }}
            placeholder="Phone Number (10 digits)"
            value={contactForm.phone}
            onChange={(e) =>
              setContactForm((f) => ({
                ...f,
                phone: e.target.value.replace(/\D/g, "").slice(0, 10),
              }))
            }
            autoComplete="tel"
            inputMode="numeric"
            maxLength={10}
          />
          <input
            type="url"
            className="w-full rounded-xl border bg-[#F5F5F5] px-4 py-3 text-sm text-[#141414] outline-none transition placeholder:text-[#9a9a9a] focus:bg-white"
            style={{ borderColor: accentSoft }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = accent;
              e.currentTarget.style.boxShadow = `0 0 0 2px ${accentSoft}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = accentSoft;
              e.currentTarget.style.boxShadow = "none";
            }}
            placeholder="Website"
            value={contactForm.website}
            onChange={(e) =>
              setContactForm((f) => ({ ...f, website: e.target.value }))
            }
            autoComplete="url"
          />
          <textarea
            rows={4}
            className="w-full resize-none rounded-xl border bg-[#F5F5F5] px-4 py-3 text-sm text-[#141414] outline-none transition placeholder:text-[#9a9a9a] focus:bg-white"
            style={{ borderColor: accentSoft }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = accent;
              e.currentTarget.style.boxShadow = `0 0 0 2px ${accentSoft}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = accentSoft;
              e.currentTarget.style.boxShadow = "none";
            }}
            placeholder="Message or Inquiry"
            value={contactForm.message}
            onChange={(e) =>
              setContactForm((f) => ({ ...f, message: e.target.value }))
            }
          />
          {contactError ? (
            <p className="text-left text-xs font-medium text-[#E24C4C]">
              {contactError}
            </p>
          ) : null}
          {contactSent ? (
            <p className="text-left text-xs font-medium text-emerald-700">
              Message sent — check dashboard Messages.
            </p>
          ) : null}
          <button
            type="submit"
            className="w-full rounded-xl px-4 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: accent }}
          >
            Send Message
          </button>
        </form>
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
          className="absolute right-4 bottom-4 flex h-9 w-9 items-center justify-center rounded-md text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: accent }}
        >
          <ChevronUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
