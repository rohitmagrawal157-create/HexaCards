"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Feature from "./Feature";

type Product = {
  title: string;
  description: string;
  image: string;
  href: string;
};

const products: Product[] = [
  {
    title: "Digital Profile + QR",
    description:
      "Your full digital identity on NFC and QR — share contacts, links, and leads in one tap.",
    image: "/Images/Products/digitalCard.png",
    href: "#digital-profile",
  },
  {
    title: "QR Code",
    description:
      "Print-ready QR that opens your profile instantly. No app, no friction, works on every phone.",
    image: "/Images/Products/QR.png",
    href: "#qr-code",
  },
  {
    title: "Google Review Cards",
    description:
      "Hand customers a card that opens your Google review page in one tap or scan.",
    image: "/Images/Products/googleReview.png",
    href: "#google-review-cards",
  },
  {
    title: "Review Stand",
    description:
      "Countertop standee for your desk or counter — collect Google reviews on autopilot.",
    image: "/Images/Products/reviewStandy.png",
    href: "#review-stand",
  },
];

function RevealHeading() {
  const words: { text: string; gradient?: boolean; lineBreak?: boolean }[] = [
    { text: "Four", gradient: true },
    { text: "products." },
    { text: "One", gradient: true },
    { text: "tap", lineBreak: true },
    { text: "to", gradient: true },
    { text: "grow" },
    { text: "your", gradient: true },
    { text: "business." },
  ];

  return (
    <h2 className="text-4xl font-bold leading-tight text-[#141414] sm:text-5xl">
      {words.map((word, i) => (
        <span key={i}>
          <span
            className={`inline-block animate-[revealUp_0.6s_ease-out_both] ${
              word.gradient ? "text-[#BC7C10]" : "text-[#141414]"
            }`}
            style={{ animationDelay: `${150 + i * 90}ms` }}
          >
            {word.text}
          </span>{" "}
          {word.lineBreak ? <br /> : null}
        </span>
      ))}
    </h2>
  );
}

function RevealSubtext() {
  const words = [
    "Digital",
    "profile,",
    "QR,",
    "review",
    "cards,",
    "and",
    "stands",
    "—",
    "built",
    "to",
    "connect",
    "and",
    "convert.",
  ];

  return (
    <p className="mt-3 text-lg text-[#7a7a82]">
      {words.map((word, i) => (
        <span
          key={i}
          className="mr-1.5 inline-block animate-[revealUp_0.5s_ease-out_both]"
          style={{ animationDelay: `${800 + i * 60}ms` }}
        >
          {word}
        </span>
      ))}
    </p>
  );
}

function ProductCard({ item }: { item: Product }) {
  return (
    <a
      href={item.href}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BC7C10] focus-visible:ring-offset-2"
    >
      <div className="relative mx-2 mt-2 aspect-[4/5] overflow-hidden rounded-2xl bg-[#FBF3E4] sm:aspect-square sm:mx-2.5 sm:mt-2.5">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 48vw, (max-width: 1024px) 45vw, 25vw"
          className="object-contain p-2.5 transition-transform duration-500 ease-out group-hover:scale-105 sm:p-4 lg:p-5"
        />
      </div>

      <div className="flex flex-1 flex-col px-3 pt-3 pb-4 sm:px-4 sm:pt-4 sm:pb-5">
        <h3 className="text-[13px] leading-snug font-semibold text-[#141414] sm:text-base lg:text-lg">
          {item.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-[#5c5346] sm:mt-2 sm:line-clamp-3 sm:text-sm">
          {item.description}
        </p>
      </div>
    </a>
  );
}

function ProductsGrid() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="mx-auto max-w-7xl px-5 sm:px-8">
      <div className="mx-auto mb-8 max-w-2xl text-center lg:mb-10">
        <p className="mb-3 text-xs font-bold tracking-[0.15em] text-[#BC7C10] uppercase sm:text-sm">
          Products
        </p>
        {hasAnimated ? (
          <>
            <RevealHeading />
            <RevealSubtext />
          </>
        ) : (
          <div className="min-h-[5.5rem] sm:min-h-[6rem]" aria-hidden />
        )}
      </div>

      <ul className="grid list-none grid-cols-2 gap-3 p-0 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        {products.map((item) => (
          <li key={item.title}>
            <ProductCard item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Products() {
  return (
    <>
      <section
        id="products"
        className="scroll-mt-20 bg-white pt-8 pb-14 sm:pt-10 sm:pb-16"
      >
        <ProductsGrid />
      </section>

      <Feature />
    </>
  );
}
