import {
  Building2,
  Stethoscope,
  Scale,
  Landmark,
  GraduationCap,
  Sparkles,
  Hotel,
  Factory,
  Briefcase,
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

// Industries list matched to the actual reference — name + icon + color
// defined together so there's no risk of index drift if this list is
// reordered later.
const industries = [
  { name: "Real Estate", Icon: Building2, bg: "#FBF3E4", fg: "#BC7C10" },
  { name: "Doctors", Icon: Stethoscope, bg: "#FBF3E4", fg: "#BC7C10" },
  { name: "Lawyers", Icon: Scale, bg: "#FBF3E4", fg: "#BC7C10" },
  { name: "CA / Finance", Icon: Landmark, bg: "#FBF3E4", fg: "#BC7C10" },
  { name: "Students", Icon: GraduationCap, bg: "#FBF3E4", fg: "#BC7C10" },
  { name: "Influencers", Icon: Sparkles, bg: "#FBF3E4", fg: "#BC7C10" },
  { name: "Hotels", Icon: Hotel, bg: "#FBF3E4", fg: "#BC7C10" },
  { name: "Manufacturers", Icon: Factory, bg: "#FBF3E4", fg: "#BC7C10" },
  { name: "Consultants", Icon: Briefcase, bg: "#FBF3E4", fg: "#BC7C10" },
  { name: "Corporate Teams", Icon: Users, bg: "#FBF3E4", fg: "#BC7C10" },
];

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

export default function Industries() {
  return (
    <>
      {/* Industry grid */}
      <section id="industries" className="scroll-mt-20 bg-[#FBF3E4] py-20 sm:py-24">
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <div className="text-center">
            <span className="inline-flex items-center rounded-full bg-[#FBF3E4] px-4 py-1.5 text-sm font-semibold text-[#BC7C10]">
              Trusted Across Industries
            </span>

            <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-[#0f172a] sm:text-5xl">
              Perfect for Every Industry
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-[#5b6472]">
              From clinics to construction sites, teams across every sector
              use Hexa Cards to make a lasting first impression.
            </p>
          </div>

          <ul className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {industries.map(({ name, Icon, bg, fg }) => (
              <li
                key={name}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-black/[0.06] bg-white px-4 py-6 text-center transition-all duration-200 hover:-translate-y-1 hover:border-[#BC7C10]/20 hover:shadow-lg hover:shadow-[#BC7C10]/[0.08]"
              >
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: bg, color: fg }}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <span className="text-sm font-semibold text-[#1a1a1a]">
                  {name}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-10 text-center">
            
             <a href="#"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#BC7C10] transition-colors hover:text-[#9a650d]"
            >
              <span>View All Industries</span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                strokeWidth={2.25}
              />
            </a>
          </div>
        </div>
      </section>

      {/* Enterprise solution panel */}
      <section className="bg-[#FBF3E4] pb-20 sm:pb-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="overflow-hidden rounded-3xl bg-[#171412] shadow-2xl shadow-black/20 lg:flex">
            {/* Left: copy */}
            <div className="p-8 sm:p-10 lg:w-[42%] lg:shrink-0">
              <p className="text-xs font-bold tracking-[0.2em] text-[#BC7C10] uppercase">
                Enterprise Solution
              </p>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                Powerful Networking
                <br />
                For Your Entire Team
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#c9c1b3]">
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
                    <span className="text-sm text-[#e9e4d9]">{item}</span>
                  </li>
                ))}
              </ul>

              
                <a href="#"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#BC7C10] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-black/30 transition-transform active:scale-[0.98]"
              >
                <span>Book Enterprise Demo</span>
                <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
              </a>
            </div>

            {/* Right: dashboard mockup */}
            <div className="p-4 lg:w-[58%] lg:p-6">
              <div className="flex h-full overflow-hidden rounded-2xl bg-white shadow-xl shadow-black/10 ring-1 ring-black/5">
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
                            ? "bg-[#FBF3E4] text-[#BC7C10]"
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
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FBF3E4] text-[#BC7C10]">
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
    </>
  );
}