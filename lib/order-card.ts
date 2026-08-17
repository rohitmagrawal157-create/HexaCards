import { getOrderById, updateOrder, type HexaOrder } from "@/lib/orders";
import { isDefaultLogoImage } from "@/lib/card-profile";
import { blobUrlToDataUrl } from "@/lib/user-cards";
import { getCachedOrderLogo, isOrderLogoRef, loadOrderLogo } from "@/lib/order-logo-store";
import { styledQrDataUri } from "@/lib/styled-qr";

export type CardBodyType = "black" | "white";
export type CardMetalFinish = "gold" | "silver";

export type OrderCardLogoLayout = {
  size: number;
  x: number;
  y: number;
};

/** Full card design saved at checkout from the card customizer */
export type OrderCardDesignData = {
  cardBody: CardBodyType;
  finish: CardMetalFinish;
  cardColor: string;
  accentColor: string;
  /**
   * Color chosen in Card Customizer at checkout — never overwritten by
   * dashboard Appearance edits.
   */
  lockedAccentColor?: string;
  /** Name / title on front */
  name: string;
  /** Subtitle on front */
  subtitle: string;
  /** Optional extra line on front */
  extraLine?: string;
  /** User-uploaded logo — back side (data URL or public path) */
  logoSrc?: string;
  logoLayout?: OrderCardLogoLayout;
  liveUrl?: string;
};

export type ResolvedOrderCardDesign = OrderCardDesignData & {
  slug: string;
  liveUrl: string;
  qrUrl: string;
};

/** Print / PDF 2 card size — 3.7 × 2.12 inches */
export const CARD_PRINT_WIDTH_IN = 3.7;
export const CARD_PRINT_HEIGHT_IN = 2.12;
export const CARD_CORNER_RADIUS_IN = 0.12;
export const CARD_PRINT_SIZE_LABEL = `${CARD_PRINT_WIDTH_IN} × ${CARD_PRINT_HEIGHT_IN} in`;

function isUsableLogoSrc(src?: string | null): src is string {
  if (!src?.trim()) return false;
  if (src.startsWith("blob:")) return false;
  if (isOrderLogoRef(src)) return false;
  if (isDefaultLogoImage(src)) return false;
  if (src.startsWith("data:image/")) return src.length > 80;
  return (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("/") ||
    src.startsWith("data:")
  );
}

function pickStaticLogoSrc(
  ...candidates: (string | undefined | null)[]
): string | undefined {
  for (const candidate of candidates) {
    if (isUsableLogoSrc(candidate)) return candidate;
  }
  return undefined;
}

/** Resolve a printable logo — data URL, path, or convert expired blob URLs */
export async function resolveOrderLogoSrc(
  order: HexaOrder,
): Promise<string | undefined> {
  const stored = order.cardDesign?.logoSrc;
  const fromStore = await loadOrderLogo(order.id, stored);
  if (fromStore) return fromStore;

  const staticSrc = pickStaticLogoSrc(stored);
  if (staticSrc) return staticSrc;

  const blobCandidates = [order.cardDesign?.logoSrc].filter(
    (src): src is string => Boolean(src?.startsWith("blob:")),
  );

  for (const blob of blobCandidates) {
    try {
      const dataUrl = await blobUrlToDataUrl(blob);
      if (order.cardDesign) {
        updateOrder(order.id, {
          cardDesign: { ...order.cardDesign, logoSrc: dataUrl },
        });
      }
      return dataUrl;
    } catch {
      // try next source
    }
  }

  return undefined;
}

type LogoPixel = { r: number; g: number; b: number; a: number };

function readLogoPixel(data: Uint8ClampedArray, i: number): LogoPixel {
  return {
    r: data[i],
    g: data[i + 1],
    b: data[i + 2],
    a: data[i + 3],
  };
}

function logoPixelLuminance({ r, g, b }: LogoPixel) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function logoPixelSaturation({ r, g, b }: LogoPixel) {
  const maxC = Math.max(r, g, b);
  const minC = Math.min(r, g, b);
  return maxC === 0 ? 0 : (maxC - minC) / maxC;
}

function pixelIndex(x: number, y: number, width: number) {
  return (y * width + x) * 4;
}

function isWhitePaper(pixel: LogoPixel) {
  if (pixel.a < 8) return true;
  const lum = logoPixelLuminance(pixel);
  const sat = logoPixelSaturation(pixel);
  return lum > 236 && sat < 0.12;
}

function isBlackBox(pixel: LogoPixel) {
  if (pixel.a < 8) return true;
  const lum = logoPixelLuminance(pixel);
  const sat = logoPixelSaturation(pixel);
  return lum < 28 && sat < 0.18;
}

function sampleCornerBackdrop(
  data: Uint8ClampedArray,
  width: number,
  height: number,
): "white" | "black" | null {
  const corners = [
    readLogoPixel(data, pixelIndex(0, 0, width)),
    readLogoPixel(data, pixelIndex(width - 1, 0, width)),
    readLogoPixel(data, pixelIndex(0, height - 1, width)),
    readLogoPixel(data, pixelIndex(width - 1, height - 1, width)),
  ];
  const whiteHits = corners.filter(isWhitePaper).length;
  const blackHits = corners.filter(isBlackBox).length;
  if (whiteHits >= 3) return "white";
  if (blackHits >= 3) return "black";
  return null;
}

/**
 * Knock out only the outer paper / JPEG box connected to the edges.
 * Never erase interior artwork — including black taglines and fine type.
 */
function punchEdgeBackdrop(
  data: Uint8ClampedArray,
  width: number,
  height: number,
) {
  const mode = sampleCornerBackdrop(data, width, height);
  if (!mode) {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 8) data[i + 3] = 0;
    }
    return;
  }

  const matches = mode === "white" ? isWhitePaper : isBlackBox;
  const seen = new Uint8Array(width * height);
  const stack: number[] = [];

  const enqueue = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const idx = y * width + x;
    if (seen[idx]) return;
    const pixel = readLogoPixel(data, pixelIndex(x, y, width));
    if (!matches(pixel)) return;
    seen[idx] = 1;
    stack.push(idx);
  };

  for (let x = 0; x < width; x += 1) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }

  while (stack.length) {
    const idx = stack.pop()!;
    const x = idx % width;
    const y = (idx / width) | 0;
    data[idx * 4 + 3] = 0;
    enqueue(x + 1, y);
    enqueue(x - 1, y);
    enqueue(x, y + 1);
    enqueue(x, y - 1);
  }
}

/** Keep every logo mark; only the outer backdrop becomes transparent. */
export async function prepareCardLogoDataUrl(
  src: string,
): Promise<string | undefined> {
  if (typeof window === "undefined") return src;
  if (!src.startsWith("data:image/") && !src.startsWith("blob:") && !src.startsWith("http")) {
    return src;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      if (!width || !height) {
        resolve(src);
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(src);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      const image = ctx.getImageData(0, 0, width, height);
      punchEdgeBackdrop(image.data, width, height);
      ctx.putImageData(image, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(undefined);
    img.src = src;
  });
}

export type LogoFoilFinish = "gold" | "silver";

const LOGO_FOIL_STOPS: Record<LogoFoilFinish, readonly { offset: number; color: string }[]> = {
  gold: [
    { offset: 0, color: "#C9982C" },
    { offset: 0.18, color: "#E8C56A" },
    { offset: 0.38, color: "#FFF3D7" },
    { offset: 0.55, color: "#D8A83A" },
    { offset: 0.78, color: "#C9982C" },
    { offset: 1, color: "#E4B84A" },
  ],
  silver: [
    { offset: 0, color: "#C5C9CD" },
    { offset: 0.18, color: "#E8EAEC" },
    { offset: 0.38, color: "#FFFFFF" },
    { offset: 0.55, color: "#D0D4D8" },
    { offset: 0.78, color: "#B8BCC0" },
    { offset: 1, color: "#DEE1E4" },
  ],
};

/** Prepare backdrop then tint the logo to the selected gold or silver foil — full size kept. */
export async function logoForCardFinish(
  src: string,
  finish?: LogoFoilFinish | null,
): Promise<string | undefined> {
  const cleaned = await prepareCardLogoDataUrl(src);
  if (!cleaned) return undefined;
  if (!finish) return cleaned;
  if (typeof window === "undefined") return cleaned;

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      if (!width || !height) {
        resolve(cleaned);
        return;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(cleaned);
        return;
      }
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      ctx.globalCompositeOperation = "source-in";
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      for (const stop of LOGO_FOIL_STOPS[finish]) {
        gradient.addColorStop(stop.offset, stop.color);
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(cleaned);
    img.src = cleaned;
  });
}

/** Flatten uploaded logo to a sharp black mark on a transparent background */
export async function toBlackLogoDataUrl(
  src: string,
): Promise<string | undefined> {
  if (typeof window === "undefined") return src;
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      if (!width || !height) {
        resolve(src);
        return;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(src);
        return;
      }
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      const image = ctx.getImageData(0, 0, width, height);
      const data = image.data;
      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        if (alpha < 18 || lum > 242) {
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
          data[i + 3] = 0;
          continue;
        }
        data[i] = 20;
        data[i + 1] = 20;
        data[i + 2] = 20;
        data[i + 3] = 255;
      }
      ctx.putImageData(image, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(undefined);
    img.src = src;
  });
}

export async function buildOrderCardDesignAsync(
  order: HexaOrder,
): Promise<ResolvedOrderCardDesign> {
  if (order.cardDesign && !order.cardDesign.lockedAccentColor?.trim()) {
    updateOrder(order.id, {
      cardDesign: {
        ...order.cardDesign,
        lockedAccentColor: order.cardDesign.accentColor,
      },
    });
  }
  const design = buildOrderCardDesign(getOrderById(order.id) ?? order);
  const logoSrc = await resolveOrderLogoSrc(getOrderById(order.id) ?? order);
  return { ...design, logoSrc: logoSrc || undefined };
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Card URL slug from name + phone — e.g. faizan-shaikh77 */
export function buildCardSlugFromName(
  name: string,
  phone: string,
  orderId?: string,
) {
  const base = slugify(name) || "hexa-card";
  const phoneTail = phone.replace(/\D/g, "").slice(-2);
  if (orderId) {
    const orderTail = orderId.replace(/\D/g, "").slice(-2);
    return `${base}${phoneTail}${orderTail}`;
  }
  return `${base}${phoneTail}`;
}

/** Unique public slug for an order — name + phone + order id tails */
export function buildOrderCardSlug(
  name: string,
  phone: string,
  orderId: string,
) {
  return buildCardSlugFromName(name, phone, orderId);
}

function slugFromUrl(url?: string | null): string {
  if (!url?.trim()) return "";
  const raw = url.trim();
  try {
    const path = raw.includes("://") ? new URL(raw).pathname : raw;
    return path.replace(/^\/+|\/+$/g, "").split("/")[0]?.toLowerCase() ?? "";
  } catch {
    return raw.replace(/^\/+|\/+$/g, "").split("/")[0]?.toLowerCase() ?? "";
  }
}

function orderName(order: HexaOrder): string {
  return order.cardDesign?.name?.trim() || order.customerName || "Your Name";
}

function orderPublicSlug(order: HexaOrder): string {
  return (
    order.cardSlug?.trim() ||
    buildOrderCardSlug(orderName(order), order.phone, order.id)
  );
}

/** Find order for a public card URL slug — supports stored, computed, and legacy slugs */
export function findOrderByPublicSlug(
  slug: string,
  orders: HexaOrder[],
): HexaOrder | null {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) return null;

  const exact = orders.filter((order) => {
    const candidates = [
      order.cardSlug,
      slugFromUrl(order.cardUrl),
      slugFromUrl(order.cardDesign?.liveUrl),
      orderPublicSlug(order),
      buildCardSlugFromName(orderName(order), order.phone),
    ]
      .map((value) => value?.trim().toLowerCase())
      .filter(Boolean);
    return candidates.includes(normalized);
  });
  if (exact.length === 1) return exact[0];
  if (exact.length > 1) {
    return (
      exact.find((order) => order.cardSlug?.trim().toLowerCase() === normalized) ??
      exact[0]
    );
  }

  const prefixMatches = orders.filter((order) => {
    const full = orderPublicSlug(order).toLowerCase();
    const short = buildCardSlugFromName(orderName(order), order.phone).toLowerCase();
    return (
      full.startsWith(normalized) ||
      normalized.startsWith(full) ||
      short === normalized ||
      full.startsWith(`${normalized}`)
    );
  });
  if (prefixMatches.length === 1) return prefixMatches[0];

  return null;
}

export function resolveOrderLiveUrl(order: HexaOrder): {
  slug: string;
  liveUrl: string;
} {
  const name = orderName(order);
  const slug = orderPublicSlug(order);
  const liveUrl =
    order.cardUrl?.trim() ||
    order.cardDesign?.liveUrl?.trim() ||
    `https://hexacards.com/${slug}`;
  return { slug, liveUrl };
}

/** Styled dotted QR — used by dashboard and any image-based QR preview */
export function buildCardQrImageUrl(
  liveUrl: string,
  _size = 400,
  moduleColor = "141414",
) {
  const hex = moduleColor.replace("#", "").replace(/^0x/i, "") || "141414";
  return styledQrDataUri(liveUrl, {
    color: `#${hex}`,
    includeFrame: true,
  });
}

function hexLuminance(hex: string) {
  const raw = hex.replace("#", "").padEnd(6, "0").slice(0, 6);
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/** QR module color with enough contrast on white */
export function qrModuleColor(accent: string, gold = false) {
  if (gold) return "9B6F18";
  const lum = hexLuminance(accent);
  if (lum > 165) return "141414";
  return accent.replace("#", "");
}

function finishColors(finish: CardMetalFinish) {
  return finish === "silver"
    ? { accentColor: "#C0C0C0" }
    : { accentColor: "#BC7C10" };
}

function bodyColor(cardBody: CardBodyType): string {
  return cardBody === "white" ? "#FFFFFF" : "#141414";
}

const PRINT_ACCENT_LABELS: { hex: string; label: string }[] = [
  { hex: "#C9982C", label: "Gold" },
  { hex: "#BC7C10", label: "Gold" },
  { hex: "#141414", label: "Black" },
  { hex: "#E53935", label: "Red" },
  { hex: "#00B813", label: "Green" },
  { hex: "#FF8E00", label: "Orange" },
  { hex: "#C2185B", label: "Dark Pink" },
  { hex: "#1565C0", label: "Royal Blue" },
  { hex: "#7CB342", label: "Light Green" },
  { hex: "#FDD835", label: "Yellow" },
  { hex: "#00BFFF", label: "Sky Blue" },
  { hex: "#FD0095", label: "Hot Pink" },
  { hex: "#C0C0C0", label: "Silver" },
  { hex: "#9CA0A4", label: "Silver" },
];

export function accentColorLabel(hex?: string) {
  const normalized = (hex || "").trim().toUpperCase();
  if (!normalized) return "Custom";
  return (
    PRINT_ACCENT_LABELS.find((row) => row.hex.toUpperCase() === normalized)
      ?.label ?? "Custom"
  );
}

/** Shown in admin preview — metal finish on black cards, accent name on white cards */
export function printFinishLabel(design: {
  cardBody: CardBodyType;
  finish: CardMetalFinish;
  accentColor: string;
}) {
  if (design.cardBody === "black") {
    return design.finish === "silver" ? "Silver" : "Gold";
  }
  return accentColorLabel(design.accentColor);
}

export function buildOrderCardDesign(order: HexaOrder): ResolvedOrderCardDesign {
  const { slug, liveUrl } = resolveOrderLiveUrl(order);

  const cardBody = order.cardDesign?.cardBody ?? "black";
  const finish = order.cardDesign?.finish ?? "gold";
  const preset = finishColors(finish);
  const locked =
    order.cardDesign?.lockedAccentColor?.trim() ||
    order.cardDesign?.accentColor?.trim() ||
    preset.accentColor;
  const accentColor = locked;
  const cardColor = order.cardDesign?.cardColor?.trim() || bodyColor(cardBody);

  // High-res source for sharp print/PDF; same URL as dashboard QR modal
  const qrUrl = buildCardQrImageUrl(liveUrl, 400);

  return {
    cardBody,
    finish,
    cardColor,
    accentColor,
    name:
      order.cardDesign?.name?.trim() ||
      order.customerName ||
      "Your Name",
    subtitle:
      order.cardDesign?.subtitle?.trim() ||
      order.jobTitle?.trim() ||
      "Title or company",
    extraLine:
      order.cardDesign?.extraLine?.trim() ||
      order.phone ||
      undefined,
    logoSrc:
      getCachedOrderLogo(order.id) ||
      pickStaticLogoSrc(order.cardDesign?.logoSrc),
    logoLayout: order.cardDesign?.logoLayout ?? { size: 120, x: 0, y: 0 },
    slug,
    liveUrl,
    qrUrl,
  };
}

/** Placeholder logo for sample orders without an upload */
export const SAMPLE_LOGO_SVG =
  "data:image/svg+xml," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="none"/>
  <path d="M100 28 L172 68 V132 L100 172 L28 132 V68 Z" fill="none" stroke="#BC7C10" stroke-width="8"/>
  <text x="100" y="112" text-anchor="middle" font-family="Arial,sans-serif" font-size="42" font-weight="700" fill="#BC7C10">H</text>
</svg>`);
