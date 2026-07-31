"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  Check,
  Eye,
  Globe,
  ImagePlus,
  Link2,
  Menu,
  Palette,
  Phone,
  Plus,
  Share2,
  Trash2,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import {
  getAuthUser,
  isLoggedIn,
  loginPathWithNext,
  type HexaAuthUser,
} from "@/lib/auth";
import { hasPlacedOrder } from "@/lib/orders";
import {
  cardPublicSlug,
  cardPublicUrl,
  cardPublicPath,
  clearBrochureFile,
  formatFileSize,
  getCardProfile,
  normalizePhoneForInput,
  saveBrochureFile,
  saveCardProfile,
  BROCHURE_MAX_BYTES,
  type HexaCardProfile,
} from "@/lib/card-profile";
import PhoneNumberField from "./PhoneNumberField";
import ProfileBanner from "./ProfileBanner";
import ImageCropModal, {
  readFileAsDataUrl,
  type CropKind,
} from "./ImageCropModal";

type EditTab = "contact" | "social" | "businessInfo" | "appearance";

const TABS: { key: EditTab; label: string; icon: typeof Phone }[] = [
  { key: "contact", label: "Contact Info", icon: Phone },
  { key: "social", label: "Social Links", icon: Share2 },
  { key: "businessInfo", label: "Business Info", icon: Briefcase },
  { key: "appearance", label: "Appearance", icon: Palette },
];

const ACCENTS = [
  "#BC7C10",
  "#141414",
  "#1565C0",
  "#00B813",
  "#E53935",
  "#C2185B",
];

function fieldClass() {
  return "mt-1.5 w-full rounded-lg border border-black/10 bg-[#FAFAF8] px-3.5 py-2.5 text-sm text-[#141414] outline-none transition-colors placeholder:text-[#9a9a9a] focus:border-[#BC7C10]/50 focus:bg-white focus:ring-2 focus:ring-[#BC7C10]/15";
}

function labelClass() {
  return "text-[11px] font-semibold tracking-wide text-[#8a8174] uppercase";
}

export default function EditCard() {
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<HexaAuthUser | null>(null);
  const [profile, setProfile] = useState<HexaCardProfile | null>(null);
  const [tab, setTab] = useState<EditTab>("contact");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [serviceInput, setServiceInput] = useState("");
  const coverRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const shareRef = useRef<HTMLInputElement>(null);
  const brochureRef = useRef<HTMLInputElement>(null);
  const [brochureError, setBrochureError] = useState("");
  const [cropState, setCropState] = useState<{
    src: string;
    kind: CropKind;
  } | null>(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace(loginPathWithNext("/dashboard/edit-card"));
      return;
    }
    const auth = getAuthUser();
    if (!auth || !hasPlacedOrder(auth.phone)) {
      router.replace("/dashboard");
      return;
    }
    setUser(auth);
    setProfile(getCardProfile(auth.name, auth.phone));
    setAuthReady(true);
  }, [router]);

  function updateContact<K extends keyof HexaCardProfile["contact"]>(
    key: K,
    value: HexaCardProfile["contact"][K],
  ) {
    setProfile((p) =>
      p ? { ...p, contact: { ...p.contact, [key]: value } } : p,
    );
  }

  function updateSocial<K extends keyof HexaCardProfile["social"]>(
    key: K,
    value: HexaCardProfile["social"][K],
  ) {
    setProfile((p) =>
      p ? { ...p, social: { ...p.social, [key]: value } } : p,
    );
  }

  function updateAppearance<K extends keyof HexaCardProfile["appearance"]>(
    key: K,
    value: HexaCardProfile["appearance"][K],
  ) {
    setProfile((p) =>
      p ? { ...p, appearance: { ...p.appearance, [key]: value } } : p,
    );
  }

  function updateBusinessAbout(value: string) {
    setProfile((p) =>
      p ? { ...p, business: { ...p.business, about: value } } : p,
    );
  }

  function addService() {
    const name = serviceInput.trim();
    if (!name || !profile) return;
    if (profile.business.services.some((s) => s.toLowerCase() === name.toLowerCase())) {
      setServiceInput("");
      return;
    }
    setProfile({
      ...profile,
      business: {
        ...profile.business,
        services: [...profile.business.services, name],
      },
    });
    setServiceInput("");
  }

  function removeService(index: number) {
    setProfile((p) =>
      p
        ? {
            ...p,
            business: {
              ...p.business,
              services: p.business.services.filter((_, i) => i !== index),
            },
          }
        : p,
    );
  }

  async function openImageCrop(file: File | undefined, kind: CropKind) {
    if (!file || !file.type.startsWith("image/")) return;
    try {
      const src = await readFileAsDataUrl(file);
      setCropState({ src, kind });
    } catch {
      window.alert("Could not open this image. Please try another file.");
    }
  }

  function applyCroppedImage(dataUrl: string) {
    if (!cropState) return;
    if (cropState.kind === "profile") updateAppearance("logoImage", dataUrl);
    else if (cropState.kind === "background")
      updateAppearance("coverImage", dataUrl);
    else updateAppearance("shareImage", dataUrl);
    setCropState(null);
  }

  async function handleBrochureUpload(file: File | undefined) {
    if (!file || !profile) return;
    setBrochureError("");
    if (file.size > BROCHURE_MAX_BYTES) {
      setBrochureError("Brochure must be 5 MB or smaller.");
      return;
    }
    const allowed = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (file.type && !allowed.includes(file.type) && !file.name.match(/\.(pdf|png|jpe?g|webp|docx?)$/i)) {
      setBrochureError("Use PDF, DOC, DOCX, or image files only.");
      return;
    }
    try {
      await saveBrochureFile(file);
      setProfile({
        ...profile,
        contact: {
          ...profile.contact,
          brochureName: file.name,
          brochureMime: file.type || "application/octet-stream",
          brochureSize: file.size,
        },
      });
    } catch (err) {
      setBrochureError(
        err instanceof Error ? err.message : "Could not save brochure.",
      );
    }
  }

  async function handleBrochureClear() {
    if (!profile) return;
    setBrochureError("");
    await clearBrochureFile();
    setProfile({
      ...profile,
      contact: {
        ...profile.contact,
        brochureName: null,
        brochureMime: null,
        brochureSize: null,
      },
    });
  }

  function handleSave() {
    if (!profile) return;
    try {
      const next = saveCardProfile(profile);
      setProfile(next);
      setSavedFlash(true);
      window.setTimeout(() => setSavedFlash(false), 1800);
    } catch {
      // Last-resort: clear images and save contact/social data
      const stripped = {
        ...profile,
        appearance: {
          ...profile.appearance,
          coverImage: null,
          logoImage: null,
          shareImage: null,
        },
      };
      const next = saveCardProfile(stripped);
      setProfile(next);
      setSavedFlash(true);
      window.setTimeout(() => setSavedFlash(false), 1800);
      window.alert(
        "Images were too large for browser storage. Profile details were saved without images — please re-upload smaller photos.",
      );
    }
  }

  function goNext() {
    if (tab === "contact") setTab("social");
    else if (tab === "social") setTab("businessInfo");
    else if (tab === "businessInfo") setTab("appearance");
    else handleSave();
  }

  if (!authReady || !user || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAF8]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#BC7C10]/25 border-t-[#BC7C10]" />
          <p className="mt-3 text-sm font-medium text-[#5c5346]">
            Loading card editor…
          </p>
        </div>
      </div>
    );
  }

  const slug = cardPublicSlug(profile);

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#141414]">
      <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-3 px-4 sm:h-[60px] sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-black/[0.04] lg:hidden"
              aria-label="Open menu"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5c5346] hover:text-[#141414]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <span className="hidden h-5 w-px bg-black/10 sm:block" />
            <p className="font-dashboard text-sm font-bold tracking-tight sm:text-base">
              Edit card
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={cardPublicPath(profile)}
              target="_blank"
              className="hidden items-center gap-1.5 rounded-lg border border-black/[0.08] px-3 py-2 text-[13px] font-semibold text-[#141414] hover:bg-[#FAFAF8] sm:inline-flex"
            >
              <Eye className="h-3.5 w-3.5" />
              View card
            </Link>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#BC7C10] px-3.5 py-2 text-[13px] font-bold text-white hover:bg-[#9a650d]"
            >
              {savedFlash ? <Check className="h-3.5 w-3.5" /> : null}
              {savedFlash ? "Saved" : "Update"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1440px]">
        {sidebarOpen ? (
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-[#141414]/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}

        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-black/[0.06] bg-[#141414] text-white transition-transform duration-300 lg:sticky lg:top-[60px] lg:z-0 lg:h-[calc(100vh-60px)] lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 lg:hidden">
            <p className="text-sm font-semibold">Card menu</p>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4">
            <p className="mb-2 px-2 text-[10px] font-semibold tracking-[0.16em] text-white/45 uppercase">
              Main navigation
            </p>
            <Link
              href="/dashboard"
              className="mb-4 flex items-center gap-2 rounded-lg px-3 py-2.5 text-[13px] font-medium text-white/70 hover:bg-white/5 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>

            <div className="mb-3 rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
              <p className="truncate text-sm font-semibold text-white">
                {profile.contact.cardName || user.name}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-white/50">
                {[profile.contact.title, profile.contact.businessName]
                  .filter((v) => v.trim())
                  .join(" - ") || "Digital business card"}
              </p>
            </div>

            <p className="mb-1.5 px-2 text-[10px] font-semibold tracking-[0.16em] text-white/45 uppercase">
              Edit sections
            </p>
            <nav className="space-y-0.5">
              {TABS.map((item) => {
                const Icon = item.icon;
                const active = tab === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setTab(item.key);
                      setSidebarOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition-colors ${
                      active
                        ? "bg-[#BC7C10] text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        active ? "bg-white" : "bg-transparent"
                      }`}
                    />
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <section className="overflow-visible rounded-xl border border-black/[0.06] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] sm:p-7">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] pb-4">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-[#BC7C10] uppercase">
                    {tab === "contact"
                      ? "Contact Info"
                      : tab === "social"
                        ? "Social Links"
                        : tab === "businessInfo"
                          ? "Business Info"
                          : "Appearance"}
                  </p>
                  <h1 className="mt-1 font-dashboard text-xl font-extrabold tracking-[-0.02em]">
                    {tab === "contact"
                      ? "Edit card info"
                      : tab === "social"
                        ? "Social & review links"
                        : tab === "businessInfo"
                          ? "Edit card business info"
                          : "Card appearance"}
                  </h1>
                </div>
                <UserRound className="h-5 w-5 text-[#BC7C10]" />
              </div>

              {tab === "contact" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Card name">
                    <input
                      className={fieldClass()}
                      value={profile.contact.cardName}
                      onChange={(e) =>
                        updateContact("cardName", e.target.value)
                      }
                      placeholder="Your name / brand"
                    />
                  </Field>
                  <Field label="Title / job">
                    <input
                      className={fieldClass()}
                      value={profile.contact.title}
                      onChange={(e) => updateContact("title", e.target.value)}
                      placeholder="Founder, Consultant…"
                    />
                  </Field>
                  <Field label="Business name" className="sm:col-span-2">
                    <input
                      className={fieldClass()}
                      value={profile.contact.businessName}
                      onChange={(e) =>
                        updateContact("businessName", e.target.value)
                      }
                      placeholder="Shown on card as Title - Business name"
                    />
                  </Field>

                  <div className="relative z-30 grid gap-4 sm:col-span-2 sm:grid-cols-2">
                    <PhoneNumberField
                      label="Mobile number"
                      value={normalizePhoneForInput(
                        profile.contact.mobile,
                        profile.contact.countryCode,
                      )}
                      defaultCountry={profile.contact.countryCode || "IN"}
                      placeholder="Mobile number"
                      onChange={(value) => updateContact("mobile", value)}
                      onCountryChange={(country) =>
                        updateContact("countryCode", country)
                      }
                    />
                    <PhoneNumberField
                      label="WhatsApp number"
                      value={normalizePhoneForInput(
                        profile.contact.whatsapp,
                        profile.contact.countryCode,
                      )}
                      defaultCountry={profile.contact.countryCode || "IN"}
                      placeholder="WhatsApp number"
                      onChange={(value) => updateContact("whatsapp", value)}
                    />
                  </div>

                  <Field label="Email address">
                    <input
                      type="email"
                      className={fieldClass()}
                      value={profile.contact.email}
                      onChange={(e) => updateContact("email", e.target.value)}
                      placeholder="you@company.com"
                    />
                  </Field>
                  <Field label="Website">
                    <input
                      className={fieldClass()}
                      value={profile.contact.website}
                      onChange={(e) => updateContact("website", e.target.value)}
                      placeholder="https://"
                    />
                  </Field>

                  <Field label="State">
                    <input
                      className={fieldClass()}
                      value={profile.contact.state}
                      onChange={(e) => updateContact("state", e.target.value)}
                      placeholder="State"
                    />
                  </Field>
                  <Field label="City">
                    <input
                      className={fieldClass()}
                      value={profile.contact.city}
                      onChange={(e) => updateContact("city", e.target.value)}
                      placeholder="City"
                    />
                  </Field>
                  <Field label="Address" className="sm:col-span-2">
                    <textarea
                      rows={3}
                      className={fieldClass()}
                      value={profile.contact.address}
                      onChange={(e) => updateContact("address", e.target.value)}
                      placeholder="Full address"
                    />
                  </Field>

                  <div className="sm:col-span-2">
                    <p className={labelClass()}>E-Brochure</p>
                    <div className="mt-1.5 rounded-xl border border-dashed border-black/15 bg-[#FAFAF8] p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-[#141414]">
                            {profile.contact.brochureName ||
                              "Upload company brochure"}
                          </p>
                          <p className="mt-0.5 text-[11px] text-[#8a8174]">
                            PDF, DOC, or image · Max 5 MB
                            {profile.contact.brochureSize
                              ? ` · ${formatFileSize(profile.contact.brochureSize)} used`
                              : ""}
                          </p>
                          {brochureError ? (
                            <p className="mt-1.5 text-[11px] font-medium text-[#E24C4C]">
                              {brochureError}
                            </p>
                          ) : null}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => brochureRef.current?.click()}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 py-2 text-[12px] font-semibold text-[#141414] hover:bg-white"
                          >
                            <Upload className="h-3.5 w-3.5" />
                            {profile.contact.brochureName ? "Replace" : "Upload"}
                          </button>
                          {profile.contact.brochureName ? (
                            <button
                              type="button"
                              onClick={() => void handleBrochureClear()}
                              className="rounded-lg px-3 py-2 text-[12px] font-semibold text-[#E24C4C] hover:bg-[#FFF5F5]"
                            >
                              Remove
                            </button>
                          ) : null}
                        </div>
                      </div>
                      <input
                        ref={brochureRef}
                        type="file"
                        accept=".pdf,.doc,.docx,image/*,application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          void handleBrochureUpload(e.target.files?.[0]);
                          e.target.value = "";
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {tab === "social" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {(
                    [
                      ["instagram", "Instagram"],
                      ["facebook", "Facebook"],
                      ["linkedin", "LinkedIn"],
                      ["twitter", "X / Twitter"],
                      ["youtube", "YouTube"],
                      ["googleReview", "Google Review link"],
                    ] as const
                  ).map(([key, label]) => (
                    <Field
                      key={key}
                      label={label}
                      className={
                        key === "googleReview" ? "sm:col-span-2" : undefined
                      }
                    >
                      <div className="relative">
                        <Link2 className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#9a9a9a]" />
                        <input
                          className={`${fieldClass()} pl-9`}
                          value={profile.social[key]}
                          onChange={(e) => updateSocial(key, e.target.value)}
                          placeholder="https://"
                        />
                      </div>
                    </Field>
                  ))}
                </div>
              ) : null}

              {tab === "businessInfo" ? (
                <div className="space-y-5">
                  <Field label="About business">
                    <textarea
                      rows={5}
                      className={fieldClass()}
                      value={profile.business.about}
                      onChange={(e) => updateBusinessAbout(e.target.value)}
                      placeholder="Save your contact by just tapping HexaCards digital business card. Describe your company here…"
                    />
                  </Field>

                  <div>
                    <p className={labelClass()}>Service / product name</p>
                    <div className="mt-1.5 flex gap-2">
                      <input
                        className={`${fieldClass()} mt-0 flex-1`}
                        value={serviceInput}
                        onChange={(e) => setServiceInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addService();
                          }
                        }}
                        placeholder="Enter Service / Product Name"
                      />
                      <button
                        type="button"
                        onClick={addService}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#141414] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#2a2a2a]"
                      >
                        <Plus className="h-4 w-4" />
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-black/[0.08]">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[#FAFAF8] text-[11px] font-semibold tracking-wide text-[#8a8174] uppercase">
                        <tr>
                          <th className="px-4 py-3">Sr. No</th>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3 text-right">Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profile.business.services.length === 0 ? (
                          <tr>
                            <td
                              colSpan={3}
                              className="px-4 py-8 text-center text-xs text-[#8a8174]"
                            >
                              No services added yet. Add one above to show it in
                              Business Information.
                            </td>
                          </tr>
                        ) : (
                          profile.business.services.map((service, index) => (
                            <tr
                              key={`${service}-${index}`}
                              className="border-t border-black/[0.06]"
                            >
                              <td className="px-4 py-3 tabular-nums text-[#5c5346]">
                                {index + 1}
                              </td>
                              <td className="px-4 py-3 font-medium text-[#141414]">
                                {service}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => removeService(index)}
                                  aria-label={`Delete ${service}`}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#E24C4C] hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}

              {tab === "appearance" ? (
                <div className="space-y-6">
                  <p className="text-sm text-[#6b6560]">
                    Upload images used on your digital card and when sharing the
                    card profile link.
                  </p>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <ImageUpload
                      label="Cover image"
                      hint="Square or banner crop"
                      value={profile.appearance.coverImage}
                      inputRef={coverRef}
                      onPick={() => coverRef.current?.click()}
                      onChange={(file) => void openImageCrop(file, "background")}
                      onClear={() => updateAppearance("coverImage", null)}
                    />
                    <ImageUpload
                      label="Logo / profile"
                      hint="Square crop · 512×512"
                      value={profile.appearance.logoImage}
                      inputRef={logoRef}
                      onPick={() => logoRef.current?.click()}
                      onChange={(file) => void openImageCrop(file, "profile")}
                      onClear={() => updateAppearance("logoImage", null)}
                    />
                    {/* <ImageUpload
                      label="Share image"
                      hint="Square crop · 1080×1080"
                      value={profile.appearance.shareImage}
                      inputRef={shareRef}
                      onPick={() => shareRef.current?.click()}
                      onChange={(file) => void openImageCrop(file, "share")}
                      onClear={() => updateAppearance("shareImage", null)}
                    /> */}
                  </div>

                  <div>
                    <p className={labelClass()}>Accent color</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {ACCENTS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => updateAppearance("accentColor", color)}
                          className={`h-9 w-9 rounded-full ring-2 ring-offset-2 ${
                            profile.appearance.accentColor === color
                              ? "ring-[#141414]"
                              : "ring-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                          aria-label={`Accent ${color}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className={labelClass()}>Theme</p>
                    <div className="mt-2 flex gap-2">
                      {(["dark", "light"] as const).map((theme) => (
                        <button
                          key={theme}
                          type="button"
                          onClick={() => updateAppearance("theme", theme)}
                          className={`rounded-lg px-4 py-2 text-[13px] font-semibold capitalize ${
                            profile.appearance.theme === theme
                              ? "bg-[#141414] text-white"
                              : "border border-black/10 bg-white text-[#141414] hover:bg-[#FAFAF8]"
                          }`}
                        >
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="mt-8 flex flex-wrap gap-2 border-t border-black/[0.06] pt-5">
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#BC7C10] px-4 py-2.5 text-[13px] font-bold text-white hover:bg-[#9a650d]"
                >
                  <Check className="h-4 w-4" />
                  Update
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#141414] px-4 py-2.5 text-[13px] font-bold text-white hover:bg-[#2a2a2a]"
                >
                  {tab === "appearance" ? "Save & finish" : "Next"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </section>

            <aside className="space-y-4 xl:sticky xl:top-[76px] xl:self-start">
              <div className="rounded-xl border border-black/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                <p className="text-[11px] font-semibold tracking-[0.14em] text-[#8a8174] uppercase">
                  Your card URL
                </p>
                <p className="mt-2 break-all font-mono text-xs text-[#141414]">
                  {cardPublicUrl(profile)}
                </p>
                <Link
                  href={cardPublicPath(profile)}
                  target="_blank"
                  className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#BC7C10] px-3 py-2.5 text-[13px] font-bold text-white hover:bg-[#9a650d]"
                >
                  <Globe className="h-3.5 w-3.5" />
                  Open full card page
                </Link>
              </div>

              <div>
                <p className="mb-3 text-[11px] font-semibold tracking-[0.14em] text-[#8a8174] uppercase">
                  Share card preview
                </p>
                <div className="mx-auto w-full max-w-[320px]">
                  <ProfileBanner
                    profile={profile}
                    userName={user.name}
                    slug={slug}
                    compact
                    onUploadProfile={(file) =>
                      void openImageCrop(file, "profile")
                    }
                    onUploadBackground={(file) =>
                      void openImageCrop(file, "background")
                    }
                  />
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>

      {cropState ? (
        <ImageCropModal
          imageSrc={cropState.src}
          kind={cropState.kind}
          onCancel={() => setCropState(null)}
          onComplete={applyCroppedImage}
        />
      ) : null}
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className={labelClass()}>{label}</span>
      {children}
    </label>
  );
}

function ImageUpload({
  label,
  hint,
  value,
  inputRef,
  onPick,
  onChange,
  onClear,
}: {
  label: string;
  hint: string;
  value: string | null;
  inputRef: RefObject<HTMLInputElement | null>;
  onPick: () => void;
  onChange: (file: File | undefined) => void;
  onClear: () => void;
}) {
  return (
    <div className="rounded-xl border border-black/[0.06] bg-[#FAFAF8] p-3">
      <p className="text-[11px] font-semibold tracking-wide text-[#8a8174] uppercase">
        {label}
      </p>
      <p className="mt-0.5 text-[11px] text-[#9a9a9a]">{hint}</p>
      <button
        type="button"
        onClick={onPick}
        className="relative mt-3 flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-black/15 bg-white"
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="flex flex-col items-center gap-1 text-[#8a8174]">
            <ImagePlus className="h-5 w-5" />
            <span className="text-[11px] font-semibold">Upload</span>
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          onChange(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={onPick}
          className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-black/10 bg-white py-1.5 text-[11px] font-semibold"
        >
          <Upload className="h-3 w-3" />
          Choose
        </button>
        {value ? (
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg px-2 py-1.5 text-[11px] font-semibold text-[#E24C4C]"
          >
            Remove
          </button>
        ) : null}
      </div>
    </div>
  );
}
