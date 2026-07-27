export type ProductMedia =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; thumbnail: string; youtubeId: string; alt: string };

export type ProductFinish = { name: string; hint: string };

export type CatalogProduct = {
  id: string;
  category: string;
  title: string;
  shortTitle: string;
  description: string;
  price: number;
  compareAtPrice: number;
  media: ProductMedia[];
  highlights: string[];
  finishes: ProductFinish[];
  included: string[];
  ctaLabel: string;
  ctaHref: string;
  designable: boolean;
};

const sharedCardHighlights = [
  "One-time payment — no monthly fees",
  "Works on iPhone & Android — no app needed",
  "One card, one profile, unlimited shares",
  "Free design mockup before you pay",
];

const sharedCardIncluded = [
  "Physical NFC + QR Hexa Card",
  "Lifetime digital profile",
  "Free design assistance on WhatsApp",
  "Print after your approval only",
  "Packaging ready to gift or carry",
];

const nfcMedia: ProductMedia[] = [
  {
    type: "image",
    src: "/Images/Products/digitalCard.jpg",
    alt: "HexaCards NFC digital business card",
  },
  {
    type: "image",
    src: "/Images/Products/productd1.jpg",
    alt: "HexaCards product detail 1",
  },
  {
    type: "image",
    src: "/Images/Products/productd2.jpg",
    alt: "HexaCards product detail 2",
  },
  {
    type: "image",
    src: "/Images/Products/productd3.jpg",
    alt: "HexaCards product detail 3",
  },
  {
    type: "image",
    src: "/Images/Products/productd4.jpg",
    alt: "HexaCards product detail 4",
  },
];

export const productCatalog: Record<string, CatalogProduct> = {
  "nfc-business-card": {
    id: "nfc-business-card",
    category: "Digital Business Card",
    title: "NFC Business Card — Hexa Digital Card",
    shortTitle: "Hexa NFC Business Card",
    description:
      "Share contacts, socials, and your brand with one tap or QR scan. Premium print finishes, lifetime digital profile, and free design help from HexaCards.",
    price: 799,
    compareAtPrice: 2199,
    media: nfcMedia,
    highlights: sharedCardHighlights,
    finishes: [
      { name: "Black · Gold", hint: "Classic foil on matte black" },
      { name: "Black · Silver", hint: "Chrome foil on matte black" },
      { name: "White · Custom", hint: "Accent colors you choose" },
    ],
    included: sharedCardIncluded,
    ctaLabel: "Design Your Card",
    ctaHref: "/design-your-card#card-studio",
    designable: true,
  },
  "metal-card": {
    id: "metal-card",
    category: "Digital Business Card",
    title: "Metal NFC Business Card",
    shortTitle: "Metal Card",
    description:
      "Premium metal NFC card with engraved finish — built to feel substantial in every handshake and last for years.",
    price: 2399,
    compareAtPrice: 2899,
    media: [
      {
        type: "image",
        src: "/Images/Products/productd4.jpg",
        alt: "Hexa metal NFC business card",
      },
      {
        type: "image",
        src: "/Images/Products/digitalCard.jpg",
        alt: "Hexa digital business card",
      },
      {
        type: "image",
        src: "/Images/Products/productd1.jpg",
        alt: "Hexa card detail",
      },
    ],
    highlights: [
      "Solid metal body with premium engraving",
      "NFC + QR — works on iPhone & Android",
      "Lifetime digital profile included",
      "Free design mockup before you pay",
    ],
    finishes: [
      { name: "Black Metal · Gold", hint: "Gold engraving on black metal" },
      { name: "Silver Metal", hint: "Brushed silver finish" },
      { name: "Custom Engrave", hint: "Logo & name engraved" },
    ],
    included: [
      "Physical metal NFC + QR card",
      "Lifetime digital profile",
      "Free design assistance on WhatsApp",
      "Protective sleeve packaging",
    ],
    ctaLabel: "Design Your Card",
    ctaHref: "/design-your-card#card-studio",
    designable: true,
  },
  "pvc-card": {
    id: "pvc-card",
    category: "Digital Business Card",
    title: "PVC NFC Business Card",
    shortTitle: "PVC Card",
    description:
      "Durable PVC NFC card with crisp print quality — ideal for teams, events, and everyday networking.",
    price: 1599,
    compareAtPrice: 2000,
    media: [
      {
        type: "image",
        src: "/Images/Products/productd1.jpg",
        alt: "Hexa PVC NFC business card",
      },
      {
        type: "image",
        src: "/Images/Products/productd2.jpg",
        alt: "PVC card detail",
      },
      {
        type: "image",
        src: "/Images/Products/digitalCard.jpg",
        alt: "Hexa digital card",
      },
    ],
    highlights: [
      "Premium PVC with sharp full-color print",
      "NFC + QR — no app required",
      "Great for bulk / team orders",
      "Free design mockup before you pay",
    ],
    finishes: [
      { name: "White PVC", hint: "Clean full-color print" },
      { name: "Silver PVC", hint: "Metallic silver look" },
      { name: "Marble PVC", hint: "Black marble finish" },
    ],
    included: sharedCardIncluded,
    ctaLabel: "Design Your Card",
    ctaHref: "/design-your-card#card-studio",
    designable: true,
  },
  "wooden-card": {
    id: "wooden-card",
    category: "Digital Business Card",
    title: "Wooden NFC Business Card",
    shortTitle: "Wooden Card",
    description:
      "Eco-friendly wooden NFC card with natural grain — a warm, memorable way to share your digital profile.",
    price: 1899,
    compareAtPrice: 2499,
    media: [
      {
        type: "image",
        src: "/Images/Products/productd3.jpg",
        alt: "Hexa wooden NFC business card",
      },
      {
        type: "image",
        src: "/Images/Products/digitalCard.jpg",
        alt: "Hexa digital card",
      },
      {
        type: "image",
        src: "/Images/Products/productd2.jpg",
        alt: "Card detail",
      },
    ],
    highlights: [
      "Natural wood finish — eco-friendly feel",
      "NFC + QR programmed for your profile",
      "Lifetime digital profile included",
      "Free design mockup before you pay",
    ],
    finishes: [
      { name: "Natural Wood", hint: "Visible grain, laser engrave" },
      { name: "Dark Wood", hint: "Deep tone with contrast mark" },
      { name: "Custom Engrave", hint: "Logo & name engraved" },
    ],
    included: [
      "Physical wooden NFC + QR card",
      "Lifetime digital profile",
      "Free design assistance on WhatsApp",
      "Eco-friendly packaging",
    ],
    ctaLabel: "Design Your Card",
    ctaHref: "/design-your-card#card-studio",
    designable: true,
  },
  "digital-profile-qr": {
    id: "digital-profile-qr",
    category: "Digital Business Card",
    title: "Digital Profile + QR",
    shortTitle: "Digital Profile + QR",
    description:
      "Print-ready QR that opens your profile instantly. No app, no friction, works on every phone.",
    price: 499,
    compareAtPrice: 999,
    media: [
      {
        type: "image",
        src: "/Images/Products/digitalQR.jpg",
        alt: "Hexa digital profile QR card",
      },
      {
        type: "image",
        src: "/Images/Products/digitalCard.jpg",
        alt: "Hexa digital business card",
      },
      {
        type: "image",
        src: "/Images/Products/productd1.jpg",
        alt: "Hexa card detail",
      },
    ],
    highlights: [
      "QR opens your profile in any phone camera",
      "No app download required",
      "Update your links anytime online",
      "Free design mockup before you pay",
    ],
    finishes: [
      { name: "White · Custom", hint: "Full-color print with your brand" },
      { name: "Black · Gold QR", hint: "Premium contrast finish" },
      { name: "Matte PVC", hint: "Durable everyday card" },
    ],
    included: [
      "Printed QR profile card",
      "Lifetime digital profile link",
      "Free design assistance on WhatsApp",
      "Ready-to-hand packaging",
    ],
    ctaLabel: "Design Your Card",
    ctaHref: "/design-your-card#card-studio",
    designable: true,
  },
  "social-media-cards": {
    id: "social-media-cards",
    category: "For Reviews",
    title: "Google Review Cards",
    shortTitle: "Google Review Cards",
    description:
      "Hand customers a card that opens your Google review page in one tap or scan — also available for Instagram and YouTube.",
    price: 799,
    compareAtPrice: 799,
    media: [
      {
        type: "image",
        src: "/Images/Products/googleReview.jpg",
        alt: "Hexa Google review card",
      },
      {
        type: "image",
        src: "/Images/Products/Googlecard1.jpg",
        alt: "Hexa Google review NFC card",
      },
      {
        type: "image",
        src: "/Images/Products/Googlecard2.jpg",
        alt: "Hexa Google review NFC card — alternate view",
      },
      {
        type: "image",
        src: "/Images/Products/Instacard1.jpg",
        alt: "Hexa Instagram NFC card",
      },
      {
        type: "image",
        src: "/Images/Products/Instacard2.jpg",
        alt: "Hexa Instagram NFC card — alternate view",
      },
      {
        type: "image",
        src: "/Images/Products/Youtubecard1.jpg",
        alt: "Hexa YouTube NFC card",
      },
      {
        type: "image",
        src: "/Images/Products/Youtubecard2.jpg",
        alt: "Hexa YouTube NFC card — alternate view",
      },
    ],
    highlights: [
      "Opens Instagram, Google, or YouTube instantly",
      "NFC + QR — works on every smartphone",
      "Perfect for shops, salons & creators",
      "Custom branding with your business name",
    ],
    finishes: [
      { name: "Google Reviews", hint: "Review Us on Google design" },
      { name: "Instagram", hint: "@handle & brand colors" },
      { name: "YouTube", hint: "Channel link on card" },
    ],
    included: [
      "Printed social media NFC / QR cards",
      "Your profile or review link programmed",
      "Free design assistance on WhatsApp",
      "Ready-to-hand packaging",
    ],
    ctaLabel: "Order Review Cards",
    ctaHref: "/checkout",
    designable: false,
  },
  "google-reviews": {
    id: "google-reviews",
    category: "For Reviews",
    title: "Google Review Cards",
    shortTitle: "Google Reviews",
    description:
      "Hand customers a card that opens your Google review page in one tap or scan — grow ratings without awkward asks.",
    price: 799,
    compareAtPrice: 799,
    media: [
      {
        type: "image",
        src: "/Images/Products/googleReview.jpg",
        alt: "Hexa Google review card",
      },
      {
        type: "image",
        src: "/Images/Products/Googlecard1.jpg",
        alt: "Hexa Google review NFC card",
      },
      {
        type: "image",
        src: "/Images/Products/Googlecard2.jpg",
        alt: "Hexa Google review NFC card — alternate view",
      },
      {
        type: "image",
        src: "/Images/Products/Instacard1.jpg",
        alt: "Hexa Instagram NFC card",
      },
      {
        type: "image",
        src: "/Images/Products/Instacard2.jpg",
        alt: "Hexa Instagram NFC card — alternate view",
      },
      {
        type: "image",
        src: "/Images/Products/Youtubecard1.jpg",
        alt: "Hexa YouTube NFC card",
      },
      {
        type: "image",
        src: "/Images/Products/Youtubecard2.jpg",
        alt: "Hexa YouTube NFC card — alternate view",
      },
    ],
    highlights: [
      "Opens your Google review page instantly",
      "NFC + QR — works on every phone",
      "Perfect for clinics, shops & restaurants",
      "Custom branding with your business name",
    ],
    finishes: [
      { name: "Google Reviews", hint: "Review Us on Google design" },
      { name: "Instagram", hint: "@handle & brand colors" },
      { name: "YouTube", hint: "Channel link on card" },
    ],
    included: [
      "Printed Google review NFC/QR cards",
      "Your Google review link programmed",
      "Free design assistance on WhatsApp",
      "Ready-to-hand packaging",
    ],
    ctaLabel: "Order Review Cards",
    ctaHref: "/checkout",
    designable: false,
  },
  "review-stand": {
    id: "review-stand",
    category: "For Reviews",
    title: "Google Review Standee",
    shortTitle: "Google Review Standy",
    description:
      "Countertop standee for your desk or counter — customers scan and leave a Google review on autopilot.",
    price: 699,
    compareAtPrice: 1299,
    media: [
      {
        type: "image",
        src: "/Images/Products/reviewStandy.jpg",
        alt: "Hexa Google review standee",
      },
      {
        type: "image",
        src: "/Images/Products/googleStandy1.jpg",
        alt: "Hexa Google review standee — detail",
      },
      {
        type: "image",
        src: "/Images/Products/googleStandy2.jpg",
        alt: "Hexa Google review standee — alternate view",
      },
      {
        type: "image",
        src: "/Images/Products/InstaStandy1.jpg",
        alt: "Hexa Instagram standee",
      },
      {
        type: "image",
        src: "/Images/Products/InstaStandy2.jpeg",
        alt: "Hexa Instagram standee — alternate view",
      },
      {
        type: "image",
        src: "/Images/Products/InstaStandy3.jpeg",
        alt: "Hexa Instagram standee — detail",
      },
    ],
    highlights: [
      "Desk / counter standee with QR + NFC",
      "Opens Google reviews in one scan",
      "Always-on review collection at checkout",
      "Custom branding for your business",
    ],
    finishes: [
      { name: "Google Standy", hint: "Collect Google reviews on autopilot" },
      { name: "Instagram Standy", hint: "Grow followers from your counter" },
      { name: "Durable Board", hint: "Everyday shop use" },
    ],
    included: [
      "Printed review standee",
      "Your Google review link / NFC programmed",
      "Free design assistance on WhatsApp",
      "Ready-to-place packaging",
    ],
    ctaLabel: "Order Review Stand",
    ctaHref: "/checkout",
    designable: false,
  },
  "review-keychain-qr": {
    id: "review-keychain-qr",
    category: "For Reviews",
    title: "Review Keychain QR",
    shortTitle: "Review Keychain QR",
    description:
      "Carry your review link on a keychain — customers tap NFC or scan the QR to leave a Google review in seconds.",
    price: 299,
    compareAtPrice: 599,
    media: [
      {
        type: "image",
        src: "/Images/Products/kitchen.webp",
        alt: "Hexa Review Keychain QR — front and back",
      },
      {
        type: "image",
        src: "/Images/Products/googleReview.jpg",
        alt: "Hexa Google review card",
      },
      {
        type: "image",
        src: "/Images/Products/QR.png",
        alt: "Hexa QR detail",
      },
    ],
    highlights: [
      "NFC + QR keychain — tap or scan anywhere",
      "Opens your Google review page instantly",
      "Fits on keys, bags & lanyards",
      "Custom branding with your business name",
    ],
    finishes: [
      { name: "Black · Gloss", hint: "Premium domed acrylic disc" },
      { name: "Silver Hardware", hint: "Durable clasp & rings" },
      { name: "Custom Print", hint: "Your logo or brand mark" },
    ],
    included: [
      "NFC + QR review keychain",
      "Your Google review link programmed",
      "Free design assistance on WhatsApp",
      "Ready-to-gift packaging",
    ],
    ctaLabel: "Order Keychain",
    ctaHref: "/checkout",
    designable: false,
  },
};

export type CardProductId =
  | "nfc-business-card"
  | "metal-card"
  | "pvc-card"
  | "wooden-card";

export type ReviewProductId =
  | "google-reviews"
  | "review-stand"
  | "review-keychain-qr";

export function getProduct(id: string): CatalogProduct {
  const product = productCatalog[id];
  if (!product) {
    return productCatalog["nfc-business-card"];
  }
  return product;
}
