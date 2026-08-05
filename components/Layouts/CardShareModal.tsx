"use client";

import { createPortal } from "react-dom";
import { Mail, X } from "lucide-react";
import {
  FaWhatsapp,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

type CardShareModalProps = {
  open: boolean;
  onClose: () => void;
  accent: string;
  /** Used as email subject / share name */
  cardName?: string;
};

function cardUrl() {
  return typeof window !== "undefined" ? window.location.href : "";
}

function shareWhatsApp() {
  const text = "Hi, check out my HexaCards digital profile";
  window.open(
    `https://wa.me/?text=${encodeURIComponent(text)}`,
    "_blank",
    "noopener,noreferrer",
  );
}

/**
 * Shared “Share this card” modal — WhatsApp, Facebook, Twitter, LinkedIn, Email.
 * Used by Classic, Basic, Modern, Compact, and Social layouts.
 */
export default function CardShareModal({
  open,
  onClose,
  accent,
  cardName = "HexaCards",
}: CardShareModalProps) {
  if (!open || typeof document === "undefined") return null;

  const url = cardUrl();
  const shareLinks = [
    {
      label: "WhatsApp",
      Icon: FaWhatsapp,
      onClick: () => {
        shareWhatsApp();
        onClose();
      },
    },
    {
      label: "Facebook",
      Icon: FaFacebookF,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      label: "Twitter",
      Icon: FaTwitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent("Check out my HexaCards digital profile")}&url=${encodeURIComponent(url)}`,
    },
    {
      label: "LinkedIn",
      Icon: FaLinkedinIn,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      label: "Email",
      Icon: Mail,
      href: `mailto:?subject=${encodeURIComponent(cardName)}&body=${encodeURIComponent(`Check out my digital business card\n${url}`)}`,
    },
  ];

  const iconClass =
    "flex h-11 w-11 items-center justify-center rounded-full bg-gray-50 text-[#141414] transition-colors";

  function applyHover(el: HTMLElement, on: boolean) {
    el.style.backgroundColor = on ? accent : "";
    el.style.color = on ? "#fff" : "";
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-5"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#141414]">Share this card</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {shareLinks.map(({ label, Icon, href, onClick }) =>
            onClick ? (
              <button
                key={label}
                type="button"
                onClick={onClick}
                aria-label={`Share via ${label}`}
                className={iconClass}
                onMouseEnter={(e) => applyHover(e.currentTarget, true)}
                onMouseLeave={(e) => applyHover(e.currentTarget, false)}
              >
                <Icon className="h-[18px] w-[18px]" />
              </button>
            ) : (
              <a
                key={label}
                href={href}
                target={label === "Email" ? undefined : "_blank"}
                rel="noreferrer"
                aria-label={`Share via ${label}`}
                className={iconClass}
                onClick={onClose}
                onMouseEnter={(e) => applyHover(e.currentTarget, true)}
                onMouseLeave={(e) => applyHover(e.currentTarget, false)}
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            ),
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
