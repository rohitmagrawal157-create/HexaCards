"use client";

import { useMemo, useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Eye,
  FileDown,
  Printer,
  X,
} from "lucide-react";
import {
  formatOrderAddress,
  formatOrderDate,
  paymentStatusLabel,
  statusLabel,
  type HexaOrder,
  type HexaPaymentStatus,
} from "@/lib/orders";
import {
  buildOrderCardDesign,
  buildOrderCardSlug,
  printFinishLabel,
  SAMPLE_LOGO_SVG,
  type OrderCardDesignData,
} from "@/lib/order-card";
import {
  OrderCardPreview,
  printOrderColorCardPdf,
  printOrderCompleteCardPdf,
  printOrderLogoPdf,
} from "@/components/super-admin/OrderCardPreview";

const PAGE_SIZE = 10;

function sampleCardDesign(
  name: string,
  subtitle: string,
  extraLine: string,
  orderId: string,
  phone: string,
  cardBody: "black" | "white" = "black",
  finish: "gold" | "silver" = "gold",
): OrderCardDesignData {
  const slug = buildOrderCardSlug(name, phone, orderId);
  const liveUrl = `https://hexacards.com/${slug}`;
  return {
    cardBody,
    finish,
    cardColor: cardBody === "black" ? "#141414" : "#FFFFFF",
    accentColor: finish === "gold" ? "#BC7C10" : "#C0C0C0",
    name,
    subtitle,
    extraLine,
    logoSrc: SAMPLE_LOGO_SVG,
    logoLayout: { size: 120, x: 0, y: 0 },
    liveUrl,
  };
}

const sampleOrders: HexaOrder[] = [
  {
    id: "HC-48291037",
    createdAt: "2026-08-14T10:30:00.000Z",
    status: "placed",
    paymentStatus: "paid",
    ownerPhone: "9773970666",
    customerName: "Dinesh Kothari",
    phone: "9773970666",
    email: "dineshkothari280@gmail.com",
    address: "12 MG Road",
    city: "Indore",
    postalCode: "452001",
    country: "India",
    packTitle: "Standard",
    qty: 1,
    subtotal: 999,
    discount: 0,
    total: 999,
    productTitle: "Google Review Card",
    cardSlug: "dinesh-kothari60",
    companyName: "Dinesh Electricals",
    jobTitle: "Business Owner",
    cardDesign: sampleCardDesign(
      "Dinesh Kothari",
      "Founder · CEO · Director",
      "9773970666",
      "HC-48291037",
      "9773970666",
      "black",
      "gold",
    ),
    cardUrl: "https://hexacards.com/dinesh-kothari6637",
  },
  {
    id: "HC-48290521",
    createdAt: "2026-08-14T08:15:00.000Z",
    status: "shipped",
    paymentStatus: "paid",
    ownerPhone: "9422460780",
    customerName: "Prasad Raju Fulari",
    phone: "9422460780",
    email: "fulari.prasad87@gmail.com",
    address: "Shop 4, Market Yard",
    city: "Nashik",
    postalCode: "422005",
    country: "India",
    packTitle: "Premium",
    qty: 2,
    subtotal: 1998,
    discount: 100,
    total: 1898,
    productTitle: "NFC Business Card",
    cardSlug: "prasad-raju-fulari78",
    companyName: "Prasad Enterprises",
    jobTitle: "Director",
    cardDesign: sampleCardDesign(
      "Prasad Raju Fulari",
      "Director · Prasad Enterprises",
      "9422460780",
      "HC-48290521",
      "9422460780",
      "black",
      "gold",
    ),
    cardUrl: "https://hexacards.com/prasad-raju-fulari8021",
  },
  {
    id: "HC-48289104",
    createdAt: "2026-08-13T16:45:00.000Z",
    status: "placed",
    paymentStatus: "pending",
    ownerPhone: "9423242586",
    customerName: "Pawan Bangad",
    phone: "9423242586",
    email: "pawanbangad@rocketmail.com",
    address: "45 Station Road",
    city: "Amravati",
    postalCode: "444601",
    country: "India",
    packTitle: "Standard",
    qty: 1,
    subtotal: 1499,
    discount: 0,
    total: 1499,
    productTitle: "Review Standee",
    cardSlug: "pawan-shyamsunder-bangad15",
    companyName: "Bangad Traders",
    jobTitle: "Proprietor",
    cardDesign: sampleCardDesign(
      "Pawan Bangad",
      "Proprietor · Bangad Traders",
      "9423242586",
      "HC-48289104",
      "9423242586",
      "black",
      "silver",
    ),
    cardUrl: "https://hexacards.com/pawan-bangad8604",
  },
  {
    id: "HC-48287002",
    createdAt: "2026-08-13T11:20:00.000Z",
    status: "delivered",
    paymentStatus: "paid",
    ownerPhone: "6291248682",
    customerName: "Suvankar Purkait",
    phone: "6291248682",
    email: "Suvankarpurkait@gmail.com",
    address: "Flat 302, Green Heights",
    city: "Kolkata",
    postalCode: "700091",
    country: "India",
    packTitle: "Standard",
    qty: 1,
    subtotal: 799,
    discount: 0,
    total: 799,
    productTitle: "Instagram Card",
    cardSlug: "suvankar-purkait71",
    companyName: "Suvankar Digital",
    jobTitle: "Creator",
    cardDesign: sampleCardDesign(
      "Suvankar Purkait",
      "Creator · Suvankar Digital",
      "6291248682",
      "HC-48287002",
      "6291248682",
      "white",
      "gold",
    ),
    cardUrl: "https://hexacards.com/suvankar-purkait8202",
  },
  {
    id: "HC-48285019",
    createdAt: "2026-08-12T09:05:00.000Z",
    status: "placed",
    paymentStatus: "failed",
    ownerPhone: "8273366113",
    customerName: "Anup Panwar",
    phone: "8273366113",
    email: "anuppanwar11@gmail.com",
    address: "H.No. 18, Civil Lines",
    city: "Jaipur",
    postalCode: "302006",
    country: "India",
    packTitle: "Standard",
    qty: 1,
    subtotal: 999,
    discount: 0,
    total: 999,
    productTitle: "Google Review Card",
    cardSlug: "anup-panwar4",
    companyName: "Panwar Services",
    jobTitle: "Consultant",
    cardDesign: sampleCardDesign(
      "Anup Panwar",
      "Consultant · Panwar Services",
      "8273366113",
      "HC-48285019",
      "8273366113",
      "black",
      "gold",
    ),
    cardUrl: "https://hexacards.com/anup-panwar1319",
  },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function paymentBadge(status: HexaPaymentStatus) {
  switch (status) {
    case "paid":
      return "bg-[#e8f5ee] text-[#16a34a]";
    case "pending":
      return "bg-[#fff7ed] text-[#ea580c]";
    case "failed":
      return "bg-[#fef2f2] text-[#dc2626]";
    case "refunded":
      return "bg-[#eef4ff] text-[#2563eb]";
  }
}

function toCsv(rows: HexaOrder[]): string {
  const headers = [
    "ID",
    "Customer Name",
    "Product Name",
    "Amount",
    "Date",
    "Payment Status",
    "Number",
    "Address",
    "Order Status",
  ];
  const lines = rows.map((o) =>
    [
      o.id,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.productTitle.replace(/"/g, '""')}"`,
      o.total,
      formatOrderDate(o.createdAt),
      paymentStatusLabel(o.paymentStatus ?? "paid"),
      o.phone,
      `"${formatOrderAddress(o).replace(/"/g, '""')}"`,
      statusLabel(o.status),
    ].join(","),
  );
  return [headers.join(","), ...lines].join("\n");
}

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function printOrderDetail(order: HexaOrder) {
  const design = buildOrderCardDesign(order);
  const win = window.open("", "_blank");
  if (!win) return;

  win.document.write(`
    <html>
      <head>
        <title>Order ${order.id} — HexaCards</title>
        <style>
          body { font-family: Arial, sans-serif; color: #141414; padding: 24px; }
          h1 { font-size: 22px; margin: 0 0 8px; }
          h2 { font-size: 16px; margin: 28px 0 12px; }
          table { border-collapse: collapse; width: 100%; max-width: 720px; }
          th, td { border: 1px solid #ddd; padding: 8px 10px; text-align: left; font-size: 13px; }
          th { background: #fafafa; width: 34%; }
          .meta { color: #666; font-size: 13px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <h1>Order ${order.id}</h1>
        <p class="meta">${formatOrderDate(order.createdAt)} · ${statusLabel(order.status)} · ${paymentStatusLabel(order.paymentStatus ?? "paid")}</p>

        <h2>Customer &amp; shipping</h2>
        <table>
          <tr><th>Customer name</th><td>${order.customerName}</td></tr>
          <tr><th>Email</th><td>${order.email}</td></tr>
          <tr><th>Mobile</th><td>${order.phone}</td></tr>
          <tr><th>Address</th><td>${formatOrderAddress(order)}</td></tr>
        </table>

        <h2>Order summary</h2>
        <table>
          <tr><th>Product</th><td>${order.productTitle}</td></tr>
          <tr><th>Pack</th><td>${order.packTitle}</td></tr>
          <tr><th>Quantity</th><td>${order.qty}</td></tr>
          <tr><th>Subtotal</th><td>${formatCurrency(order.subtotal)}</td></tr>
          <tr><th>Discount</th><td>${formatCurrency(order.discount)}</td></tr>
          <tr><th>Coupon</th><td>${order.coupon || "—"}</td></tr>
          <tr><th>Total</th><td><strong>${formatCurrency(order.total)}</strong></td></tr>
        </table>

        <h2>Card details</h2>
        <table>
          <tr><th>Name / title</th><td>${design.name}</td></tr>
          <tr><th>Subtitle</th><td>${design.subtitle}</td></tr>
          <tr><th>Extra line</th><td>${design.extraLine || "—"}</td></tr>
          <tr><th>Card type</th><td>${design.cardBody === "black" ? "Black card" : "White card"}</td></tr>
          <tr><th>Finish</th><td>${design.finish === "gold" ? "Gold" : "Silver"}</td></tr>
          <tr><th>Live URL</th><td>${design.liveUrl}</td></tr>
        </table>
      </body>
    </html>
  `);
  win.document.close();
  win.print();
}

function printTable(rows: HexaOrder[]) {
  const win = window.open("", "_blank");
  if (!win) return;
  const rowsHtml = rows
    .map(
      (o) =>
        `<tr><td>${o.id}</td><td>${o.customerName}</td><td>${o.productTitle}</td><td>${formatCurrency(o.total)}</td><td>${formatOrderDate(o.createdAt)}</td><td>${paymentStatusLabel(o.paymentStatus ?? "paid")}</td><td>${o.phone}</td><td>${formatOrderAddress(o)}</td></tr>`,
    )
    .join("");
  win.document.write(`
    <html>
      <head><title>Orders</title></head>
      <body>
        <h2>All Orders</h2>
        <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%">
          <thead><tr><th>ID</th><th>Customer</th><th>Product</th><th>Amount</th><th>Date</th><th>Payment</th><th>Number</th><th>Address</th></tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </body>
    </html>
  `);
  win.document.close();
  win.print();
}

export default function OrdersPanel({
  orders = sampleOrders,
}: {
  orders?: HexaOrder[];
}) {
  const [rows] = useState(orders);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [viewOrder, setViewOrder] = useState<HexaOrder | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = rows;

    if (q) {
      list = list.filter((o) =>
        [
          o.id,
          o.customerName,
          o.productTitle,
          o.phone,
          o.email,
          formatOrderAddress(o),
          paymentStatusLabel(o.paymentStatus ?? "paid"),
        ]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }

    list = [...list].sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sortAsc ? aTime - bTime : bTime - aTime;
    });

    return list;
  }, [rows, search, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const paidCount = rows.filter((o) => (o.paymentStatus ?? "paid") === "paid").length;
  const pendingCount = rows.filter((o) => o.paymentStatus === "pending").length;
  const totalRevenue = rows
    .filter((o) => (o.paymentStatus ?? "paid") === "paid")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-black/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <p className="text-[10px] font-bold tracking-[0.14em] text-[#BC7C10] uppercase">
            Total orders
          </p>
          <p className="font-dashboard mt-1 text-2xl font-bold text-[#141414]">
            {rows.length}
          </p>
        </div>
        <div className="rounded-xl border border-black/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <p className="text-[10px] font-bold tracking-[0.14em] text-[#BC7C10] uppercase">
            Paid
          </p>
          <p className="font-dashboard mt-1 text-2xl font-bold text-[#141414]">
            {paidCount}
          </p>
        </div>
        <div className="rounded-xl border border-black/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <p className="text-[10px] font-bold tracking-[0.14em] text-[#BC7C10] uppercase">
            Pending
          </p>
          <p className="font-dashboard mt-1 text-2xl font-bold text-[#141414]">
            {pendingCount}
          </p>
        </div>
        <div className="rounded-xl border border-black/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <p className="text-[10px] font-bold tracking-[0.14em] text-[#BC7C10] uppercase">
            Revenue
          </p>
          <p className="font-dashboard mt-1 text-2xl font-bold text-[#141414]">
            {formatCurrency(totalRevenue)}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] px-5 py-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => printTable(filtered)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.08] bg-white px-3 py-1.5 text-xs font-semibold text-[#141414] transition-colors hover:bg-black/[0.03]"
            >
              <FileDown className="h-3.5 w-3.5 text-[#BC7C10]" />
              PDF
            </button>
            <button
              type="button"
              onClick={() =>
                downloadFile(
                  toCsv(filtered),
                  "orders.xls",
                  "application/vnd.ms-excel",
                )
              }
              className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.08] bg-white px-3 py-1.5 text-xs font-semibold text-[#141414] transition-colors hover:bg-black/[0.03]"
            >
              <FileDown className="h-3.5 w-3.5 text-[#BC7C10]" />
              Excel
            </button>
            <button
              type="button"
              onClick={() =>
                downloadFile(toCsv(filtered), "orders.csv", "text/csv")
              }
              className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.08] bg-white px-3 py-1.5 text-xs font-semibold text-[#141414] transition-colors hover:bg-black/[0.03]"
            >
              <FileDown className="h-3.5 w-3.5 text-[#BC7C10]" />
              CSV
            </button>
            <button
              type="button"
              onClick={() => printTable(filtered)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.08] bg-white px-3 py-1.5 text-xs font-semibold text-[#141414] transition-colors hover:bg-black/[0.03]"
            >
              <Printer className="h-3.5 w-3.5 text-[#BC7C10]" />
              Print
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#8a8174]" />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search ID, customer, product, mobile…"
              className="w-full rounded-xl border border-black/10 bg-[#FFFCF7] py-2.5 pr-3 pl-9 text-sm text-[#141414] placeholder:text-[#8a8174]/70 focus:border-[#BC7C10] focus:ring-2 focus:ring-[#BC7C10]/20 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-black/[0.04]">
          <table className="w-full min-w-[1480px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-black/[0.06] bg-[#FFFCF7] text-[11px] font-bold tracking-wide text-[#8a8174] uppercase">
                <th className="whitespace-nowrap px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setSortAsc((v) => !v)}
                    className="inline-flex items-center gap-1 hover:text-[#141414]"
                  >
                    ID
                    {sortAsc ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>
                </th>
                <th className="whitespace-nowrap px-4 py-3">Customer name</th>
                <th className="whitespace-nowrap px-4 py-3">Product name</th>
                <th className="whitespace-nowrap px-4 py-3">Amount</th>
                <th className="whitespace-nowrap px-4 py-3">Date</th>
                <th className="whitespace-nowrap px-4 py-3">Payment status</th>
                <th className="whitespace-nowrap px-4 py-3">Number</th>
                <th className="min-w-[240px] px-4 py-3">Address</th>
                <th className="whitespace-nowrap px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((order) => {
                const payment = order.paymentStatus ?? "paid";
                return (
                  <tr
                    key={order.id}
                    className="border-b border-black/[0.04] align-top last:border-0"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-[#141414]">
                      {order.id}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium break-words text-[#141414]">
                        {order.customerName}
                      </p>
                      <p className="mt-0.5 break-all text-xs text-[#8a8174]">
                        {order.email}
                      </p>
                    </td>
                    <td className="px-4 py-3 break-words text-[#5c5346]">
                      {order.productTitle}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold tabular-nums text-[#141414]">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[#5c5346]">
                      {formatOrderDate(order.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${paymentBadge(payment)}`}
                      >
                        {paymentStatusLabel(payment)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums text-[#5c5346]">
                      {order.phone}
                    </td>
                    <td className="px-4 py-3 break-words text-[#5c5346]">
                      {formatOrderAddress(order)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setViewOrder(order)}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#141414] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#BC7C10]"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}

              {pageRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-10 text-center text-sm text-[#8a8174]"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] px-5 py-4 text-sm text-[#5c5346]">
          <p>
            Showing {(safePage - 1) * PAGE_SIZE + 1} to{" "}
            {Math.min(safePage * PAGE_SIZE, filtered.length)} of{" "}
            {filtered.length} entries
          </p>

          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="rounded-lg border border-black/[0.08] px-3 py-1.5 text-xs font-semibold text-[#141414] transition-colors hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i + 1)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  safePage === i + 1
                    ? "bg-[#BC7C10] text-white"
                    : "border border-black/[0.08] text-[#141414] hover:bg-black/[0.03]"
                }`}
              >
                {i + 1}
              </button>
            ))}
            {totalPages > 5 ? (
              <span className="px-2 text-[#8a8174]">…</span>
            ) : null}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="rounded-lg border border-black/[0.08] px-3 py-1.5 text-xs font-semibold text-[#141414] transition-colors hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {viewOrder ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div
            className="absolute inset-0"
            onClick={() => setViewOrder(null)}
            aria-hidden="true"
          />
          <div className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-xl">
            <div className="flex shrink-0 items-center justify-between border-b border-black/[0.06] px-5 py-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.14em] text-[#BC7C10] uppercase">
                  Order details
                </p>
                <h3 className="font-dashboard text-lg font-bold text-[#141414]">
                  {viewOrder.id}
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => printOrderLogoPdf(viewOrder)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-xs font-semibold text-[#141414] transition-colors hover:bg-black/[0.03]"
                >
                  <FileDown className="h-3.5 w-3.5 text-[#BC7C10]" />
                  PDF 1 · Logo
                </button>
                <button
                  type="button"
                  onClick={() => printOrderCompleteCardPdf(viewOrder)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#141414] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#BC7C10]"
                >
                  <FileDown className="h-3.5 w-3.5" />
                  PDF 2 · Complete card
                </button>
                <button
                  type="button"
                  onClick={() => printOrderColorCardPdf(viewOrder)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#BC7C10] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#9a650d]"
                >
                  <FileDown className="h-3.5 w-3.5" />
                  PDF 3 · Color card
                </button>
                <button
                  type="button"
                  onClick={() => printOrderDetail(viewOrder)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-xs font-semibold text-[#141414] transition-colors hover:bg-black/[0.03]"
                >
                  <Printer className="h-3.5 w-3.5 text-[#BC7C10]" />
                  Order summary
                </button>
                <button
                  type="button"
                  onClick={() => setViewOrder(null)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/[0.08] text-[#5c5346] hover:bg-black/[0.03]"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-5 text-sm">
                  <section className="rounded-xl border border-black/[0.06] bg-[#FFFCF7] p-4">
                    <p className="text-[10px] font-bold tracking-[0.14em] text-[#BC7C10] uppercase">
                      Customer information
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <DetailField label="Customer name" value={viewOrder.customerName} />
                      <DetailField label="Mobile" value={viewOrder.phone} />
                      <DetailField label="Email" value={viewOrder.email} />
                      <DetailField
                        label="Address"
                        value={formatOrderAddress(viewOrder)}
                        className="sm:col-span-2"
                      />
                    </div>
                  </section>

                  <section className="rounded-xl border border-black/[0.06] bg-white p-4">
                    <p className="text-[10px] font-bold tracking-[0.14em] text-[#BC7C10] uppercase">
                      Order summary
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <DetailField label="Product name" value={viewOrder.productTitle} />
                      <DetailField label="Pack" value={viewOrder.packTitle} />
                      <DetailField label="Quantity" value={String(viewOrder.qty)} />
                      <DetailField label="Order date" value={formatOrderDate(viewOrder.createdAt)} />
                      <DetailField label="Subtotal" value={formatCurrency(viewOrder.subtotal)} />
                      <DetailField label="Discount" value={formatCurrency(viewOrder.discount)} />
                      <DetailField label="Coupon" value={viewOrder.coupon || "—"} />
                      <DetailField label="Total amount" value={formatCurrency(viewOrder.total)} strong />
                      <div>
                        <p className="text-[10px] font-bold tracking-wide text-[#8a8174] uppercase">
                          Payment status
                        </p>
                        <p className="mt-1">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${paymentBadge(viewOrder.paymentStatus ?? "paid")}`}
                          >
                            {paymentStatusLabel(viewOrder.paymentStatus ?? "paid")}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold tracking-wide text-[#8a8174] uppercase">
                          Order status
                        </p>
                        <p className="mt-1">
                          <span className="rounded-md bg-[#FFF8ED] px-2 py-1 text-xs font-semibold text-[#9a650d]">
                            {statusLabel(viewOrder.status)}
                          </span>
                        </p>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-xl border border-black/[0.06] bg-white p-4">
                    <p className="text-[10px] font-bold tracking-[0.14em] text-[#BC7C10] uppercase">
                      Card design details
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <DetailField
                        label="Name / title"
                        value={buildOrderCardDesign(viewOrder).name}
                      />
                      <DetailField
                        label="Subtitle"
                        value={buildOrderCardDesign(viewOrder).subtitle}
                      />
                      <DetailField
                        label="Extra line"
                        value={buildOrderCardDesign(viewOrder).extraLine || "—"}
                      />
                      <DetailField
                        label="Card type"
                        value={
                          buildOrderCardDesign(viewOrder).cardBody === "black"
                            ? "Black card"
                            : "White card"
                        }
                      />
                      <DetailField
                        label={
                          buildOrderCardDesign(viewOrder).cardBody === "white"
                            ? "Color"
                            : "Finish"
                        }
                        value={printFinishLabel(buildOrderCardDesign(viewOrder))}
                      />
                      <DetailField
                        label="Live URL"
                        value={buildOrderCardDesign(viewOrder).liveUrl}
                        className="sm:col-span-2"
                      />
                    </div>
                  </section>

                  <section className="rounded-xl border border-black/[0.06] bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-[10px] font-bold tracking-[0.14em] text-[#BC7C10] uppercase">
                        Uploaded logo
                      </p>
                      <button
                        type="button"
                        onClick={() => printOrderLogoPdf(viewOrder)}
                        className="text-xs font-semibold text-[#BC7C10] hover:underline"
                      >
                        Download logo PDF
                      </button>
                    </div>
                    <div className="mt-4 flex min-h-[140px] items-center justify-center rounded-xl border border-dashed border-black/[0.08] bg-[#FFFCF7] p-6">
                      {buildOrderCardDesign(viewOrder).logoSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={buildOrderCardDesign(viewOrder).logoSrc}
                          alt="Uploaded logo"
                          className="max-h-32 max-w-full object-contain"
                        />
                      ) : (
                        <p className="text-sm text-[#8a8174]">No logo uploaded</p>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-[#8a8174]">
                      Logo appears on the back side only · PNG with transparent background recommended
                    </p>
                  </section>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.14em] text-[#BC7C10] uppercase">
                        Complete card preview
                      </p>
                      <p className="mt-1 text-xs text-[#8a8174]">
                        Front and back — exactly as the customer designed at checkout.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => printOrderCompleteCardPdf(viewOrder)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#BC7C10] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-[#9a650d]"
                    >
                      <FileDown className="h-3.5 w-3.5" />
                      PDF 2 · Front + Back
                    </button>
                    <button
                      type="button"
                      onClick={() => printOrderColorCardPdf(viewOrder)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#141414] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-[#BC7C10]"
                    >
                      <FileDown className="h-3.5 w-3.5" />
                      PDF 3 · Color
                    </button>
                    </div>
                  </div>
                  <OrderCardPreview order={viewOrder} showBothSides />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DetailField({
  label,
  value,
  strong = false,
  className = "",
}: {
  label: string;
  value: string;
  strong?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-[10px] font-bold tracking-wide text-[#8a8174] uppercase">
        {label}
      </p>
      <p
        className={`mt-1 break-words leading-snug ${strong ? "font-semibold text-[#141414]" : "text-[#5c5346]"}`}
      >
        {value}
      </p>
    </div>
  );
}
