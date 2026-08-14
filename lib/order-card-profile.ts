import {
  defaultCardProfile,
  normalizeLogoImage,
  type HexaCardProfile,
} from "@/lib/card-profile";
import {
  getOrderById,
  updateOrder,
  type HexaOrder,
} from "@/lib/orders";

const ORDER_PROFILES_KEY = "hexaOrderCardProfiles";

function profileFromOrder(
  order: HexaOrder,
  base: HexaCardProfile,
): HexaCardProfile {
  const design = order.cardDesign;
  return {
    ...base,
    contact: {
      ...base.contact,
      cardName:
        design?.name?.trim() || order.customerName || base.contact.cardName,
      title:
        design?.subtitle?.trim() ||
        order.jobTitle?.trim() ||
        base.contact.title,
      mobile: order.phone || base.contact.mobile,
      whatsapp: order.phone || base.contact.whatsapp,
      email: order.email?.trim() || base.contact.email,
      city: order.city?.trim() || base.contact.city,
      address: order.address?.trim() || base.contact.address,
    },
    appearance: {
      ...base.appearance,
      logoImage: design?.logoSrc
        ? normalizeLogoImage(design.logoSrc)
        : base.appearance.logoImage,
    },
  };
}

function readAll(): Record<string, HexaCardProfile> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(ORDER_PROFILES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, HexaCardProfile>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(profiles: Record<string, HexaCardProfile>) {
  localStorage.setItem(ORDER_PROFILES_KEY, JSON.stringify(profiles));
  window.dispatchEvent(new Event("hexa-order-profiles-change"));
}

export function getOrderCardProfile(orderId: string): HexaCardProfile | null {
  return readAll()[orderId] ?? null;
}

export function saveOrderCardProfile(
  orderId: string,
  profile: HexaCardProfile,
): HexaCardProfile {
  const next: HexaCardProfile = {
    ...profile,
    updatedAt: new Date().toISOString(),
  };
  const all = readAll();
  all[orderId] = next;
  writeAll(all);
  syncOrderCardDesignFromProfile(orderId, next);
  return next;
}

/** Create isolated profile for a new order — does not touch other cards */
export function initOrderCardProfile(order: HexaOrder): HexaCardProfile {
  const existing = getOrderCardProfile(order.id);
  if (existing) return existing;

  const base = defaultCardProfile(order.customerName, order.phone);
  const profile = profileFromOrder(order, base);
  return saveOrderCardProfile(order.id, profile);
}

export function loadOrderCardProfile(
  order: HexaOrder,
  fallbackName?: string,
  fallbackPhone?: string,
): HexaCardProfile {
  const saved = getOrderCardProfile(order.id);
  if (saved) return saved;

  const base = defaultCardProfile(
    fallbackName || order.customerName,
    fallbackPhone || order.phone,
  );
  return profileFromOrder(order, base);
}

/** Keep NFC print fields on the order in sync with profile edits */
function syncOrderCardDesignFromProfile(
  orderId: string,
  profile: HexaCardProfile,
) {
  const order = getOrderById(orderId);
  if (!order) return;

  updateOrder(orderId, {
    customerName: profile.contact.cardName.trim() || order.customerName,
    jobTitle: profile.contact.title.trim() || order.jobTitle,
    email: profile.contact.email.trim() || order.email,
    phone: profile.contact.mobile.replace(/\D/g, "").slice(-10) || order.phone,
    city: profile.contact.city.trim() || order.city,
    address: profile.contact.address.trim() || order.address,
    cardDesign: order.cardDesign
      ? {
          ...order.cardDesign,
          name: profile.contact.cardName.trim() || order.cardDesign.name,
          subtitle: profile.contact.title.trim() || order.cardDesign.subtitle,
        }
      : undefined,
  });
}

/** Ensure every placed card order has a saved profile (one-time per order) */
export function ensureOrderCardProfile(order: HexaOrder): HexaCardProfile {
  const saved = getOrderCardProfile(order.id);
  if (saved) return saved;
  return initOrderCardProfile(order);
}
