import { Star, Rocket, Megaphone, MapPin, GraduationCap } from "lucide-react";
import { testimonials } from "./data";
import {
  // Building2,
  // Stethoscope,
  // Scale,
  // Landmark,
  // Sparkles,
  // Hotel,
  // Factory,
  // Briefcase,
  Users,
  Check,
  LayoutDashboard,
  UserRound,
  CreditCard,
  Target,
  BarChart3,
  Settings,
  Receipt,
  LifeBuoy,
  Info,
  MessageSquare,
  Globe,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";


const sidebarNav = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Users", icon: UserRound },
  { label: "Cards", icon: CreditCard },
  { label: "Leads", icon: Target },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings },
  { label: "Billing", icon: Receipt },
  { label: "Support", icon: LifeBuoy },
];

const stats = [
  { label: "Total Users", value: "256", Icon: Users },
  { label: "Profile Views", value: "15,632", Icon: Globe },
  { label: "Leads Collected", value: "1,256", Icon: MessageSquare },
  { label: "QR Scans", value: "8,865", Icon: ShoppingBag },
];

const topPerformers = [
  { name: "Rohit Sharma", role: "Sales Manager", value: "1,296" },
  { name: "Priya Mehta", role: "Marketing Lead", value: "1,135" },
  { name: "Ankit Verma", role: "Field Executive", value: "980" },
  { name: "Neha Singh", role: "HR Manager", value: "875" },
];

const chartPoints = [40, 65, 35, 70, 45, 80, 50, 90, 60, 100, 75, 95];

export default function Testimonials() {
  return (
    <section id="testimonials" className="scroll-mt-20 bg-white py-16 sm:py-20">
        {/* Enterprise solution panel */}
        <section className="bg-white pb-20 sm:pb-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c1a17] via-[#141210] to-[#0f0e0c] shadow-2xl shadow-black/25 lg:flex">
            {/* Soft gold glow — same family as franchise banner */}
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <div className="absolute -top-1/3 right-0 h-[80%] w-[55%] bg-[radial-gradient(ellipse_at_center,rgba(188,124,16,0.18),transparent_70%)] blur-2xl" />
              <div className="absolute bottom-0 left-0 h-1/2 w-1/3 bg-[radial-gradient(ellipse_at_center,rgba(188,124,16,0.08),transparent_70%)] blur-2xl" />
            </div>

            {/* Left: copy */}
            <div className="relative z-10 p-8 sm:p-10 lg:w-[42%] lg:shrink-0">
              <p className="text-xs font-bold tracking-[0.2em] text-[#BC7C10] uppercase">
                Enterprise Solution
              </p>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                Powerful Networking
                <br />
                For Your Entire Team
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#d8d2c6]">
                Manage, track and grow your team&apos;s networking from one
                powerful dashboard.
              </p>

              <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  "Centralized Dashboard",
                  "Custom Branding",
                  "Bulk Ordering & Management",
                  "Lead Management",
                  "Team Analytics & Reports",
                  "Dedicated Account Manager",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#BC7C10]">
                      <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                    </span>
                    <span className="text-sm text-white/90">{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#BC7C10] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-black/30 transition-transform active:scale-[0.98]"
              >
                <span>Book Enterprise Demo</span>
                <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
              </a>
            </div>

            {/* Right: dashboard mockup */}
            <div className="relative z-10 border-t border-white/10 p-4 lg:w-[58%] lg:border-t-0 lg:border-l lg:border-white/10 lg:p-6">
              <div className="flex h-full overflow-hidden rounded-2xl bg-white shadow-xl shadow-black/30 ring-1 ring-black/5">
                {/* Sidebar */}
                <div className="hidden w-36 shrink-0 border-r border-black/[0.06] p-3 sm:block">
                  <div className="flex items-center gap-1.5 px-2 py-2 text-[11px] font-medium text-[#8a8a92]">
                    <Info className="h-3 w-3" />
                    Dashboard
                  </div>
                  <nav className="mt-1 flex flex-col gap-0.5">
                    {sidebarNav.map((item) => (
                      <div
                        key={item.label}
                        className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] font-medium ${
                          item.active
                            ? "bg-[#FFFCF6] text-[#BC7C10]"
                            : "text-[#a0a0a8]"
                        }`}
                      >
                        <item.icon className="h-3.5 w-3.5" />
                        {item.label}
                      </div>
                    ))}
                  </nav>
                </div>

                {/* Main panel */}
                <div className="flex-1 p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#1a1a1a]">Overview</h3>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f7ec] px-2 py-0.5 text-[9px] font-semibold text-[#16a34a]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
                        Live
                      </span>
                    </div>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFFCF6] text-[#BC7C10]">
                      <Settings className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </span>
                  </div>

                  {/* Stat cards */}
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-black/[0.06] p-2.5 transition-colors hover:border-[#BC7C10]/20"
                      >
                        <div className="flex items-center gap-1.5">
                          <stat.Icon className="h-3.5 w-3.5 text-[#BC7C10]" />
                          <span className="text-sm font-bold text-[#1a1a1a]">
                            {stat.value}
                          </span>
                        </div>
                        <p className="mt-1 text-[9px] leading-tight text-[#a0a0a8]">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Table + chart */}
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-black/[0.06] p-3">
                      <p className="text-[10px] font-semibold text-[#8a8a92]">
                        Top Performers
                      </p>
                      <ul className="mt-2 flex flex-col gap-2.5">
                        {topPerformers.map((person) => (
                          <li
                            key={person.name}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <span className="h-6 w-6 rounded-full bg-[#BC7C10]" />
                              <div>
                                <p className="text-[10px] font-semibold text-[#1a1a1a]">
                                  {person.name}
                                </p>
                                <p className="text-[9px] text-[#a0a0a8]">
                                  {person.role}
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] font-semibold text-[#1a1a1a]">
                              {person.value}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-black/[0.06] p-3">
                      <p className="text-[10px] font-semibold text-[#8a8a92]">
                        Profile Views
                      </p>
                      <svg
                        viewBox="0 0 220 90"
                        className="mt-2 h-20 w-full"
                        preserveAspectRatio="none"
                      >
                        <polyline
                          fill="none"
                          stroke="#BC7C10"
                          strokeWidth="2"
                          points={chartPoints
                            .map(
                              (p, i) =>
                                `${(i / (chartPoints.length - 1)) * 220},${90 - p * 0.8}`
                            )
                            .join(" ")}
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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