import {
  productCatalog,
  type CatalogProduct,
  type ProductMedia,
} from "@/lib/product-catalog";

const ADMIN_STORE_KEY = "hexaAdminProductStore";
const ADMIN_PRODUCTS_CHANGE = "hexa-admin-products-change";

/** @deprecated legacy key — migrated once into ADMIN_STORE_KEY */
const LEGACY_CATALOG_KEY = "hexaAdminProducts";

export type AdminProductDraft = {
  title: string;
  shortTitle: string;
  category: string;
  description: string;
  price: number;
  compareAtPrice: number;
  ctaLabel: string;
  ctaHref: string;
  /** Primary product image URL or data URL */
  imageSrc: string;
  /** Extra gallery images (URL or data URL) */
  additionalImages: string[];
  /** YouTube video id or full URL (optional) */
  videoYoutubeId: string;
  /** Optional video thumbnail (defaults to primary image) */
  videoThumbnail: string;
  /** Bullet / sub points (highlights) */
  highlights: string[];
};

export type AdminProductSection = {
  id: string;
  title: string;
  subtitle: string;
  /** Category / section image URL or data URL */
  imageSrc?: string;
};

type AdminStore = {
  catalog: Record<string, CatalogProduct>;
  sections: AdminProductSection[];
  /** sectionId -> ordered product ids */
  orders: Record<string, string[]>;
};

const DEFAULT_SECTIONS: AdminProductSection[] = [
  {
    id: "business-card",
    title: "Business Card",
    subtitle: "NFC, digital profile, PVC, and metal card products.",
    imageSrc: "/Images/Products/digitalCard.jpg",
  },
  {
    id: "social-media-card",
    title: "Social Media Card",
    subtitle: "Google review, Instagram, YouTube, and keychain QR cards.",
    imageSrc: "/Images/Products/googleReview.jpg",
  },
  {
    id: "standee",
    title: "Standee",
    subtitle: "Google, Instagram, and YouTube review standees.",
    imageSrc: "/Images/Products/reviewStandy.jpg",
  },
];

/** Preferred display order for default catalog sections */
const SECTION_DISPLAY_ORDER = [
  "business-card",
  "social-media-card",
  "standee",
] as const;

function normalizeSectionOrder(
  sections: AdminProductSection[],
): AdminProductSection[] {
  const byId = new Map(sections.map((s) => [s.id, s]));
  const ordered: AdminProductSection[] = [];

  for (const id of SECTION_DISPLAY_ORDER) {
    const section = byId.get(id);
    if (section) {
      ordered.push(section);
      byId.delete(id);
    }
  }

  for (const section of sections) {
    if (byId.has(section.id)) {
      ordered.push(section);
      byId.delete(section.id);
    }
  }

  return ordered;
}

const DEFAULT_ORDERS: Record<string, string[]> = {
  "business-card": [
    "nfc-business-card",
    "digital-profile-qr",
    "pvc-card",
    "metal-card",
  ],
  standee: ["google-standee", "instagram-standee", "youtube-standee"],
  "social-media-card": [
    "google-review-card",
    "instagram-card",
    "youtube-card",
    "review-keychain-qr",
  ],
};

function cloneBaseCatalog(): Record<string, CatalogProduct> {
  return structuredClone(productCatalog);
}

function defaultStore(): AdminStore {
  return {
    catalog: cloneBaseCatalog(),
    sections: structuredClone(DEFAULT_SECTIONS),
    orders: structuredClone(DEFAULT_ORDERS),
  };
}

function slugify(input: string): string {
  const base = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return base || `item-${Date.now().toString(36)}`;
}

function uniqueId(preferred: string, existing: Set<string>): string {
  let id = preferred;
  let n = 2;
  while (existing.has(id)) {
    id = `${preferred}-${n}`;
    n += 1;
  }
  return id;
}

/** Accepts a full YouTube URL or a bare 11-char id. */
export function parseYoutubeId(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  if (/^[\w-]{11}$/.test(raw)) return raw;

  try {
    const url = new URL(raw);
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.replace(/^\//, "").slice(0, 11);
      return /^[\w-]{11}$/.test(id) ? id : null;
    }
    const v = url.searchParams.get("v");
    if (v && /^[\w-]{11}$/.test(v)) return v;
    const embed = url.pathname.match(/\/embed\/([\w-]{11})/);
    if (embed?.[1]) return embed[1];
    const shorts = url.pathname.match(/\/shorts\/([\w-]{11})/);
    if (shorts?.[1]) return shorts[1];
  } catch {
    // not a URL
  }
  return null;
}

export function buildMediaFromDraft(draft: AdminProductDraft): ProductMedia[] {
  const alt = draft.shortTitle.trim() || draft.title.trim() || "Product";
  const primary =
    draft.imageSrc.trim() || "/Images/Products/digitalCard.jpg";
  const media: ProductMedia[] = [
    {
      type: "image",
      src: primary,
      alt,
    },
  ];

  for (const src of draft.additionalImages) {
    const trimmed = src.trim();
    if (!trimmed || trimmed === primary) continue;
    media.push({
      type: "image",
      src: trimmed,
      alt: `${alt} — gallery`,
    });
  }

  const youtubeId = parseYoutubeId(draft.videoYoutubeId);
  if (youtubeId) {
    media.push({
      type: "video",
      youtubeId,
      thumbnail:
        draft.videoThumbnail.trim() ||
        primary ||
        `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
      alt: `${alt} — video`,
    });
  }

  return media;
}

function readStore(): AdminStore {
  if (typeof window === "undefined") return defaultStore();

  try {
    const raw = localStorage.getItem(ADMIN_STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AdminStore;
      if (
        parsed?.catalog &&
        Array.isArray(parsed.sections) &&
        parsed.orders &&
        typeof parsed.orders === "object"
      ) {
        const store: AdminStore = {
          catalog: parsed.catalog,
          sections: normalizeSectionOrder(parsed.sections),
          orders: parsed.orders,
        };
        return store;
      }
    }
  } catch {
    /* fall through */
  }

  // Migrate legacy catalog-only storage
  try {
    const legacy = localStorage.getItem(LEGACY_CATALOG_KEY);
    if (legacy) {
      const catalog = JSON.parse(legacy) as Record<string, CatalogProduct>;
      if (catalog && typeof catalog === "object") {
        const store: AdminStore = {
          catalog,
          sections: structuredClone(DEFAULT_SECTIONS),
          orders: structuredClone(DEFAULT_ORDERS),
        };
        writeStore(store);
        localStorage.removeItem(LEGACY_CATALOG_KEY);
        return store;
      }
    }
  } catch {
    /* ignore */
  }

  return defaultStore();
}

function writeStore(store: AdminStore) {
  localStorage.setItem(ADMIN_STORE_KEY, JSON.stringify(store));
  window.dispatchEvent(new Event(ADMIN_PRODUCTS_CHANGE));
}

/** Kept for dashboard imports that still expect this name */
export type AdminProductSectionId = string;

export function getAdminSections(): AdminProductSection[] {
  return normalizeSectionOrder(readStore().sections);
}

/** @deprecated use getAdminSections() */
export const ADMIN_PRODUCT_SECTIONS = DEFAULT_SECTIONS;

export function getAdminProducts(): CatalogProduct[] {
  return Object.values(readStore().catalog);
}

export function getAdminProductsBySection(): Record<string, CatalogProduct[]> {
  const store = readStore();
  const result: Record<string, CatalogProduct[]> = {};

  for (const section of store.sections) {
    const ids = store.orders[section.id] ?? [];
    result[section.id] = ids
      .map((id) => store.catalog[id])
      .filter((p): p is CatalogProduct => Boolean(p));
  }

  return result;
}

export function getAdminProduct(id: string): CatalogProduct | null {
  return readStore().catalog[id] ?? null;
}

export function updateAdminProduct(
  id: string,
  draft: AdminProductDraft,
): CatalogProduct | null {
  const store = readStore();
  const existing = store.catalog[id];
  if (!existing) return null;

  store.catalog[id] = {
    ...existing,
    title: draft.title.trim(),
    shortTitle: draft.shortTitle.trim(),
    category: draft.category.trim(),
    description: draft.description.trim(),
    price: Number(draft.price) || 0,
    compareAtPrice: Number(draft.compareAtPrice) || 0,
    ctaLabel: draft.ctaLabel.trim(),
    ctaHref: draft.ctaHref.trim(),
    highlights: draft.highlights.map((h) => h.trim()).filter(Boolean),
    media: buildMediaFromDraft(draft),
  };

  writeStore(store);
  return store.catalog[id];
}

export function addAdminProduct(
  sectionId: string,
  draft: AdminProductDraft,
): CatalogProduct | null {
  const store = readStore();
  if (!store.sections.some((s) => s.id === sectionId)) return null;

  const existingIds = new Set(Object.keys(store.catalog));
  const id = uniqueId(
    slugify(draft.shortTitle || draft.title),
    existingIds,
  );

  const product: CatalogProduct = {
    id,
    title: draft.title.trim(),
    shortTitle: draft.shortTitle.trim() || draft.title.trim(),
    category: draft.category.trim() || "General",
    description: draft.description.trim(),
    price: Number(draft.price) || 0,
    compareAtPrice: Number(draft.compareAtPrice) || 0,
    media: buildMediaFromDraft(draft),
    highlights: draft.highlights.map((h) => h.trim()).filter(Boolean),
    finishes: [],
    included: [],
    ctaLabel: draft.ctaLabel.trim() || "Order now",
    ctaHref: draft.ctaHref.trim() || `/product/${id}`,
    designable: false,
  };

  store.catalog[id] = product;
  store.orders[sectionId] = [...(store.orders[sectionId] ?? []), id];
  writeStore(store);
  return product;
}

export function deleteAdminProduct(id: string): boolean {
  const store = readStore();
  if (!store.catalog[id]) return false;
  delete store.catalog[id];
  for (const sectionId of Object.keys(store.orders)) {
    store.orders[sectionId] = store.orders[sectionId].filter((pid) => pid !== id);
  }
  writeStore(store);
  return true;
}

export function addAdminSection(input: {
  title: string;
  subtitle?: string;
  imageSrc?: string;
}): AdminProductSection | null {
  const title = input.title.trim();
  if (!title) return null;

  const store = readStore();
  const existingIds = new Set(store.sections.map((s) => s.id));
  const id = uniqueId(slugify(title), existingIds);

  const section: AdminProductSection = {
    id,
    title,
    subtitle: input.subtitle?.trim() || `Products in ${title}.`,
    imageSrc: input.imageSrc?.trim() || undefined,
  };

  store.sections.push(section);
  store.orders[id] = [];
  writeStore(store);
  return section;
}

export function updateAdminSection(
  sectionId: string,
  input: {
    title: string;
    subtitle?: string;
    imageSrc?: string;
  },
): AdminProductSection | null {
  const title = input.title.trim();
  if (!title) return null;

  const store = readStore();
  const index = store.sections.findIndex((s) => s.id === sectionId);
  if (index < 0) return null;

  const next: AdminProductSection = {
    ...store.sections[index],
    title,
    subtitle: input.subtitle?.trim() || `Products in ${title}.`,
    imageSrc: input.imageSrc?.trim() || undefined,
  };

  store.sections[index] = next;
  writeStore(store);
  return next;
}

/** Removes a section and optionally deletes its products from the catalog. */
export function deleteAdminSection(
  sectionId: string,
  options?: { deleteProducts?: boolean },
): boolean {
  const store = readStore();
  const index = store.sections.findIndex((s) => s.id === sectionId);
  if (index < 0) return false;

  const productIds = store.orders[sectionId] ?? [];
  const deleteProducts = options?.deleteProducts !== false;

  if (deleteProducts) {
    for (const productId of productIds) {
      delete store.catalog[productId];
    }
  } else {
    // Drop products from this section only; keep catalog entries orphaned-free by removing ids
  }

  store.sections.splice(index, 1);
  delete store.orders[sectionId];
  writeStore(store);
  return true;
}

export function resetAdminProducts() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ADMIN_STORE_KEY);
  localStorage.removeItem(LEGACY_CATALOG_KEY);
  window.dispatchEvent(new Event(ADMIN_PRODUCTS_CHANGE));
}

export function productImageSrc(product: CatalogProduct): string | null {
  const first = product.media[0];
  if (!first) return null;
  if (first.type === "image") return first.src;
  return first.thumbnail;
}
