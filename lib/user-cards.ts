import type { OrderCardDesignData } from "@/lib/order-card";
import { resolveOrderLiveUrl } from "@/lib/order-card";
import { getOrderCardProfile } from "@/lib/order-card-profile";
import { getOrdersForPhone, type HexaOrder } from "@/lib/orders";

export type SavedCardDesign = {
  title?: string;
  subTitle?: string;
  moreDetails?: string;
  cardBody?: "black" | "white";
  cardMode?: "gold" | "silver" | "customize";
  cardColor?: string;
  accentColor?: string;
  logoUrl?: string | null;
  backLogo?: { size: number; x: number; y: number };
  hasLogo?: boolean;
};

export type UserDashboardCard = {
  orderId: string;
  name: string;
  subtitle: string;
  slug: string;
  publicUrl: string;
  publicPath: string;
  status: HexaOrder["status"];
  createdAt: string;
  accentColor: string;
  isLatest: boolean;
};


export function isCardProductOrder(order: HexaOrder): boolean {
  if (order.cardDesign) return true;
  const title = order.productTitle.toLowerCase();
  return (
    title.includes("nfc") ||
    title.includes("business card") ||
    title.includes("hexa card")
  );
}

export function savedDesignToCardDesign(
  design: SavedCardDesign | null,
  customerName: string,
  phone: string,
  logoSrc?: string,
): OrderCardDesignData | undefined {
  if (!design && !logoSrc) return undefined;

  const cardBody = design?.cardBody ?? "black";
  const finish =
    cardBody === "black"
      ? design?.cardMode === "silver"
        ? "silver"
        : "gold"
      : "gold";

  const accent =
    design?.accentColor ?? (finish === "silver" ? "#9CA0A4" : "#C9982C");

  return {
    cardBody,
    finish,
    cardColor: design?.cardColor ?? (cardBody === "black" ? "#141414" : "#FFFFFF"),
    accentColor: accent,
    lockedAccentColor: accent,
    name: design?.title?.trim() || customerName,
    subtitle: design?.subTitle?.trim() || "",
    extraLine: design?.moreDetails?.trim() || phone || undefined,
    logoSrc: logoSrc || design?.logoUrl || undefined,
    logoLayout: design?.backLogo ?? { size: 86, x: 50, y: 48 },
  };
}

export function orderToDashboardCard(
  order: HexaOrder,
  isLatest: boolean,
): UserDashboardCard {
  const savedProfile = getOrderCardProfile(order.id);
  const name =
    savedProfile?.contact.cardName?.trim() ||
    order.cardDesign?.name?.trim() ||
    order.customerName ||
    "Your Name";
  const subtitle =
    savedProfile?.contact.title?.trim() ||
    order.cardDesign?.subtitle?.trim() ||
    order.jobTitle?.trim() ||
    order.productTitle;
  const { slug, liveUrl: publicUrl } = resolveOrderLiveUrl(order);

  return {
    orderId: order.id,
    name,
    subtitle,
    slug,
    publicUrl,
    publicPath: `/${slug}`,
    status: order.status,
    createdAt: order.createdAt,
    accentColor:
      order.cardDesign?.lockedAccentColor ||
      order.cardDesign?.accentColor ||
      "#BC7C10",
    isLatest,
  };
}

export function getUserDashboardCards(phone: string): UserDashboardCard[] {
  const orders = getOrdersForPhone(phone).filter(isCardProductOrder);
  return orders.map((order, index) => orderToDashboardCard(order, index === 0));
}

export function getUserDashboardCardsFromOrders(
  orders: HexaOrder[],
): UserDashboardCard[] {
  return orders
    .filter(isCardProductOrder)
    .map((order, index) => orderToDashboardCard(order, index === 0));
}

/** @deprecated use initOrderCardProfile — each order keeps its own profile */
export function syncCardProfileFromOrder(_order: HexaOrder) {
  // No-op: profiles are stored per order id (see order-card-profile.ts)
}

export async function blobUrlToDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function resolveLogoForOrder(
  design: SavedCardDesign | null,
): Promise<string | undefined> {
  const logo = design?.logoUrl;
  if (!logo) return undefined;
  if (logo.startsWith("blob:")) {
    try {
      return await blobUrlToDataUrl(logo);
    } catch {
      return undefined;
    }
  }
  return logo;
}
