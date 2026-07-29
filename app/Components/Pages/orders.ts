export type HexaOrderStatus = "placed" | "shipped" | "delivered";

export type HexaOrder = {
  id: string;
  createdAt: string;
  status: HexaOrderStatus;
  customerName: string;
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

function readOrders(): HexaOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HexaOrder[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getOrders(): HexaOrder[] {
  return readOrders().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getLatestOrder(): HexaOrder | null {
  return getOrders()[0] ?? null;
}

export function saveOrder(
  order: Omit<HexaOrder, "id" | "createdAt" | "status"> & {
    status?: HexaOrderStatus;
  },
): HexaOrder {
  const id = `HC-${Date.now().toString().slice(-8)}`;
  const next: HexaOrder = {
    ...order,
    id,
    createdAt: new Date().toISOString(),
    status: order.status ?? "placed",
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
