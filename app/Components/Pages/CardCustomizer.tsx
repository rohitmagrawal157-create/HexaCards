"use client";

import { useEffect, useRef, useState, type ComponentType, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MessageCircle,
  Upload,
  Wifi,
  QrCode,
  Check,
  ImageIcon,
  Palette,
  Type,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import {
  CARD_MODES,
  getMetalPreset,
  type CardMode,
} from "./cardFinishes";

type Side = "front" | "back";

type LogoLayout = {
  size: number;
  x: number;
  y: number;
};

/** Customize mode: card body black/white · accent pickers for wifi & QR */
const cardColors = [
  "#141414",
  "#FFFFFF",
];

const accentColors = [
  "#C9982C", // gold mid
  "#9CA0A4", // silver mid
  "#FFFFFF",
  "#141414",
  "#00BFFF",
  "#00B813",
  "#FF8E00",
  "#EE0000",
  "#FD0095",
];

const CARD_W = 244;
const CARD_H = 154;
/** Screen preview is scaled up from the real 244×154 design canvas */
const PREVIEW_MAX_W = 488; // 2× for comfortable editing

const FRONT_LOGO_DEFAULT: LogoLayout = { size: 40, x: 6, y: 8 };
const BACK_LOGO_DEFAULT: LogoLayout = { size: 72, x: 50, y: 48 };

const SIZE_MIN = 16;
const SIZE_MAX = 120;
const SIZE_STEP = 4;
const MOVE_STEP = 2;

function metalTextStyle(gradient: string): CSSProperties {
  return {
    backgroundImage: gradient,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    WebkitTextFillColor: "transparent",
  };
}

function readableTextColor(hex: string) {
  const cleaned = hex.replace("#", "");
  const full =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 150 ? "#141414" : "#FFFFFF";
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function SectionLabel({
  icon: Icon,
  title,
  hint,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  hint?: string;
}) {
  return (
    <div className="mb-3 flex items-start justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFFCF7] text-[#BC7C10] ring-1 ring-[#BC7C10]/15">
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>
        <div>
          <p className="text-sm font-semibold text-[#141414]">{title}</p>
          {hint ? (
            <p className="text-xs text-[#5c5346]/80">{hint}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ColorSwatch({
  color,
  selected,
  onSelect,
  label,
}: {
  color: string;
  selected: boolean;
  onSelect: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={selected}
      onClick={onSelect}
      className={`relative h-10 w-10 rounded-full border transition-all duration-200 hover:scale-110 ${
        selected
          ? "ring-2 ring-[#BC7C10] ring-offset-2 ring-offset-[#FFFCF7]"
          : "border-black/10 hover:border-black/25"
      }`}
      style={{ backgroundColor: color }}
    >
      {selected ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <Check
            className="h-4 w-4 drop-shadow"
            style={{ color: readableTextColor(color) }}
            strokeWidth={3}
          />
        </span>
      ) : null}
    </button>
  );
}

function ToolBtn({
  label,
  onClick,
  children,
  active,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`flex h-10 w-10 items-center justify-center rounded-full border bg-white text-[#141414] transition-all duration-150 hover:scale-105 active:scale-95 ${
        active
          ? "border-[#BC7C10] shadow-sm shadow-[#BC7C10]/20"
          : "border-black/15 hover:border-black/30"
      }`}
    >
      {children}
    </button>
  );
}

/** Matches reference: trash · − · + · ← → ↓ ↑ · ✓ */
function LogoToolbar({
  onDelete,
  onShrink,
  onGrow,
  onMove,
  onConfirm,
  confirmed,
}: {
  onDelete: () => void;
  onShrink: () => void;
  onGrow: () => void;
  onMove: (dx: number, dy: number) => void;
  onConfirm: () => void;
  confirmed: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      <ToolBtn label="Remove logo" onClick={onDelete}>
        <Trash2 className="h-4 w-4" strokeWidth={2.25} />
      </ToolBtn>
      <ToolBtn label="Make smaller" onClick={onShrink}>
        <Minus className="h-4 w-4" strokeWidth={2.5} />
      </ToolBtn>
      <ToolBtn label="Make larger" onClick={onGrow}>
        <Plus className="h-4 w-4" strokeWidth={2.5} />
      </ToolBtn>
      <ToolBtn label="Move left" onClick={() => onMove(-MOVE_STEP, 0)}>
        <ArrowLeft className="h-4 w-4" strokeWidth={2.25} />
      </ToolBtn>
      <ToolBtn label="Move right" onClick={() => onMove(MOVE_STEP, 0)}>
        <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
      </ToolBtn>
      <ToolBtn label="Move down" onClick={() => onMove(0, MOVE_STEP)}>
        <ArrowDown className="h-4 w-4" strokeWidth={2.25} />
      </ToolBtn>
      <ToolBtn label="Move up" onClick={() => onMove(0, -MOVE_STEP)}>
        <ArrowUp className="h-4 w-4" strokeWidth={2.25} />
      </ToolBtn>
      <ToolBtn label="Confirm position" onClick={onConfirm} active={confirmed}>
        <Check className="h-4 w-4" strokeWidth={2.75} />
      </ToolBtn>
    </div>
  );
}

function PlacedLogo({
  src,
  layout,
  selected,
  onSelect,
  centered,
  placeholder,
  onPlaceholderClick,
  placeholderColor,
  tint,
}: {
  src: string | null;
  layout: LogoLayout;
  selected: boolean;
  onSelect: () => void;
  centered?: boolean;
  placeholder?: boolean;
  onPlaceholderClick?: () => void;
  placeholderColor?: string;
  /** Gold / Silver: solid or gradient fill. Customize: omit for original colors */
  tint?: { fill: string; isGradient?: boolean } | null;
}) {
  const isEmpty = !src;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (isEmpty) {
          onPlaceholderClick?.();
          return;
        }
        onSelect();
      }}
      className="absolute z-20 touch-manipulation transition-[box-shadow] duration-150"
      style={{
        width: layout.size,
        height: layout.size,
        left: `${layout.x}%`,
        top: `${layout.y}%`,
        transform: centered ? "translate(-50%, -50%)" : "translate(0, 0)",
        boxShadow: selected && !isEmpty ? "0 0 0 0.5px rgba(0, 0, 0, 0.75)" : "none",
      }}
      aria-label={isEmpty ? "Upload logo" : "Select logo to adjust"}
    >
      {src ? (
        tint ? (
          <span
            className="block h-full w-full"
            style={{
              backgroundImage: tint.isGradient ? tint.fill : undefined,
              backgroundColor: tint.isGradient ? undefined : tint.fill,
              WebkitMaskImage: `url(${src})`,
              maskImage: `url(${src})`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
            role="img"
            aria-label="Card logo"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt="Card logo"
            className="h-full w-full object-contain select-none"
            draggable={false}
          />
        )
      ) : placeholder ? (
        <span
          className="flex h-full w-full flex-col items-center justify-center gap-0.5 rounded-md border border-dashed opacity-55"
          style={{
            borderColor: placeholderColor ?? "#888",
            color: placeholderColor ?? "#888",
          }}
        >
          <ImageIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
          <span className="text-[6px] font-semibold tracking-wide uppercase">
            Logo
          </span>
        </span>
      ) : null}
    </button>
  );
}

export default function CardCustomizer() {
  const [side, setSide] = useState<Side>("front");
  const [cardMode, setCardMode] = useState<CardMode>("gold");
  const [cardColor, setCardColor] = useState(cardColors[0]);
  const [accentColor, setAccentColor] = useState(accentColors[0]);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [moreDetails, setMoreDetails] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [frontLogo, setFrontLogo] = useState<LogoLayout>(FRONT_LOGO_DEFAULT);
  const [backLogo, setBackLogo] = useState<LogoLayout>(BACK_LOGO_DEFAULT);
  const [logoEditing, setLogoEditing] = useState(false);
  const [logoConfirmed, setLogoConfirmed] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  // const customColorInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const logoObjectUrl = useRef<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(PREVIEW_MAX_W / CARD_W);

  const isCustomize = cardMode === "customize";
  const metalPreset =
    cardMode === "gold" || cardMode === "silver"
      ? getMetalPreset(cardMode)
      : null;

  /** Body always from picker (black / white) */
  const displayCardColor = cardColor;
  const metalGradient = metalPreset?.gradient ?? null;
  /** Customize: auto contrast. Gold/Silver: foil gradient text */
  const displayTextColor = isCustomize
    ? readableTextColor(cardColor)
    : (metalPreset?.contentColor ?? "#C9982C");
  const displayTextStyle: CSSProperties = metalGradient
    ? metalTextStyle(metalGradient)
    : { color: displayTextColor };
  const displayAccentColor = isCustomize
    ? accentColor
    : (metalPreset?.accentColor ?? accentColor);
  /** Gold/Silver tint uploaded logo with foil gradient; Customize keeps original */
  const logoTint = metalGradient
    ? { fill: metalGradient, isGradient: true as const }
    : null;

  const activeLogo = side === "front" ? frontLogo : backLogo;
  const setActiveLogo = side === "front" ? setFrontLogo : setBackLogo;

  const hasExtraLine = moreDetails.trim().length > 0;

  const progress =
    (title.trim() ? 1 : 0) +
    (subTitle.trim() ? 1 : 0) +
    (logoUrl ? 1 : 0) +
    1;
  const progressPct = Math.round((progress / 4) * 100);

  useEffect(() => {
    return () => {
      if (logoObjectUrl.current) URL.revokeObjectURL(logoObjectUrl.current);
    };
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const syncScale = () => {
      setPreviewScale(el.clientWidth / CARD_W);
    };
    syncScale();
    const ro = new ResizeObserver(syncScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setLogoConfirmed(false);
  }, [side]);

  function updateLogo(patch: Partial<LogoLayout>) {
    setActiveLogo((prev) => ({
      size: clamp(patch.size ?? prev.size, SIZE_MIN, SIZE_MAX),
      x: clamp(patch.x ?? prev.x, 0, 92),
      y: clamp(patch.y ?? prev.y, 0, 88),
    }));
    setLogoConfirmed(false);
    setLogoEditing(true);
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (logoObjectUrl.current) URL.revokeObjectURL(logoObjectUrl.current);
    const url = URL.createObjectURL(file);
    logoObjectUrl.current = url;
    setLogoUrl(url);
    setFrontLogo(FRONT_LOGO_DEFAULT);
    setBackLogo(BACK_LOGO_DEFAULT);
    setLogoEditing(true);
    setLogoConfirmed(false);
  }

  function removeLogo() {
    if (logoObjectUrl.current) URL.revokeObjectURL(logoObjectUrl.current);
    logoObjectUrl.current = null;
    setLogoUrl(null);
    setFrontLogo(FRONT_LOGO_DEFAULT);
    setBackLogo(BACK_LOGO_DEFAULT);
    setLogoEditing(false);
    setLogoConfirmed(false);
    if (logoInputRef.current) logoInputRef.current.value = "";
  }

  function resetDesign() {
    setSide("front");
    setCardMode("gold");
    setCardColor(cardColors[0]);
    setAccentColor(accentColors[0]);
    setTitle("");
    setSubTitle("");
    setMoreDetails("");
    removeLogo();
  }

  function selectCardMode(mode: CardMode) {
    setCardMode(mode);
    if (mode === "gold" || mode === "silver") {
      const preset = getMetalPreset(mode);
      setAccentColor(preset.accentColor);
      if (cardColor !== "#141414" && cardColor !== "#FFFFFF") {
        setCardColor(preset.bodyColors[0]);
      }
    }
  }

  function handleSubmit() {
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2200);
    console.log("Submitting design:", {
      side,
      cardMode,
      cardColor: displayCardColor,
      accentColor: displayAccentColor,
      textColor: displayTextColor,
      title,
      subTitle,
      moreDetails,
      hasLogo: Boolean(logoUrl),
      frontLogo,
      backLogo,
    });
  }

  return (
    <div className="min-h-[70vh] bg-[#FFFCF7]">
      <div className="border-b border-black/[0.06] bg-white/70 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
          <p className="text-xs font-bold tracking-[0.16em] text-[#BC7C10] uppercase">
            Card Studio
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#141414] sm:text-4xl">
            Design Your Hexa Card
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#5c5346] sm:text-base">
            Pick colors, add your details, upload a logo — resize and move it
            on front and back. Preview updates live.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-5 py-8 sm:gap-10 sm:px-8 sm:py-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex items-start gap-3 rounded-2xl border border-[#BC7C10]/25 bg-[#FFFCF7] p-4 shadow-sm"
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-sm"
              style={{
                background:
                  "linear-gradient(135deg,#9B6F18 0%,#C9982C 35%,#D8A83A 70%,#B8841D 100%)",
              }}
            >
              <MessageCircle className="h-5 w-5" strokeWidth={2} />
            </span>
            <p className="text-sm leading-relaxed text-[#141414]">
              Need a free custom mockup? Chat with our designer on WhatsApp —
              pay only after you approve.{" "}
              <a
                href="https://api.whatsapp.com/send?phone=919971420130"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#BC7C10] underline decoration-[#BC7C10]/35 underline-offset-2 transition-colors hover:text-[#9a650d]"
              >
                Open WhatsApp
              </a>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-6 rounded-3xl border border-black/[0.06] bg-white p-5 shadow-[0_16px_48px_rgba(15,23,42,0.06)] sm:p-7"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#BC7C10]" />
                <p className="text-sm font-semibold text-[#141414]">
                  Live preview · {side === "front" ? "Front" : "Back"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSide((s) => (s === "front" ? "back" : "front"))}
                className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-[#141414] transition-colors hover:border-[#BC7C10]/40 hover:text-[#BC7C10]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Flip card
              </button>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-black/[0.04] bg-[#FFFCF7]">
              {/* Light hex pattern behind the card */}
              <div
                className="pointer-events-none absolute inset-0"
                aria-hidden
              >
                <svg
                  className="absolute inset-0 h-full w-full"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <defs>
                    <pattern
                      id="previewHexTile"
                      width="72"
                      height="62"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M36 3 L67 21 L67 45 L36 63 L5 45 L5 21 Z"
                        fill="none"
                        stroke="#BC7C10"
                        strokeOpacity="0.22"
                        strokeWidth="1.1"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M72 34 L103 52 L103 76 L72 94 L41 76 L41 52 Z"
                        fill="none"
                        stroke="#BC7C10"
                        strokeOpacity="0.14"
                        strokeWidth="1"
                        strokeLinejoin="round"
                        transform="translate(-36 -31)"
                      />
                    </pattern>
                    <radialGradient id="previewHexFade" cx="50%" cy="48%" r="68%">
                      <stop offset="0%" stopColor="#FFFCF7" stopOpacity="0.15" />
                      <stop offset="55%" stopColor="#FFFCF7" stopOpacity="0.05" />
                      <stop offset="100%" stopColor="#FFFCF7" stopOpacity="0.92" />
                    </radialGradient>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#previewHexTile)" />
                  <rect width="100%" height="100%" fill="url(#previewHexFade)" />
                </svg>
              </div>

              <div className="relative z-10 flex flex-col items-center px-4 py-8 sm:px-6 sm:py-10">
                {/* <p className="mb-3 text-[11px] font-semibold tracking-wide text-[#5c5346]/80 uppercase">
                  Card size {CARD_W} × {CARD_H} px
                </p> */}

                {/* Stage: layout box = scaled size; inner canvas stays exactly 244×154 */}
                <div
                  ref={stageRef}
                  className="relative w-full max-w-[488px] [perspective:1200px]"
                  style={{
                    aspectRatio: `${CARD_W} / ${CARD_H}`,
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={side}
                      initial={{
                        rotateY: side === "front" ? -18 : 18,
                        opacity: 0.6,
                      }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{
                        rotateY: side === "front" ? 18 : -18,
                        opacity: 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 160,
                        damping: 18,
                      }}
                      className="absolute inset-0"
                      onClick={() => setLogoEditing(false)}
                    >
                      {/* True design canvas: 244 × 154 — scaled up only for screen preview */}
                      {/* True design canvas: 244 × 154 — scaled up only for screen preview */}
                      <div
                        className="absolute top-0 left-0 overflow-hidden rounded-[10px] shadow-2xl"
                        style={{
                          width: CARD_W,
                          height: CARD_H,
                          transform: `scale(${previewScale})`,
                          transformOrigin: "top left",
                          backgroundColor: displayCardColor,
                          /* Hairline edge — stays crisp after scale (~0.5px on screen at 2×) */
                          boxShadow: `
                            0 0 0 ${0.5 / previewScale}px rgba(0, 0, 0, 0.55),
                            0 20px 40px -16px ${displayCardColor}99
                          `,
                        }}
                      >
                        {side === "front" ? (
                          <>
                            {/* Foil gradients for wifi stroke (gold / silver modes) */}
                            {metalPreset ? (
                              <svg
                                width="0"
                                height="0"
                                className="absolute"
                                aria-hidden
                              >
                                <defs>
                                  <linearGradient
                                    id={`cardMetalGrad-${cardMode}`}
                                    x1="0%"
                                    y1="0%"
                                    x2="100%"
                                    y2="0%"
                                  >
                                    {metalPreset.stops.map((stop) => (
                                      <stop
                                        key={stop.offset}
                                        offset={stop.offset}
                                        stopColor={stop.color}
                                      />
                                    ))}
                                  </linearGradient>
                                </defs>
                              </svg>
                            ) : null}

                            <Wifi
                              className="absolute top-3 right-3 z-10 h-4 w-4 rotate-90"
                              color={
                                metalPreset
                                  ? `url(#cardMetalGrad-${cardMode})`
                                  : displayAccentColor
                              }
                              strokeWidth={2.5}
                            />

                            <PlacedLogo
                              src={logoUrl}
                              layout={frontLogo}
                              selected={logoEditing}
                              onSelect={() => setLogoEditing(true)}
                              placeholder
                              placeholderColor={displayTextColor}
                              tint={logoTint}
                              onPlaceholderClick={() =>
                                logoInputRef.current?.click()
                              }
                            />

                            <div
                              className={`absolute bottom-3 left-3 z-10 max-w-[52%] ${
                                hasExtraLine ? "" : "pb-0.5"
                              }`}
                            >
                              <p
                                className={`leading-tight font-bold ${
                                  hasExtraLine ? "text-[14px]" : "text-[15px]"
                                }`}
                                style={displayTextStyle}
                              >
                                {title.trim() || "Your Name"}
                              </p>
                              <p
                                className={`mt-0.5 leading-snug ${
                                  hasExtraLine ? "text-[8px]" : "text-[9px]"
                                } ${metalGradient ? "opacity-90" : "opacity-80"}`}
                                style={displayTextStyle}
                              >
                                {subTitle.trim() || "Title or company"}
                              </p>
                              {hasExtraLine ? (
                                <p
                                  className={`mt-0.5 text-[8px] leading-snug ${
                                    metalGradient ? "opacity-80" : "opacity-65"
                                  }`}
                                  style={displayTextStyle}
                                >
                                  {moreDetails.trim()}
                                </p>
                              ) : null}
                            </div>

                            {/* QR frame — foil gradient border on metal modes */}
                            <div
                              className="absolute right-3 bottom-3 z-10 h-12 w-12 rounded-md p-[3px]"
                              style={{
                                background: metalGradient ?? displayAccentColor,
                              }}
                            >
                              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[4px] bg-white p-0.5">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src="/Images/HexaQR.png"
                                  alt="Hexa QR"
                                  className="h-full w-full object-contain"
                                  draggable={false}
                                />
                              </div>
                            </div>
                          </>
                        ) : logoUrl ? (
                          <PlacedLogo
                            src={logoUrl}
                            layout={backLogo}
                            selected={logoEditing}
                            onSelect={() => setLogoEditing(true)}
                            centered
                            tint={logoTint}
                          />
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center">
                            {metalGradient ? (
                              <span
                                className="flex h-14 w-14 items-center justify-center rounded-full p-[3px]"
                                style={{ background: metalGradient }}
                              >
                                <span
                                  className="flex h-full w-full items-center justify-center rounded-full text-[10px] font-bold"
                                  style={{
                                    backgroundColor: displayCardColor,
                                    ...metalTextStyle(metalGradient),
                                  }}
                                >
                                  LOGO
                                </span>
                              </span>
                            ) : (
                              <div
                                className="flex h-14 w-14 items-center justify-center rounded-full border-[3px] text-[10px] font-bold"
                                style={{
                                  borderColor: displayTextColor,
                                  color: displayTextColor,
                                }}
                              >
                                LOGO
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Logo adjust toolbar — under preview */}
            <AnimatePresence>
              {logoUrl && logoEditing ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="mt-5 rounded-2xl border border-black/[0.06] bg-[#FFFCF7] px-3 py-4"
                >
                  <p className="mb-3 text-center text-[11px] font-semibold tracking-wide text-[#5c5346] uppercase">
                    Adjust {side} logo · size {Math.round(activeLogo.size)}px
                  </p>
                  <LogoToolbar
                    onDelete={removeLogo}
                    onShrink={() =>
                      updateLogo({ size: activeLogo.size - SIZE_STEP })
                    }
                    onGrow={() =>
                      updateLogo({ size: activeLogo.size + SIZE_STEP })
                    }
                    onMove={(dx, dy) =>
                      updateLogo({
                        x: activeLogo.x + dx,
                        y: activeLogo.y + dy,
                      })
                    }
                    onConfirm={() => {
                      setLogoConfirmed(true);
                      setLogoEditing(false);
                    }}
                    confirmed={logoConfirmed}
                  />
                </motion.div>
              ) : logoUrl ? (
                <p className="mt-4 text-center text-xs text-[#5c5346]">
                  Tap the logo on the card to resize or move it.
                </p>
              ) : null}
            </AnimatePresence>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[11px] text-[#5c5346]">
              <span className="rounded-full bg-[#FFFCF7] px-2.5 py-1 ring-1 ring-black/5 capitalize">
                {cardMode} card
              </span>
              <span className="rounded-full bg-[#FFFCF7] px-2.5 py-1 ring-1 ring-black/5">
                Body {displayCardColor}
              </span>
              <span className="rounded-full bg-[#FFFCF7] px-2.5 py-1 ring-1 ring-black/5 capitalize">
                Text {metalGradient ? `${cardMode} foil` : displayTextColor}
              </span>
              <span className="rounded-full bg-[#FFFCF7] px-2.5 py-1 ring-1 ring-black/5">
                Accent {metalGradient ? `${cardMode} foil` : displayAccentColor}
              </span>
            </div>

            {/* Design progress — below the card preview */}
            <div className="mx-auto mt-6 w-full max-w-sm">
              <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
                <span className="text-[#5c5346]">Design progress</span>
                <span className="text-[#BC7C10]">{progressPct}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-black/[0.06]">
                <motion.div
                  className="h-full rounded-full bg-[#BC7C10]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="space-y-5"
        >
          <div className="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm sm:p-5">
            <SectionLabel
              icon={Sparkles}
              title="Card side"
              hint="Switch between front and back artwork"
            />
            <div className="grid grid-cols-2 gap-2.5 rounded-xl bg-[#FFFCF7] p-1.5 ring-1 ring-black/[0.04]">
              {(["front", "back"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSide(value)}
                  className={`rounded-lg px-4 py-2.5 text-sm font-semibold capitalize transition-all duration-200 ${
                    side === value
                      ? "bg-[#141414] text-white shadow-md"
                      : "text-[#5c5346] hover:bg-white hover:text-[#141414]"
                  }`}
                >
                  {value} side
                </button>
              ))}
            </div>
          </div>

          {/* Gold · Silver · Customize */}
          <div className="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm sm:p-5">
            <SectionLabel
              icon={Palette}
              title="Card finish"
              hint="Gold & Silver lock metal accents · Customize picks wifi & QR colors"
            />
            <div className="grid grid-cols-3 gap-2 rounded-xl bg-[#FFFCF7] p-1.5 ring-1 ring-black/[0.04]">
              {CARD_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => selectCardMode(mode.id)}
                  className={`rounded-lg px-2 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    cardMode === mode.id
                      ? "bg-[#141414] text-white shadow-md"
                      : "text-[#5c5346] hover:bg-white hover:text-[#141414]"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Body: black / white — for Gold, Silver & Customize */}
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold text-[#5c5346]">
                Card body
              </p>
              <div className="flex flex-wrap gap-3">
                {cardColors.map((color) => (
                  <ColorSwatch
                    key={color}
                    color={color}
                    selected={cardColor === color}
                    onSelect={() => setCardColor(color)}
                    label={
                      color === "#141414" ? "Black card" : "White card"
                    }
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-[#5c5346]/75">
                {isCustomize
                  ? "Black card → white text · White card → black text"
                  : `${metalPreset?.label ?? ""} accents stay on wifi, QR & name`}
              </p>
            </div>

            {metalPreset ? (
              <div className="mt-4 space-y-2 rounded-xl border border-black/[0.05] bg-[#FFFCF7] p-3.5 text-sm">
                <p className="text-xs font-semibold tracking-wide text-[#BC7C10] uppercase">
                  {metalPreset.label} card fields
                </p>
                <ul className="space-y-1.5 text-[#5c5346]">
                  <li className="flex items-center justify-between gap-3">
                    <span>Card body</span>
                    <span className="inline-flex items-center gap-2 font-medium text-[#141414]">
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-black/10"
                        style={{ backgroundColor: cardColor }}
                      />
                      {cardColor === "#141414" ? "Black" : "White"}
                    </span>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span>Name / text</span>
                    <span className="inline-flex items-center gap-2 font-medium text-[#141414]">
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-black/10"
                        style={{ background: metalPreset.gradient }}
                      />
                      {metalPreset.label} foil
                    </span>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span>Wifi & QR border</span>
                    <span className="inline-flex items-center gap-2 font-medium text-[#141414]">
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-black/10"
                        style={{ background: metalPreset.gradient }}
                      />
                      {metalPreset.label} foil
                    </span>
                  </li>
                </ul>
                <p className="pt-1 text-xs text-[#5c5346]/80">
                  {metalPreset.description}
                </p>
              </div>
            ) : null}
          </div>

          {/* Customize-only: accent colors (no text color — auto contrast) */}
          {isCustomize ? (
            <div className="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm sm:p-5">
              <SectionLabel
                icon={QrCode}
                title="QR border & NFC accent"
                hint="Changes wifi icon and QR frame color"
              />
              <div className="flex flex-wrap gap-3">
                {accentColors.map((color) => (
                  <ColorSwatch
                    key={color}
                    color={color}
                    selected={accentColor === color}
                    onSelect={() => setAccentColor(color)}
                    label={`Accent color ${color}`}
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div className="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm sm:p-5">
            <SectionLabel
              icon={Type}
              title="Card details"
              hint="Name & subtitle show on the front · extra line is optional"
            />
            <div className="space-y-4">
              <label className="block">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-[#5c5346]">
                    Name / Title
                  </span>
                  <span className="text-[11px] text-[#5c5346]/70">
                    {title.length}/40
                  </span>
                </div>
                <input
                  type="text"
                  value={title}
                  maxLength={40}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Rohit Agrawal"
                  className="w-full rounded-xl border border-black/10 bg-[#FFFCF7] px-3.5 py-3 text-sm text-[#141414] outline-none transition-all placeholder:text-[#5c5346]/45 focus:border-[#BC7C10]/50 focus:bg-white focus:ring-2 focus:ring-[#BC7C10]/15"
                />
              </label>

              <label className="block">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-[#5c5346]">
                    Subtitle
                  </span>
                  <span className="text-[11px] text-[#5c5346]/70">
                    {subTitle.length}/48
                  </span>
                </div>
                <input
                  type="text"
                  value={subTitle}
                  maxLength={48}
                  onChange={(e) => setSubTitle(e.target.value)}
                  placeholder="e.g. Founder · Hexa Cards"
                  className="w-full rounded-xl border border-black/10 bg-[#FFFCF7] px-3.5 py-3 text-sm text-[#141414] outline-none transition-all placeholder:text-[#5c5346]/45 focus:border-[#BC7C10]/50 focus:bg-white focus:ring-2 focus:ring-[#BC7C10]/15"
                />
              </label>

              <label className="block">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-[#5c5346]">
                    Extra line{" "}
                    <span className="font-normal text-[#5c5346]/60">
                      (optional)
                    </span>
                  </span>
                  <span className="text-[11px] text-[#5c5346]/70">
                    {moreDetails.length}/56
                  </span>
                </div>
                <input
                  type="text"
                  value={moreDetails}
                  maxLength={56}
                  onChange={(e) => setMoreDetails(e.target.value)}
                  placeholder="Phone, email, or link — only shows if filled"
                  className="w-full rounded-xl border border-black/10 bg-[#FFFCF7] px-3.5 py-3 text-sm text-[#141414] outline-none transition-all placeholder:text-[#5c5346]/45 focus:border-[#BC7C10]/50 focus:bg-white focus:ring-2 focus:ring-[#BC7C10]/15"
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm sm:p-5">
            <SectionLabel
              icon={ImageIcon}
              title="Logo / image"
              hint={
                isCustomize
                  ? "Shown in original colors · adjust size & position on front and back"
                  : `Tinted ${cardMode === "gold" ? "gold" : "silver"} on this finish · original colors in Customize`
              }
            />
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="sr-only"
            />
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#FFFCF7] px-5 py-2.5 text-sm font-semibold text-[#141414] transition-all hover:border-[#BC7C10]/35 hover:bg-white"
              >
                <Upload className="h-4 w-4 text-[#BC7C10]" />
                {logoUrl ? "Change logo" : "Upload logo"}
              </button>
              {logoUrl ? (
                <>
                  <button
                    type="button"
                    onClick={() => setLogoEditing(true)}
                    className="text-sm font-semibold text-[#BC7C10] underline-offset-2 hover:underline"
                  >
                    Adjust on {side}
                  </button>
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="text-sm font-medium text-[#5c5346] underline-offset-2 hover:text-[#141414] hover:underline"
                  >
                    Remove
                  </button>
                </>
              ) : null}
            </div>

            {logoUrl ? (
              <div className="mt-4 rounded-xl border border-black/[0.05] bg-[#FFFCF7] p-3">
                <LogoToolbar
                  onDelete={removeLogo}
                  onShrink={() =>
                    updateLogo({ size: activeLogo.size - SIZE_STEP })
                  }
                  onGrow={() =>
                    updateLogo({ size: activeLogo.size + SIZE_STEP })
                  }
                  onMove={(dx, dy) =>
                    updateLogo({
                      x: activeLogo.x + dx,
                      y: activeLogo.y + dy,
                    })
                  }
                  onConfirm={() => {
                    setLogoConfirmed(true);
                    setLogoEditing(false);
                  }}
                  confirmed={logoConfirmed}
                />
                <p className="mt-2.5 text-center text-[11px] text-[#5c5346]">
                  {side === "front" ? "Front" : "Back"} logo ·{" "}
                  {Math.round(activeLogo.size)}px · position{" "}
                  {Math.round(activeLogo.x)}%, {Math.round(activeLogo.y)}%
                </p>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={resetDesign}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-5 py-3.5 text-sm font-semibold text-[#141414] transition-colors hover:bg-[#FFFCF7]"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex flex-[1.4] items-center justify-center gap-2 rounded-xl bg-[#BC7C10] px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-[#BC7C10]/25 transition-all hover:bg-[#9a650d] active:scale-[0.99]"
            >
              {savedFlash ? "Details saved" : "Submit details"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <AnimatePresence>
            {savedFlash ? (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-sm font-medium text-[#BC7C10]"
              >
                Design captured — our team will follow up shortly.
              </motion.p>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
