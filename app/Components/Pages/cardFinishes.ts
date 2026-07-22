import { GOLD_CARD } from "./goldCard";
import { SILVER_CARD } from "./silverCard";

export { GOLD_CARD } from "./goldCard";
export { SILVER_CARD } from "./silverCard";

export type CardMode = "gold" | "silver" | "customize";

export const CARD_MODES: {
  id: CardMode;
  label: string;
  hint: string;
}[] = [
  { id: "gold", label: "Gold", hint: GOLD_CARD.description },
  { id: "silver", label: "Silver", hint: SILVER_CARD.description },
  {
    id: "customize",
    label: "Customize",
    hint: "Black/white body · auto text contrast · pick wifi & QR accents",
  },
];

export function getMetalPreset(mode: "gold" | "silver") {
  return mode === "gold" ? GOLD_CARD : SILVER_CARD;
}
