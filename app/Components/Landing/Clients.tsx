"use client";

import Image from "next/image";

const clients = [
  { name: "HDFC Life", logo: "/Images/clients/HDFCLife.png", large: true },
  { name: "Honda", logo: "/Images/clients/Honda.png", large: true },
  { name: "Hero", logo: "/Images/clients/Hero.png", large: true },
  { name: "TVS", logo: "/Images/clients/tvs.png", large: true },
  { name: "Sakal", logo: "/Images/clients/Sakal.png" },
  { name: "CA India", logo: "/Images/clients/CA_India.png" },
  { name: "Angel", logo: "/Images/clients/Angel.png", large: true },
  { name: "BBG", logo: "/Images/clients/BBG.png" },
  { name: "Desale", logo: "/Images/clients/Desale.png" },
  { name: "Yugen", logo: "/Images/clients/Yugen.png", large: true },
  { name: "Advocate", logo: "/Images/clients/Advocate.png" },
  { name: "Buzz", logo: "/Images/clients/buzz.png" },
  { name: "Royal", logo: "/Images/clients/royal.png" },
  { name: "Sowsvs", logo: "/Images/clients/sowsvs.png" },
] as const;

const marqueeItems = [...clients, ...clients];

export default function Clients() {
  return (
    <section
      aria-label="Trusted by companies"
      className="bg-[#FFFCF6] pt-8 pb-6 sm:pt-10 sm:pb-8"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="text-center text-xs font-bold tracking-[0.15em] text-[#BC7C10] uppercase sm:text-sm">
          Trusted by 500+ companies & 10,000+ professionals
        </p>
      </div>

      <div className="group relative mt-5 overflow-hidden sm:mt-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#FFFCF6] to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#FFFCF6] to-transparent sm:w-28" />

        <div className="clients-marquee flex w-max items-center gap-14 group-hover:[animation-play-state:paused] sm:gap-20">
          {marqueeItems.map((client, index) => {
            const isLarge = "large" in client && client.large;

            return (
              <div
                key={`${client.name}-${index}`}
                className={`flex shrink-0 items-center justify-center ${
                  isLarge ? "h-20 sm:h-28" : "h-16 sm:h-20"
                }`}
              >
                <Image
                  src={client.logo}
                  alt={`${client.name} logo`}
                  width={isLarge ? 280 : 200}
                  height={isLarge ? 112 : 80}
                  className={`w-auto object-contain opacity-90 ${
                    isLarge
                      ? "h-16 max-w-[220px] sm:h-24 sm:max-w-[280px]"
                      : "h-12 max-w-[160px] sm:h-16 sm:max-w-[200px]"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
