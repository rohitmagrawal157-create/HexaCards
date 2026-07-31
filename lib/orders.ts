import { getAuthUser, normalizeIndianPhone } from "@/lib/auth";

export type HexaOrderStatus = "placed" | "shipped" | "delivered";

export type HexaOrder = {
  id: string;
  createdAt: string;
  status: HexaOrderStatus;
  /** Logged-in account phone (10 digits) — used for dashboard ownership */
  ownerPhone: string;
  customerName: string;
  /** Shipping / contact phone */
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  packTitle: string;
  qty: number;
  subtotal: number;
  discount: number;
  total: number;
  coupon?: string | null;
  productTitle: string;
};

const ORDERS_KEY = "hexaOrders";

function phoneKey(phone: string | undefined | null): string {
  return normalizeIndianPhone(phone ?? "");
}

function orderOwnerKey(order: HexaOrder): string {
  return phoneKey(order.ownerPhone) || phoneKey(order.phone);
}

function readOrders(): HexaOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HexaOrder[];
    if (!Array.isArray(parsed)) return [];
    // Normalize legacy rows that predate ownerPhone
    return parsed.map((o) => ({
      ...o,
      ownerPhone: phoneKey(o.ownerPhone) || phoneKey(o.phone),
      phone: phoneKey(o.phone) || phoneKey(o.ownerPhone),
    }));
  } catch {
    return [];
  }
}

export function getOrders(): HexaOrder[] {
  return readOrders().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

/** Orders belonging to a logged-in phone (last 10 digits). */
export function getOrdersForPhone(phone: string): HexaOrder[] {
  const digits = phoneKey(phone);
  if (!digits) return [];
  return getOrders().filter((o) => orderOwnerKey(o) === digits);
}

export function hasPlacedOrder(phone: string): boolean {
  return getOrdersForPhone(phone).length > 0;
}

export function getLatestOrder(): HexaOrder | null {
  return getOrders()[0] ?? null;
}

export function getLatestOrderForPhone(phone: string): HexaOrder | null {
  return getOrdersForPhone(phone)[0] ?? null;
}

export function saveOrder(
  order: Omit<HexaOrder, "id" | "createdAt" | "status" | "ownerPhone"> & {
    status?: HexaOrderStatus;
    ownerPhone?: string;
  },
): HexaOrder {
  const auth = getAuthUser();
  const ownerPhone =
    phoneKey(order.ownerPhone) ||
    phoneKey(auth?.phone) ||
    phoneKey(order.phone);

  if (!ownerPhone) {
    throw new Error("Cannot place order without a signed-in phone number.");
  }

  const id = `HC-${Date.now().toString().slice(-8)}`;
  const next: HexaOrder = {
    ...order,
    id,
    createdAt: new Date().toISOString(),
    status: order.status ?? "placed",
    ownerPhone,
    phone: phoneKey(order.phone) || ownerPhone,
  };
  const all = readOrders();
  all.unshift(next);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(all.slice(0, 50)));
  window.dispatchEvent(new Event("hexa-orders-change"));
  return next;
}

export function formatOrderDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function statusLabel(status: HexaOrderStatus) {
  switch (status) {
    case "placed":
      return "Order placed";
    case "shipped":
      return "Shipped";
    case "delivered":
      return "Delivered";
  }
}
