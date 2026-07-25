"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Info,
  ArrowLeft,
} from "lucide-react";

type CartItem = {
  id: string;
  title: string;
  image: string;
  price: number;
  qty: number;
};

type DeliveryOption = "standard" | "express";

type SavedDesign = {
  title?: string;
  subTitle?: string;
  moreDetails?: string;
  cardBody?: string;
  cardMode?: string;
  accentColor?: string;
  hasLogo?: boolean;
};

const DEFAULT_CART: CartItem[] = [
  {
    id: "hexa-nfc-card",
    title: "Hexa NFC Business Card",
    image: "/Images/Products/digitalCard.jpg",
    price: 799,
    qty: 1,
  },
];

const EXPRESS_FEE = 99;

const PROMO_CODES: Record<string, { label: string; percentOff: number }> = {
  WELCOME10: { label: "WELCOME10", percentOff: 10 },
};

function currency(amount: number) {
  return `₹${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export default function Checkout() {
  const [design, setDesign] = useState<SavedDesign | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "IN",
  });
  const [sameBilling, setSameBilling] = useState(true);
  const [deliveryOption, setDeliveryOption] =
    useState<DeliveryOption>("standard");
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    label: string;
    percentOff: number;
  } | null>(null);
  const [couponMessage, setCouponMessage] = useState<{
    text: string;
    ok: boolean;
  } | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("hexaCardDesign");
      if (!raw) return;
      setDesign(JSON.parse(raw) as SavedDesign);
    } catch {
      // ignore
    }
  }, []);

  const cartItems = useMemo(() => {
    const name = design?.title?.trim();
    if (!name) return DEFAULT_CART;
    return [
      {
        ...DEFAULT_CART[0],
        title: `Hexa NFC Card — ${name}`,
      },
    ];
  }, [design]);

  function updateField<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cartItems],
  );

  const deliveryFee = deliveryOption === "express" ? EXPRESS_FEE : 0;

  const discountAmount = appliedCoupon
    ? Math.round(subtotal * (appliedCoupon.percentOff / 100))
    : 0;

  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  function handleApplyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    const match = PROMO_CODES[code];
    if (match) {
      setAppliedCoupon(match);
      setCouponMessage({
        text: `"${match.label}" applied — ${match.percentOff}% off`,
        ok: true,
      });
    } else {
      setAppliedCoupon(null);
      setCouponMessage({
        text: "That code isn't valid or has expired.",
        ok: false,
      });
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreedToTerms) return;
    setIsSubmitting(true);

    console.log("Submitting order:", {
      form,
      sameBilling,
      deliveryOption,
      appliedCoupon,
      subtotal,
      discountAmount,
      deliveryFee,
      total,
      design,
    });

    setIsSubmitting(false);
  }

  const finishLabel = design
    ? design.cardBody === "white"
      ? `White card · ${design.accentColor ?? "custom"} accent`
      : `Black card · ${design.cardMode ?? "gold"} finish`
    : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link
          href="/design-your-card#card-studio"
          className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-[#141414] transition-colors hover:border-[#BC7C10]/35 hover:text-[#BC7C10]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to design
        </Link>
      </div>

      <div className="mb-8 text-center">
        <p className="text-xs font-bold tracking-[0.14em] text-[#BC7C10] uppercase">
          Order
        </p>
        <h1 className="mt-1 text-3xl font-bold text-[#141414]">Checkout</h1>
        <p className="mt-1 text-[#5c5346]">
          Complete your Hexa card order in a few steps
        </p>
      </div>

      {design ? (
        <div className="mb-6 rounded-2xl border border-[#BC7C10]/20 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-xs font-bold tracking-wide text-[#BC7C10] uppercase">
            Your card design
          </p>
          <div className="mt-2 grid gap-1 text-sm text-[#5c5346] sm:grid-cols-2">
            <p>
              <span className="font-semibold text-[#141414]">Name:</span>{" "}
              {design.title?.trim() || "—"}
            </p>
            <p>
              <span className="font-semibold text-[#141414]">Subtitle:</span>{" "}
              {design.subTitle?.trim() || "—"}
            </p>
            <p>
              <span className="font-semibold text-[#141414]">Finish:</span>{" "}
              {finishLabel}
            </p>
            <p>
              <span className="font-semibold text-[#141414]">Logo:</span>{" "}
              {design.hasLogo ? "Uploaded" : "Not uploaded"}
            </p>
          </div>
        </div>
      ) : null}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold text-[#141414]">
                Contact Information
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="first-name"
                    className="mb-2 block text-sm font-medium text-[#5c5346]"
                  >
                    First Name *
                  </label>
                  <input
                    id="first-name"
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-[#FFFCF7] px-4 py-3 transition-colors focus:border-[#BC7C10]/50 focus:bg-white focus:ring-2 focus:ring-[#BC7C10]/15 focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="mb-2 block text-sm font-medium text-[#5c5346]"
                  >
                    Last Name *
                  </label>
                  <input
                    id="last-name"
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-[#FFFCF7] px-4 py-3 transition-colors focus:border-[#BC7C10]/50 focus:bg-white focus:ring-2 focus:ring-[#BC7C10]/15 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#5c5346]"
                >
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-[#FFFCF7] px-4 py-3 transition-colors focus:border-[#BC7C10]/50 focus:bg-white focus:ring-2 focus:ring-[#BC7C10]/15 focus:outline-none"
                />
              </div>

              <div className="mt-4">
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-[#5c5346]"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-[#FFFCF7] px-4 py-3 transition-colors focus:border-[#BC7C10]/50 focus:bg-white focus:ring-2 focus:ring-[#BC7C10]/15 focus:outline-none"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold text-[#141414]">
                Shipping Address
              </h2>

              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-medium text-[#5c5346]"
                >
                  Address *
                </label>
                <input
                  id="address"
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-[#FFFCF7] px-4 py-3 transition-colors focus:border-[#BC7C10]/50 focus:bg-white focus:ring-2 focus:ring-[#BC7C10]/15 focus:outline-none"
                />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-medium text-[#5c5346]"
                  >
                    City *
                  </label>
                  <input
                    id="city"
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-[#FFFCF7] px-4 py-3 transition-colors focus:border-[#BC7C10]/50 focus:bg-white focus:ring-2 focus:ring-[#BC7C10]/15 focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="postal"
                    className="mb-2 block text-sm font-medium text-[#5c5346]"
                  >
                    PIN Code *
                  </label>
                  <input
                    id="postal"
                    type="text"
                    required
                    value={form.postalCode}
                    onChange={(e) => updateField("postalCode", e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-[#FFFCF7] px-4 py-3 transition-colors focus:border-[#BC7C10]/50 focus:bg-white focus:ring-2 focus:ring-[#BC7C10]/15 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="country"
                  className="mb-2 block text-sm font-medium text-[#5c5346]"
                >
                  Country *
                </label>
                <select
                  id="country"
                  required
                  value={form.country}
                  onChange={(e) => updateField("country", e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-[#FFFCF7] px-4 py-3 transition-colors focus:border-[#BC7C10]/50 focus:bg-white focus:ring-2 focus:ring-[#BC7C10]/15 focus:outline-none"
                >
                  <option value="IN">India</option>
                  <option value="AE">United Arab Emirates</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                </select>
              </div>

              <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-[#5c5346]">
                <input
                  type="checkbox"
                  checked={sameBilling}
                  onChange={(e) => setSameBilling(e.target.checked)}
                  className="rounded border-black/20 text-[#BC7C10] focus:ring-[#BC7C10]"
                />
                Billing address same as shipping
              </label>
            </div>

            <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm">
              <h2 className="mb-2 flex items-center gap-2 text-xl font-semibold text-[#141414]">
                <CreditCard className="h-5 w-5 text-[#BC7C10]" />
                Payment Method
              </h2>
              <p className="text-sm text-[#5c5346]">
                Payment integration coming next. Your design & order details are
                saved — complete the form to continue.
              </p>
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#FFFCF7] p-3 text-sm text-[#5c5346] ring-1 ring-black/[0.04]">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#BC7C10]" />
                Your card data is never stored on our servers. Secure checkout
                will use an encrypted payment provider.
              </div>
            </div>
          </div>

          <div>
            <div className="sticky top-28 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#141414]">
                Order Summary
              </h3>

              <div className="mt-4 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#FFFCF7] ring-1 ring-black/[0.04]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="64px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#141414]">
                        {item.title}
                      </p>
                      <p className="text-xs text-[#5c5346]">Qty {item.qty}</p>
                      <p className="mt-1 text-sm font-bold text-[#141414]">
                        {currency(item.price * item.qty)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-2">
                <p className="text-sm font-semibold text-[#141414]">Delivery</p>
                <label className="flex cursor-pointer items-center space-x-3 rounded-lg border border-black/10 p-3 transition-colors hover:border-[#BC7C10]/30">
                  <input
                    type="radio"
                    name="delivery_option"
                    value="standard"
                    checked={deliveryOption === "standard"}
                    onChange={() => setDeliveryOption("standard")}
                    className="text-[#BC7C10] focus:ring-[#BC7C10]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#141414]">
                        Standard Delivery
                      </span>
                      <span className="text-sm font-medium text-green-700">
                        Free
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#5c5346]">
                      3–5 business days
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-center space-x-3 rounded-lg border border-black/10 p-3 transition-colors hover:border-[#BC7C10]/30">
                  <input
                    type="radio"
                    name="delivery_option"
                    value="express"
                    checked={deliveryOption === "express"}
                    onChange={() => setDeliveryOption("express")}
                    className="text-[#BC7C10] focus:ring-[#BC7C10]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#141414]">
                        Express Delivery
                      </span>
                      <span className="text-sm font-medium text-[#BC7C10]">
                        {currency(EXPRESS_FEE)}
                      </span>
                    </div>
                    <p className="mt-1 flex items-center text-xs text-[#5c5346]">
                      1–2 business days
                      <span className="group relative ml-1.5 inline-flex items-center">
                        <Info className="h-3.5 w-3.5 cursor-help text-[#5c5346]/60" />
                        <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-48 -translate-x-1/2 rounded-md bg-[#141414] p-2 text-center text-[10px] leading-tight text-white opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
                          Subject to design approval for customised products.
                        </span>
                      </span>
                    </p>
                  </div>
                </label>
              </div>

              <div className="mt-4 space-y-3 border-t border-black/[0.06] pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#5c5346]">Subtotal</span>
                  <span className="font-medium">{currency(subtotal)}</span>
                </div>

                {appliedCoupon ? (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5c5346]">
                      Discount{" "}
                      <span className="ml-1 rounded bg-green-100 px-1 text-xs text-green-800">
                        {appliedCoupon.label}
                      </span>
                    </span>
                    <span className="font-medium text-green-700">
                      -{currency(discountAmount)}
                    </span>
                  </div>
                ) : null}

                <div className="flex justify-between text-sm">
                  <span className="text-[#5c5346]">Delivery</span>
                  <span
                    className={`font-medium ${
                      deliveryFee === 0 ? "text-green-700" : "text-[#141414]"
                    }`}
                  >
                    {deliveryFee === 0 ? "Free" : currency(deliveryFee)}
                  </span>
                </div>

                <div className="border-t border-black/[0.06] pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{currency(total)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Promo code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 rounded-xl border border-black/10 bg-[#FFFCF7] px-3 py-2.5 text-sm focus:border-[#BC7C10]/50 focus:bg-white focus:ring-2 focus:ring-[#BC7C10]/15 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="rounded-xl border border-black/10 px-4 py-2.5 text-sm font-semibold text-[#141414] transition-colors hover:border-[#BC7C10]/35 hover:text-[#BC7C10]"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage ? (
                  <p
                    className={`mt-2 text-xs ${
                      couponMessage.ok ? "text-green-700" : "text-red-600"
                    }`}
                  >
                    {couponMessage.text}
                  </p>
                ) : null}
              </div>

              <label className="mt-5 flex cursor-pointer items-start gap-2 text-xs text-[#5c5346]">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded border-black/20 text-[#BC7C10] focus:ring-[#BC7C10]"
                />
                I agree to the terms of sale and privacy policy.
              </label>

              <button
                type="submit"
                disabled={!agreedToTerms || isSubmitting}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#BC7C10] py-3.5 text-sm font-bold text-white shadow-md shadow-[#BC7C10]/25 transition-all hover:bg-[#9a650d] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  "Processing…"
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Place Order · {currency(total)}
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-[11px] text-[#5c5346]">
                Secure Checkout · HexaCards
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
