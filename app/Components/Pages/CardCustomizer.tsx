"use client";

import { useEffect, useRef, useState, type ComponentType, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MessageCircle,
  Upload,
  Wifi,
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
  METAL_MODES,
  getMetalPreset,
  type CardMode,
  type MetalMode,
} from "./cardFinishes";
import { GOLD_GRADIENT } from "./goldCard";
import { SILVER_GRADIENT } from "./silverCard";

type Side = "front" | "back";

type LogoLayout = {
  size: number;
  x: number;
  y: number;
};

type CardBody = "black" | "white";

const CARD_BODY = {
  black: "#141414",
  white: "#FFFFFF",
} as const;

/** White card accents — requested 5 + existing customize colors */
const whiteCardAccents = [
  { label: "Red", color: "#E53935" },
  { label: "Dark Pink", color: "#C2185B" },
  { label: "Royal Blue", color: "#1565C0" },
  { label: "Light Green", color: "#7CB342" },
  { label: "Yellow", color: "#FDD835" },
  { label: "Gold", color: "#C9982C" },
  // { label: "Silver", color: "#9CA0A4" },
  // { label: "White", color: "#FFFFFF" },
  { label: "Black", color: "#141414" },
  { label: "Sky Blue", color: "#00BFFF" },
  { label: "Green", color: "#00B813" },
  { label: "Orange", color: "#FF8E00" },
  { label: "Hot Pink", color: "#FD0095" },
] as const;

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
  const [cardBody, setCardBody] = useState<CardBody>("black");
  const [cardMode, setCardMode] = useState<CardMode>("gold");
  const [accentColor, setAccentColor] = useState<string>(
    whiteCardAccents[0].color,
  );
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [moreDetails, setMoreDetails] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [frontLogo, setFrontLogo] = useState<LogoLayout>(FRONT_LOGO_DEFAULT);
  const [backLogo, setBackLogo] = useState<LogoLayout>(BACK_LOGO_DEFAULT);
  const [logoEditing, setLogoEditing] = useState(false);
  const [logoConfirmed, setLogoConfirmed] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [flipPulse, setFlipPulse] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const logoObjectUrl = useRef<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(PREVIEW_MAX_W / CARD_W);

  const isBlackCard = cardBody === "black";
  const isCustomize = !isBlackCard; // white card → customize accents only
  const metalPreset =
    isBlackCard && (cardMode === "gold" || cardMode === "silver")
      ? getMetalPreset(cardMode)
      : null;

  const displayCardColor = CARD_BODY[cardBody];
  const metalGradient = metalPreset?.gradient ?? null;
  // White card: selected accent drives name, details, wifi & QR
  const displayTextColor = isCustomize
    ? accentColor
    : (metalPreset?.contentColor ?? "#C9982C");
  const displayTextStyle: CSSProperties = metalGradient
    ? metalTextStyle(metalGradient)
    : { color: displayTextColor };
  const displayAccentColor = isCustomize
    ? accentColor
    : (metalPreset?.accentColor ?? accentColor);
  const logoTint = metalGradient
    ? { fill: metalGradient, isGradient: true as const }
    : null;

  const isBlackBody = displayCardColor === CARD_BODY.black;
  const qrPlateBg = isBlackBody
    ? CARD_BODY.black
    : cardMode === "silver" && metalPreset
      ? (metalPreset.gradient ?? "#9CA0A4")
      : displayCardColor;
  const qrModuleTint =
    metalPreset && cardMode === "gold"
      ? { fill: metalGradient!, isGradient: true as const }
      : metalPreset && cardMode === "silver"
        ? isBlackBody
          ? { fill: metalGradient!, isGradient: true as const }
          : { fill: "#141414", isGradient: false as const }
        : isCustomize
          ? { fill: accentColor, isGradient: false as const }
          : isBlackBody
            ? { fill: "#FFFFFF", isGradient: false as const }
            : null;

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
    // Front logo is disabled — always adjust back logo
    setBackLogo((prev) => ({
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

    const isPng =
      file.type === "image/png" || file.name.toLowerCase().endsWith(".png");
    if (!isPng) {
      setLogoError("Only PNG files are accepted. Please upload a .png logo.");
      if (logoInputRef.current) logoInputRef.current.value = "";
      return;
    }

    setLogoError(null);
    if (logoObjectUrl.current) URL.revokeObjectURL(logoObjectUrl.current);
    const url = URL.createObjectURL(file);
    logoObjectUrl.current = url;
    setLogoUrl(url);
    setFrontLogo(FRONT_LOGO_DEFAULT);
    setBackLogo(BACK_LOGO_DEFAULT);
    setSide("back");
    setLogoEditing(true);
    setLogoConfirmed(false);
    // Draw attention to side switch so front is easy to find after auto-flip
    setFlipPulse(true);
    window.setTimeout(() => setFlipPulse(false), 4500);
  }

  function flipTo(next: Side) {
    setSide(next);
    setFlipPulse(false);
  }

  function removeLogo() {
    if (logoObjectUrl.current) URL.revokeObjectURL(logoObjectUrl.current);
    logoObjectUrl.current = null;
    setLogoUrl(null);
    setLogoError(null);
    setFrontLogo(FRONT_LOGO_DEFAULT);
    setBackLogo(BACK_LOGO_DEFAULT);
    setLogoEditing(false);
    setLogoConfirmed(false);
    if (logoInputRef.current) logoInputRef.current.value = "";
  }

  function resetDesign() {
    setSide("front");
    setCardBody("black");
    setCardMode("gold");
    setAccentColor(whiteCardAccents[0].color);
    setTitle("");
    setSubTitle("");
    setMoreDetails("");
    removeLogo();
  }

  function selectCardBody(body: CardBody) {
    setCardBody(body);
    if (body === "black") {
      setCardMode("gold");
      setAccentColor(getMetalPreset("gold").accentColor);
    } else {
      setCardMode("customize");
      setAccentColor(whiteCardAccents[0].color);
    }
  }

  function selectMetalMode(mode: MetalMode) {
    setCardMode(mode);
    setAccentColor(getMetalPreset(mode).accentColor);
  }

  function handleSubmit() {
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2200);
    console.log("Submitting design:", {
      side,
      cardBody,
      cardMode: isBlackCard ? cardMode : "customize",
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
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#BC7C10]" />
                <p className="text-sm font-semibold text-[#141414]">
                  Live preview
                </p>
              </div>
              <motion.div
                animate={
                  flipPulse
                    ? {
                        boxShadow: [
                          "0 0 0 0 rgba(188,124,16,0)",
                          "0 0 0 4px rgba(188,124,16,0.35)",
                          "0 0 0 0 rgba(188,124,16,0)",
                        ],
                      }
                    : { boxShadow: "0 0 0 0 rgba(188,124,16,0)" }
                }
                transition={
                  flipPulse
                    ? { duration: 1.1, repeat: 3, ease: "easeInOut" }
                    : { duration: 0.2 }
                }
                className="inline-flex w-full rounded-full bg-[#141414] p-1 sm:w-auto"
                role="group"
                aria-label="Card side"
              >
                {(["front", "back"] as const).map((value) => {
                  const active = side === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => flipTo(value)}
                      aria-pressed={active}
                      className={`relative flex-1 rounded-full px-5 py-2 text-xs font-bold tracking-wide uppercase transition-colors sm:flex-none ${
                        active
                          ? "bg-[#BC7C10] text-white"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </motion.div>
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

                            {/* Front logo — hidden for now
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
                            */}

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

                            {/* QR — plate matches black / silver; modules foil or contrast */}
                            <div
                              className="absolute right-3 bottom-3 z-10 h-12 w-12 rounded-[5px]"
                              style={{
                                padding: "0.5px",
                                background: metalGradient ?? displayAccentColor,
                              }}
                            >
                              <div
                                className="flex h-full w-full items-center justify-center overflow-hidden rounded-[4.5px]"
                                style={{ background: qrPlateBg }}
                              >
                                {qrModuleTint ? (
                                  <span
                                    className="block h-[88%] w-[88%]"
                                    style={{
                                      backgroundImage: qrModuleTint.isGradient
                                        ? qrModuleTint.fill
                                        : undefined,
                                      backgroundColor: qrModuleTint.isGradient
                                        ? undefined
                                        : qrModuleTint.fill,
                                      WebkitMaskImage:
                                        "url(/Images/HexaQR.png)",
                                      maskImage: "url(/Images/HexaQR.png)",
                                      WebkitMaskSize: "contain",
                                      maskSize: "contain",
                                      WebkitMaskRepeat: "no-repeat",
                                      maskRepeat: "no-repeat",
                                      WebkitMaskPosition: "center",
                                      maskPosition: "center",
                                    }}
                                    role="img"
                                    aria-label="Hexa QR"
                                  />
                                ) : (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src="/Images/HexaQR.png"
                                    alt="Hexa QR"
                                    className="h-[88%] w-[88%] object-contain"
                                    draggable={false}
                                  />
                                )}
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

            {/* Back logo adjust toolbar — under preview */}
            <AnimatePresence>
              {logoUrl && side === "back" ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="mt-5 rounded-2xl border border-black/[0.06] bg-[#FFFCF7] px-3 py-4"
                >
                  <p className="mb-3 text-center text-[11px] font-semibold tracking-wide text-[#5c5346] uppercase">
                    Adjust back logo · size {Math.round(backLogo.size)}px
                  </p>
                  <LogoToolbar
                    onDelete={removeLogo}
                    onShrink={() =>
                      updateLogo({ size: backLogo.size - SIZE_STEP })
                    }
                    onGrow={() =>
                      updateLogo({ size: backLogo.size + SIZE_STEP })
                    }
                    onMove={(dx, dy) =>
                      updateLogo({
                        x: backLogo.x + dx,
                        y: backLogo.y + dy,
                      })
                    }
                    onConfirm={() => {
                      setLogoConfirmed(true);
                      setLogoEditing(false);
                    }}
                    confirmed={logoConfirmed}
                  />
                  <button
                    type="button"
                    onClick={() => flipTo("front")}
                    className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                      flipPulse
                        ? "bg-[#BC7C10] text-white shadow-md shadow-[#BC7C10]/30 ring-2 ring-[#BC7C10]/40 ring-offset-2 ring-offset-[#FFFCF7]"
                        : "border border-black/10 bg-white text-[#141414] hover:border-[#BC7C10]/35 hover:text-[#BC7C10]"
                    }`}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    View front side
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[11px] text-[#5c5346]">
              <span className="rounded-full bg-[#FFFCF7] px-2.5 py-1 ring-1 ring-black/5 capitalize">
                {isBlackCard ? `${cardMode} black` : "white"} card
              </span>
              <span className="rounded-full bg-[#FFFCF7] px-2.5 py-1 ring-1 ring-black/5 capitalize">
                Text {metalGradient ? `${cardMode} foil` : displayTextColor}
              </span>
              <span className="rounded-full bg-[#FFFCF7] px-2.5 py-1 ring-1 ring-black/5">
                Accent{" "}
                {metalGradient ? `${cardMode} foil` : displayAccentColor}
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
                  onClick={() => flipTo(value)}
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

          {/* Card type: Black | White */}
          <div className="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm sm:p-5">
            <SectionLabel
              icon={Palette}
              title="Card type"
              hint="Black → gold/silver foil · White → custom accent colors"
            />
            <div className="flex flex-wrap items-start gap-6 sm:gap-8">
              {(
                [
                  { id: "black" as const, label: "Black Card", color: CARD_BODY.black },
                  { id: "white" as const, label: "White Card", color: CARD_BODY.white },
                ] as const
              ).map((type) => {
                const selected = cardBody === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => selectCardBody(type.id)}
                    aria-pressed={selected}
                    aria-label={type.label}
                    className="flex flex-col items-center gap-2"
                  >
                    <span
                      className={`relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${
                        selected
                          ? "ring-2 ring-[#BC7C10] ring-offset-2 ring-offset-white"
                          : "ring-1 ring-black/10"
                      }`}
                      style={{
                        backgroundColor: type.color,
                        border:
                          type.id === "white"
                            ? "1.5px solid rgba(20,20,20,0.18)"
                            : undefined,
                      }}
                    >
                      {selected ? (
                        <Check
                          className="h-4 w-4 drop-shadow"
                          style={{
                            color: type.id === "white" ? "#141414" : "#FFFFFF",
                          }}
                          strokeWidth={3}
                        />
                      ) : null}
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        selected ? "text-[#BC7C10]" : "text-[#5c5346]"
                      }`}
                    >
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Black card → Gold / Silver only */}
            {isBlackCard ? (
              <div className="mt-5">
                <p className="mb-3 text-xs font-semibold text-[#5c5346]">
                  Finish color
                </p>
                <div className="flex flex-wrap items-start gap-6 sm:gap-8">
                  {METAL_MODES.map((mode) => {
                    const selected = cardMode === mode.id;
                    const swatchStyle =
                      mode.id === "gold"
                        ? { background: GOLD_GRADIENT }
                        : { background: SILVER_GRADIENT };
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => selectMetalMode(mode.id)}
                        aria-pressed={selected}
                        aria-label={mode.label}
                        className="flex flex-col items-center gap-2"
                      >
                        <span
                          className={`relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${
                            selected
                              ? "ring-2 ring-[#BC7C10] ring-offset-2 ring-offset-white"
                              : "ring-1 ring-black/10"
                          }`}
                          style={swatchStyle}
                        >
                          {selected ? (
                            <Check
                              className="h-4 w-4 text-white drop-shadow"
                              strokeWidth={3}
                            />
                          ) : null}
                        </span>
                        <span
                          className={`text-sm font-semibold ${
                            selected ? "text-[#BC7C10]" : "text-[#5c5346]"
                          }`}
                        >
                          {mode.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="mt-5">
                <p className="mb-3 text-xs font-semibold text-[#5c5346]">
                  Accent color
                </p>
                <p className="mb-3 text-xs text-[#5c5346]/75">
                  Applies to name, details, wifi & QR
                </p>
                <div className="flex flex-wrap gap-4">
                  {whiteCardAccents.map((swatch) => (
                    <button
                      key={swatch.color + swatch.label}
                      type="button"
                      onClick={() => setAccentColor(swatch.color)}
                      aria-pressed={accentColor === swatch.color}
                      aria-label={swatch.label}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <span
                        className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${
                          accentColor === swatch.color
                            ? "ring-2 ring-[#BC7C10] ring-offset-2 ring-offset-white"
                            : "ring-1 ring-black/10"
                        }`}
                        style={{
                          backgroundColor: swatch.color,
                          border:
                            // swatch.color === "#FFFFFF"
                            true
                              ? "1.5px solid rgba(20,20,20,0.18)"
                              : undefined,
                        }}
                      >
                        {accentColor === swatch.color ? (
                          <Check
                            className="h-3.5 w-3.5 drop-shadow"
                            style={{
                              color: readableTextColor(swatch.color),
                            }}
                            strokeWidth={3}
                          />
                        ) : null}
                      </span>
                      <span className="max-w-[4.5rem] text-center text-[10px] font-medium text-[#5c5346]">
                        {swatch.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

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
                  ? "Back side only · original colors · adjust below the card preview"
                  : `Back side only · tinted ${cardMode === "gold" ? "gold" : "silver"} · adjust below preview`
              }
            />
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,.png"
              onChange={handleLogoChange}
              className="sr-only"
            />
            <div className="mb-3 rounded-xl border border-[#BC7C10]/20 bg-[#FFFCF7] px-3.5 py-3 text-xs leading-relaxed text-[#5c5346]">
              <p className="font-semibold text-[#141414]">
                PNG only · transparent background recommended
              </p>
              <p className="mt-1">
                Upload a <span className="font-semibold text-[#141414]">.png</span>{" "}
                logo with a transparent background so it stays clear and sharp
                on both black and white cards.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#FFFCF7] px-5 py-2.5 text-sm font-semibold text-[#141414] transition-all hover:border-[#BC7C10]/35 hover:bg-white"
              >
                <Upload className="h-4 w-4 text-[#BC7C10]" />
                {logoUrl ? "Change logo" : "Upload PNG logo"}
              </button>
              {logoUrl ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setSide("back");
                      setLogoEditing(true);
                    }}
                    className="text-sm font-semibold text-[#BC7C10] underline-offset-2 hover:underline"
                  >
                    Adjust on back
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
            {logoError ? (
              <p
                role="alert"
                className="mt-3 text-sm font-medium text-red-600"
              >
                {logoError}
              </p>
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
