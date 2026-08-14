"use client";

import { useMemo, useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Trash2,
  ExternalLink,
  FileDown,
  Printer,
  Pencil,
  CreditCard,
  CheckCircle2,
  CalendarClock,
  ScrollText,
  Eye,
  X,
} from "lucide-react";
import CardLogsPanel, { sampleCardLogs } from "@/components/super-admin/Cardslogs";

export type AdminCardRow = {
  id: string;
  srNo: number;
  name: string;
  liveUrl: string;
  email: string;
  mobile: string;
  startDate: string;
  expiryDate: string;
  pageViews: number;
  editHref: string;
  active: boolean;
};

type CardsView = "all" | "active" | "expiry" | "logs";

const CARD_VIEWS: {
  key: CardsView;
  label: string;
  icon: typeof CreditCard;
  description: string;
}[] = [
  {
    key: "all",
    label: "View cards",
    icon: CreditCard,
    description: "All digital business cards on the platform.",
  },
  {
    key: "active",
    label: "Active cards",
    icon: CheckCircle2,
    description: "Cards that are live and not expired.",
  },
  {
    key: "expiry",
    label: "Expiry cards",
    icon: CalendarClock,
    description: "Expired or expiring within the next 30 days.",
  },
  {
    key: "logs",
    label: "View logs",
    icon: ScrollText,
    description: "Recent card activity and admin actions.",
  },
];

const PAGE_SIZE = 10;
const EXPIRY_SOON_DAYS = 30;

const sampleCards: AdminCardRow[] = [
  {
    id: "10650",
    srNo: 5164,
    name: "syed-huzaf",
    liveUrl: "https://hexacards.com/syed-huzaf",
    email: "syedsonselectricals@gmail.com",
    mobile: "7981861944",
    startDate: "14-Aug-2026",
    expiryDate: "14-Aug-2046",
    pageViews: 0,
    editHref: "https://hexacards.com/admin/card/edit/10650",
    active: true,
  },
  {
    id: "10649",
    srNo: 5163,
    name: "Dinesh-kothari60",
    liveUrl: "https://hexacards.com/Dinesh-kothari60",
    email: "dineshkothari280@gmail.com",
    mobile: "9773970666",
    startDate: "14-Aug-2026",
    expiryDate: "14-Aug-2056",
    pageViews: 1,
    editHref: "https://hexacards.com/admin/card/edit/10649",
    active: true,
  },
  {
    id: "10648",
    srNo: 5162,
    name: "Prasad-RajuFulari78",
    liveUrl: "https://hexacards.com/Prasad-RajuFulari78",
    email: "fulari.prasad87@gmail.com",
    mobile: "9422460780",
    startDate: "14-Aug-2026",
    expiryDate: "14-Aug-2056",
    pageViews: 0,
    editHref: "https://hexacards.com/admin/card/edit/10648",
    active: true,
  },
  {
    id: "10647",
    srNo: 5161,
    name: "Pawan-ShyamsunderBangad15",
    liveUrl: "https://hexacards.com/Pawan-ShyamsunderBangad15",
    email: "pawanbangad@rocketmail.com",
    mobile: "9423242586",
    startDate: "14-Aug-2026",
    expiryDate: "14-Aug-2056",
    pageViews: 3,
    editHref: "https://hexacards.com/admin/card/edit/10647",
    active: true,
  },
  {
    id: "10646",
    srNo: 5160,
    name: "SUVANKAR-PURKAIT71",
    liveUrl: "https://hexacards.com/SUVANKAR-PURKAIT71",
    email: "Suvankarpurkait@gmail.com",
    mobile: "6291248682",
    startDate: "14-Aug-2026",
    expiryDate: "14-Aug-2056",
    pageViews: 0,
    editHref: "https://hexacards.com/admin/card/edit/10646",
    active: false,
  },
  {
    id: "10645",
    srNo: 5159,
    name: "Anup-Panwar4",
    liveUrl: "https://hexacards.com/Anup-Panwar4",
    email: "anuppanwar11@gmail.com",
    mobile: "8273366113",
    startDate: "14-Aug-2026",
    expiryDate: "20-Aug-2026",
    pageViews: 0,
    editHref: "https://hexacards.com/admin/card/edit/10645",
    active: true,
  },
  {
    id: "10644",
    srNo: 5158,
    name: "Gurpreet-SinghUppal25",
    liveUrl: "https://hexacards.com/Gurpreet-SinghUppal25",
    email: "uppalgs@7parallels.com",
    mobile: "9867763550",
    startDate: "14-Aug-2026",
    expiryDate: "10-Aug-2026",
    pageViews: 0,
    editHref: "https://hexacards.com/admin/card/edit/10644",
    active: true,
  },
  {
    id: "10643",
    srNo: 5157,
    name: "AMIT-MOONDAL35",
    liveUrl: "https://hexacards.com/AMIT-MOONDAL35",
    email: "amitmondal091@gmail.com",
    mobile: "9088049091",
    startDate: "14-Aug-2026",
    expiryDate: "14-Aug-2056",
    pageViews: 4,
    editHref: "https://hexacards.com/admin/card/edit/10643",
    active: true,
  },
  {
    id: "10642",
    srNo: 5156,
    name: "Neeraj-kumar22",
    liveUrl: "https://hexacards.com/Neeraj-kumar22",
    email: "aceinterior.ranchi.design@gmail.com",
    mobile: "8770381857",
    startDate: "13-Aug-2026",
    expiryDate: "13-Aug-2056",
    pageViews: 0,
    editHref: "https://hexacards.com/admin/card/edit/10642",
    active: true,
  },
  {
    id: "10641",
    srNo: 5155,
    name: "Niikhil-Bhatia14",
    liveUrl: "https://hexacards.com/Niikhil-Bhatia14",
    email: "nikhilbhatiadhar@gmail.com",
    mobile: "9009563470",
    startDate: "13-Aug-2026",
    expiryDate: "01-Aug-2026",
    pageViews: 0,
    editHref: "https://hexacards.com/admin/card/edit/10641",
    active: false,
  },
];

function parseCardDate(value: string): Date | null {
  const parsed = new Date(value.replace(/-/g, " "));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isCardExpired(card: AdminCardRow, today = new Date()): boolean {
  const expiry = parseCardDate(card.expiryDate);
  if (!expiry) return false;
  const end = new Date(expiry);
  end.setHours(23, 59, 59, 999);
  return end.getTime() < today.getTime();
}

function isCardExpiringSoon(card: AdminCardRow, today = new Date()): boolean {
  const expiry = parseCardDate(card.expiryDate);
  if (!expiry) return false;
  const end = new Date(expiry);
  end.setHours(23, 59, 59, 999);
  const soon = new Date(today);
  soon.setDate(soon.getDate() + EXPIRY_SOON_DAYS);
  return end.getTime() >= today.getTime() && end.getTime() <= soon.getTime();
}

function expiryStatus(card: AdminCardRow): "expired" | "expiring" | "valid" {
  if (isCardExpired(card)) return "expired";
  if (isCardExpiringSoon(card)) return "expiring";
  return "valid";
}

function isCardActive(card: AdminCardRow): boolean {
  return card.active && !isCardExpired(card);
}

function toCsv(rows: AdminCardRow[]): string {
  const headers = [
    "Sr. No.",
    "Name",
    "Live URL",
    "Email",
    "Mobile",
    "Start",
    "Expiry",
    "Page Views",
    "Status",
  ];
  const lines = rows.map((r) =>
    [
      r.srNo,
      `"${r.name.replace(/"/g, '""')}"`,
      r.liveUrl,
      r.email,
      r.mobile,
      r.startDate,
      r.expiryDate,
      r.pageViews,
      isCardActive(r) ? "Active" : "Inactive",
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

function printTable(rows: AdminCardRow[], title: string) {
  const win = window.open("", "_blank");
  if (!win) return;
  const rowsHtml = rows
    .map(
      (r) =>
        `<tr><td>${r.srNo}</td><td>${r.name}</td><td>${r.email}</td><td>${r.mobile}</td><td>${r.startDate}</td><td>${r.expiryDate}</td><td>${r.pageViews}</td><td>${isCardActive(r) ? "Active" : "Inactive"}</td></tr>`,
    )
    .join("");
  win.document.write(`
    <html>
      <head><title>${title}</title></head>
      <body>
        <h2>${title}</h2>
        <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%">
          <thead><tr><th>Sr. No.</th><th>Name</th><th>Email</th><th>Mobile</th><th>Start</th><th>Expiry</th><th>Views</th><th>Status</th></tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </body>
    </html>
  `);
  win.document.close();
  win.print();
}

export default function CardsPanel({
  cards = sampleCards,
  onDeleteCard,
  onToggleStatus,
}: {
  cards?: AdminCardRow[];
  onDeleteCard?: (id: string) => void;
  onToggleStatus?: (id: string, active: boolean) => void;
}) {
  const [rows, setRows] = useState(cards);
  const [view, setView] = useState<CardsView>("all");
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<AdminCardRow | null>(null);

  const counts = useMemo(() => {
    const active = rows.filter(isCardActive).length;
    const expiry = rows.filter(
      (c) => isCardExpired(c) || isCardExpiringSoon(c),
    ).length;
    return {
      all: rows.length,
      active,
      expiry,
      logs: sampleCardLogs.length,
    };
  }, [rows]);

  const viewFiltered = useMemo(() => {
    if (view === "active") return rows.filter(isCardActive);
    if (view === "expiry") {
      return rows.filter((c) => isCardExpired(c) || isCardExpiringSoon(c));
    }
    return rows;
  }, [rows, view]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = viewFiltered;

    if (q) {
      list = list.filter((c) =>
        [c.name, c.email, c.mobile].join(" ").toLowerCase().includes(q),
      );
    }

    list = [...list].sort((a, b) =>
      sortAsc ? a.srNo - b.srNo : b.srNo - a.srNo,
    );

    return list;
  }, [viewFiltered, search, sortAsc]);

  const isLogsView = view === "logs";
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const totalViews = rows.reduce((sum, c) => sum + c.pageViews, 0);
  const currentViewMeta = CARD_VIEWS.find((item) => item.key === view)!;

  function switchView(next: CardsView) {
    setView(next);
    setSearch("");
    setPage(1);
    setDeleteTarget(null);
  }

  function handleDelete(id: string) {
    setRows((prev) => prev.filter((c) => c.id !== id));
    setDeleteTarget(null);
    onDeleteCard?.(id);
  }

  function handleToggle(id: string, next: boolean) {
    setRows((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: next } : c)),
    );
    onToggleStatus?.(id, next);
  }

  function handleExportCsv() {
    downloadFile(toCsv(filtered), "cards.csv", "text/csv");
  }

  function handlePrint() {
    printTable(filtered, currentViewMeta.label);
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {CARD_VIEWS.map((item) => {
          const Icon = item.icon;
          const selected = view === item.key;
          const count =
            item.key === "logs"
              ? counts.logs
              : counts[item.key as keyof typeof counts];

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => switchView(item.key)}
              className={`rounded-xl border p-4 text-left shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all ${
                selected
                  ? "border-[#BC7C10] bg-[#FFFCF7] ring-2 ring-[#BC7C10]/15"
                  : "border-black/[0.06] bg-white hover:border-[#BC7C10]/30 hover:bg-[#FFFCF7]/60"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    selected ? "bg-[#BC7C10] text-white" : "bg-[#141414] text-white"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                    selected
                      ? "bg-[#BC7C10] text-white"
                      : "bg-[#fdf1e6] text-[#BC7C10]"
                  }`}
                >
                  {count}
                </span>
              </div>
              <p className="mt-4 text-sm font-bold text-[#141414]">{item.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-[#8a8174]">
                {item.description}
              </p>
            </button>
          );
        })}
      </div>

      {!isLogsView ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-black/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <p className="text-[10px] font-bold tracking-[0.14em] text-[#BC7C10] uppercase">
              Showing
            </p>
            <p className="font-dashboard mt-1 text-2xl font-bold text-[#141414]">
              {filtered.length}
            </p>
          </div>
          <div className="rounded-xl border border-black/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <p className="text-[10px] font-bold tracking-[0.14em] text-[#BC7C10] uppercase">
              Active in list
            </p>
            <p className="font-dashboard mt-1 text-2xl font-bold text-[#141414]">
              {filtered.filter(isCardActive).length}
            </p>
          </div>
          <div className="rounded-xl border border-black/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <p className="text-[10px] font-bold tracking-[0.14em] text-[#BC7C10] uppercase">
              Total page views
            </p>
            <p className="font-dashboard mt-1 text-2xl font-bold text-[#141414]">
              {totalViews}
            </p>
          </div>
        </div>
      ) : null}

      <div className="rounded-xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="border-b border-black/[0.06] px-5 py-4">
          <div className="flex flex-wrap items-center gap-2">
            {CARD_VIEWS.map((item) => {
              const selected = view === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => switchView(item.key)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                    selected
                      ? "bg-[#141414] text-white"
                      : "bg-[#F3F4F6] text-[#5c5346] hover:bg-black/[0.06]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-sm text-[#8a8174]">{currentViewMeta.description}</p>
        </div>

        {isLogsView ? (
          <CardLogsPanel />
        ) : (
          <>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] px-5 py-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.08] bg-white px-3 py-1.5 text-xs font-semibold text-[#141414] transition-colors hover:bg-black/[0.03]"
            >
              <FileDown className="h-3.5 w-3.5 text-[#BC7C10]" />
              PDF
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.08] bg-white px-3 py-1.5 text-xs font-semibold text-[#141414] transition-colors hover:bg-black/[0.03]"
            >
              <FileDown className="h-3.5 w-3.5 text-[#BC7C10]" />
              Excel / CSV
            </button>
            <button
              type="button"
              onClick={handlePrint}
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
              placeholder="Search name, email, mobile…"
              className="w-full rounded-xl border border-black/10 bg-[#FFFCF7] py-2.5 pr-3 pl-9 text-sm text-[#141414] placeholder:text-[#8a8174]/70 focus:border-[#BC7C10] focus:ring-2 focus:ring-[#BC7C10]/20 focus:outline-none"
            />
          </div>
        </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1280px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-black/[0.06] text-[11px] font-bold tracking-wide text-[#8a8174] uppercase">
                  <th className="w-[72px] px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setSortAsc((v) => !v)}
                      className="inline-flex items-center gap-1 hover:text-[#141414]"
                    >
                      No.
                      {sortAsc ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </th>
                  <th className="min-w-[160px] px-4 py-3">Name</th>
                  <th className="min-w-[200px] px-4 py-3">Email</th>
                  <th className="min-w-[110px] px-4 py-3">Mobile</th>
                  <th className="min-w-[100px] px-4 py-3">Start</th>
                  <th className="min-w-[120px] px-4 py-3">Expiry</th>
                  <th className="w-[80px] px-4 py-3">Views</th>
                  <th className="w-[88px] px-4 py-3">Edit</th>
                  <th className="w-[80px] px-4 py-3">Status</th>
                  <th className="w-[72px] px-4 py-3 text-right">Delete</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((card) => {
                  const status = expiryStatus(card);
                  return (
                    <tr
                      key={card.id}
                      className="border-b border-black/[0.04] align-top last:border-0"
                    >
                      <td className="px-4 py-4 font-semibold tabular-nums text-[#8a8174]">
                        {card.srNo}
                      </td>
                      <td className="px-4 py-4">
                        <a
                          href={card.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="group inline-flex max-w-full items-start gap-1.5 font-medium text-[#141414] transition-colors hover:text-[#BC7C10]"
                        >
                          <span className="break-words leading-snug">
                            {card.name}
                          </span>
                          <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-[#8a8174] group-hover:text-[#BC7C10]" />
                        </a>
                      </td>
                      <td className="px-4 py-4">
                        <span className="block break-all leading-snug text-[#5c5346]">
                          {card.email}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap tabular-nums text-[#5c5346]">
                        {card.mobile}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-[#5c5346]">
                        {card.startDate}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1.5">
                          <span className="whitespace-nowrap text-[#5c5346]">
                            {card.expiryDate}
                          </span>
                          {status === "expired" ? (
                            <span className="inline-flex w-fit rounded-full bg-[#fef2f2] px-2 py-0.5 text-[10px] font-bold text-[#dc2626]">
                              Expired
                            </span>
                          ) : status === "expiring" ? (
                            <span className="inline-flex w-fit rounded-full bg-[#fff7ed] px-2 py-0.5 text-[10px] font-bold text-[#ea580c]">
                              Expiring soon
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex min-w-[2rem] items-center justify-center gap-1 rounded-full bg-[#fdf1e6] px-2.5 py-1 text-xs font-bold text-[#BC7C10]">
                          <Eye className="h-3 w-3" />
                          {card.pageViews}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <a
                          href={card.editHref}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg bg-[#141414] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#BC7C10]"
                        >
                          <Pencil className="h-3 w-3" />
                          Edit
                        </a>
                      </td>
                      <td className="px-4 py-4">
                        <label className="relative inline-flex h-6 w-11 cursor-pointer items-center">
                          <input
                            type="checkbox"
                            checked={card.active}
                            onChange={(e) =>
                              handleToggle(card.id, e.target.checked)
                            }
                            className="peer sr-only"
                            aria-label={`Toggle status for ${card.name}`}
                          />
                          <span
                            className="absolute inset-0 rounded-full bg-black/15 transition-colors peer-checked:bg-[#16a34a]"
                            aria-hidden
                          />
                          <span
                            className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5"
                            aria-hidden
                          />
                        </label>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(card)}
                          aria-label={`Delete ${card.name}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#E24C4C]/25 bg-white text-[#E24C4C] transition-colors hover:bg-[#E24C4C]/5"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {pageRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-10 text-center text-sm text-[#8a8174]"
                    >
                      {view === "active"
                        ? "No active cards found."
                        : view === "expiry"
                          ? "No expired or expiring cards found."
                          : "No cards found."}
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
          </>
        )}
      </div>

      {deleteTarget ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div
            className="absolute inset-0"
            onClick={() => setDeleteTarget(null)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-card-title"
            className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-xl"
          >
            <div className="border-b border-black/[0.06] px-5 py-4">
              <p className="text-[10px] font-bold tracking-[0.14em] text-[#E24C4C] uppercase">
                Delete card
              </p>
              <h3
                id="delete-card-title"
                className="font-dashboard mt-1 text-lg font-bold text-[#141414]"
              >
                Are you sure?
              </h3>
            </div>
            <div className="space-y-3 px-5 py-4 text-sm leading-relaxed text-[#5c5346]">
              <p>
                Do you want to delete{" "}
                <span className="font-semibold text-[#141414]">
                  {deleteTarget.name}
                </span>
                ?
              </p>
              <p className="text-xs text-[#8a8174]">
                This will permanently remove the card and cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-black/[0.06] px-5 py-4">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-black/[0.08] px-4 py-2.5 text-sm font-semibold text-[#141414] transition-colors hover:bg-black/[0.03]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteTarget.id)}
                className="rounded-xl bg-[#E24C4C] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#c93d3d]"
              >
                Delete card
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
