import { Star, Rocket, GraduationCap, Megaphone, MapPin } from "lucide-react";
import { testimonials } from "./data";

export default function Testimonials() {
  return (
    <section id="testimonials" className="scroll-mt-20 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <h2 className="text-center text-sm font-bold tracking-[0.15em] text-[#1a1a1a] uppercase">
          Loved by Thousands
        </h2>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((item) => (
            <li
              key={item.name}
              className="relative rounded-2xl border border-black/[0.06] bg-white p-5"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#BC7C10] text-sm font-bold text-white">
                  {item.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <div>
                  <p className="text-sm font-bold text-[#1a1a1a]">{item.name}</p>
                  <p className="text-xs text-[#a0a0a8]">{item.role}</p>
                </div>
              </div>

              <div className="mt-3 flex gap-0.5">
                {Array.from({ length: item.rating ?? 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-[#BC7C10] text-[#BC7C10]"
                  />
                ))}
              </div>

              <p className="mt-3 text-sm leading-relaxed text-[#4a4a52]">
                {item.quote}
              </p>

              <span className="absolute bottom-4 right-4 text-lg font-bold">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 text-center">
          
           <a href="#testimonials"
            className="text-sm font-semibold text-[#BC7C10] hover:text-[#9a650d]"
          >
            View All Reviews →
          </a>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1c1a17] to-[#0f0e0c] p-8 sm:p-10">
          {/* Subtle gold glow so the dark panel doesn't feel flat */}
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
          >
            <div className="absolute -top-1/2 right-0 h-full w-1/2 bg-[radial-gradient(ellipse_at_center,rgba(188,124,16,0.15),transparent_70%)] blur-2xl" />
          </div>

          <div className="relative grid items-center gap-8 lg:grid-cols-[auto_1fr_auto]">
            <div className="hidden h-40 w-56 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 lg:flex">
              <span className="text-xs text-white/40">
                Storefront illustration
              </span>
            </div>

            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-[#BC7C10] uppercase">
                Join Our Growing Family
              </p>
              <h3 className="mt-2 text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                Become a Franchise Partner
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-[#d8d2c6]">
                Low investment. High returns. Be a part of India&apos;s fastest
                growing digital networking brand.
              </p>
              
               <a href="#footer"
                className="mt-6 inline-flex rounded-lg bg-[#BC7C10] px-6 py-3 text-sm font-bold text-white shadow-md shadow-black/30 transition-transform active:scale-[0.98]"
              >
                Apply Now
              </a>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-2">
              {[
                { label: "Low Investment High Returns", Icon: Rocket },
                { label: "Complete Training & Support", Icon: GraduationCap },
                { label: "Marketing Support", Icon: Megaphone },
                { label: "Pan India Opportunity", Icon: MapPin },
              ].map(({ label, Icon }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#BC7C10]/30 text-[#BC7C10]">
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <span className="text-[11px] font-medium leading-tight text-white/80">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}