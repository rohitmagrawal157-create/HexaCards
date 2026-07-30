export type CardContactInfo = {
  cardName: string;
  title: string;
  businessName: string;
  countryCode: string;
  mobile: string;
  whatsapp: string;
  email: string;
  website: string;
  state: string;
  city: string;
  address: string;
};

export type CardSocialLinks = {
  instagram: string;
  facebook: string;
  linkedin: string;
  twitter: string;
  youtube: string;
  googleReview: string;
};

export type CardBusinessInfo = {
  about: string;
  services: string[];
};

export type CardAppearance = {
  coverImage: string | null;
  logoImage: string | null;
  shareImage: string | null;
  accentColor: string;
  theme: "dark" | "light";
};

export type HexaCardProfile = {
  contact: CardContactInfo;
  social: CardSocialLinks;
  business: CardBusinessInfo;
  appearance: CardAppearance;
  updatedAt: string;
};

const PROFILE_KEY = "hexaCardProfile";

export function defaultCardProfile(name = "User", phone = ""): HexaCardProfile {
  return {
    contact: {
      cardName: name,
      title: "",
      businessName: "",
      countryCode: "IN",
      mobile: phone,
      whatsapp: phone,
      email: "",
      website: "",
      state: "",
      city: "",
      address: "",
    },
    social: {
      instagram: "",
      facebook: "",
      linkedin: "",
      twitter: "",
      youtube: "",
      googleReview: "",
    },
    business: {
      about: "",
      services: [],
    },
    appearance: {
      coverImage: null,
      logoImage: null,
      shareImage: null,
      accentColor: "#BC7C10",
      theme: "dark",
    },
    updatedAt: new Date().toISOString(),
  };
}

export function getCardProfile(
  fallbackName?: string,
  fallbackPhone?: string,
): HexaCardProfile {
  if (typeof window === "undefined") {
    return defaultCardProfile(fallbackName, fallbackPhone);
  }
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return defaultCardProfile(fallbackName, fallbackPhone);
    const parsed = JSON.parse(raw) as HexaCardProfile & {
      business?: Partial<CardBusinessInfo> & { description?: string };
    };
    const base = defaultCardProfile(fallbackName, fallbackPhone);
    return {
      ...base,
      ...parsed,
      contact: {
        ...base.contact,
        ...parsed.contact,
      },
      social: {
        ...base.social,
        ...parsed.social,
      },
      business: {
        ...base.business,
        ...parsed.business,
        about:
          parsed.business?.about?.trim() ||
          parsed.business?.description?.trim() ||
          "",
        services: Array.isArray(parsed.business?.services)
          ? parsed.business.services.filter(
              (s): s is string => typeof s === "string" && s.trim().length > 0,
            )
          : [],
      },
      appearance: {
        ...base.appearance,
        ...parsed.appearance,
      },
    };
  } catch {
    return defaultCardProfile(fallbackName, fallbackPhone);
  }
}

const MAX_DATA_URL_CHARS = 450_000;

function isQuotaError(error: unknown) {
  return (
    error instanceof DOMException &&
    (error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED")
  );
}

function shrinkDataUrl(dataUrl: string | null, maxChars = MAX_DATA_URL_CHARS) {
  if (!dataUrl || dataUrl.length <= maxChars) return dataUrl;
  return null;
}

function writeProfile(next: HexaCardProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
}

export function saveCardProfile(profile: HexaCardProfile): HexaCardProfile {
  const next: HexaCardProfile = {
    ...profile,
    updatedAt: new Date().toISOString(),
  };

  try {
    writeProfile(next);
  } catch (error) {
    if (!isQuotaError(error)) throw error;

    // Drop oversized / optional images so the rest of the profile still saves
    const trimmed: HexaCardProfile = {
      ...next,
      appearance: {
        ...next.appearance,
        shareImage: shrinkDataUrl(next.appearance.shareImage, 200_000),
        coverImage: shrinkDataUrl(next.appearance.coverImage),
        logoImage: shrinkDataUrl(next.appearance.logoImage, 200_000),
      },
    };

    try {
      localStorage.removeItem(PROFILE_KEY);
      writeProfile(trimmed);
      Object.assign(next, trimmed);
    } catch (retryError) {
      if (!isQuotaError(retryError)) throw retryError;
      const minimal: HexaCardProfile = {
        ...next,
        appearance: {
          ...next.appearance,
          coverImage: null,
          logoImage: null,
          shareImage: null,
        },
      };
      localStorage.removeItem(PROFILE_KEY);
      writeProfile(minimal);
      Object.assign(next, minimal);
    }
  }

  window.dispatchEvent(new Event("hexa-card-profile-change"));
  return next;
}

/** Resize + JPEG-compress an image file for localStorage-friendly data URLs */
export function compressImageFile(
  file: File,
  options?: { maxWidth?: number; maxHeight?: number; quality?: number },
): Promise<string> {
  const maxWidth = options?.maxWidth ?? 1280;
  const maxHeight = options?.maxHeight ?? 1280;
  const quality = options?.quality ?? 0.72;

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Not an image file"));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const scale = Math.min(
        1,
        maxWidth / img.naturalWidth,
        maxHeight / img.naturalHeight,
      );
      const width = Math.max(1, Math.round(img.naturalWidth * scale));
      const height = Math.max(1, Math.round(img.naturalHeight * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas unavailable"));
        return;
      }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image"));
    };
    img.src = objectUrl;
  });
}

function formatSlugSegment(value: string) {
  const cleaned = value.replace(/[^a-zA-Z0-9]/g, "");
  if (!cleaned) return "";
  // Keep camel/Pascal compounds (PathologyLaboratory)
  if (/[a-z][A-Z]/.test(cleaned)) {
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
}

/** Match live HexaCards style: Ashirvad-PathologyLaboratory45 */
export function cardPublicSlug(profile: HexaCardProfile) {
  const raw = (
    profile.contact.businessName.trim() ||
    profile.contact.cardName.trim() ||
    "HexaCard"
  )
    .replace(/[_/\\]+/g, " ")
    .trim();

  const words = raw
    .split(/\s+/)
    .flatMap((token) => token.split("-"))
    .map(formatSlugSegment)
    .filter(Boolean);

  const base =
    words.length === 0
      ? "HexaCard"
      : words.length === 1
        ? words[0]
        : `${words[0]}-${words.slice(1).join("")}`;

  const phoneTail = profile.contact.mobile.replace(/\D/g, "").slice(-2);
  return `${base}${phoneTail}`;
}

/** Public share URL shown to users — same style as hexacards.com/CardName45 */
export function cardPublicUrl(profile: HexaCardProfile) {
  return `https://hexacards.com/${cardPublicSlug(profile)}`;
}

/** Local app path for opening the card page */
export function cardPublicPath(profile: HexaCardProfile) {
  return `/${cardPublicSlug(profile)}`;
}

