export { default as BasicLayout } from "./BasicLayout";
export type { BasicHeaderProps } from "./BasicLayout";
export { default as Basic } from "./Basic";
export { default as PhoneFrame } from "./PhoneFrame";
export { default as LayoutPhonePreview } from "./LayoutPhonePreview";

/** Six card layouts — Classic & Basic are live; others coming soon */
export const CARD_LAYOUTS = [
  {
    id: "classic",
    label: "Classic",
    description: "Centered avatar under the banner",
    available: true,
  },
  {
    id: "basic",
    label: "Basic",
    description: "Centered avatar with quick-action icons",
    available: true,
  },
  // {
  //   id: "modern",
  //   label: "Modern",
  //   description: "Coming soon",
  //   available: false,
  // },
  // {
  //   id: "compact",
  //   label: "Compact",
  //   description: "Coming soon",
  //   available: false,
  // },
  // {
  //   id: "bold",
  //   label: "Bold",
  //   description: "Coming soon",
  //   available: false,
  // },
  // {
  //   id: "elegant",
  //   label: "Elegant",
  //   description: "Coming soon",
  //   available: false,
  // },
] as const;

export type CardLayoutId = (typeof CARD_LAYOUTS)[number]["id"];

export function isCardLayoutId(
  value: string | null | undefined,
): value is CardLayoutId {
  return CARD_LAYOUTS.some((l) => l.id === value);
}

export function isAvailableLayoutId(
  value: string | null | undefined,
): value is CardLayoutId {
  return CARD_LAYOUTS.some((l) => l.available && l.id === value);
}

export function normalizeCardLayout(
  value: string | null | undefined,
): CardLayoutId {
  if (isAvailableLayoutId(value)) return value;
  return "classic";
}
