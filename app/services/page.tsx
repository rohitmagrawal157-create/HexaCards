import { Navbar, Footer } from "@/components/landing";
import { NavServices } from "@/components/products";

export const metadata = {
  title: "Services — HexaCards",
  description:
    "Hexa digital identity solutions for businesses, teams, and professionals.",
};

export default function ServicesPage() {
  return (
    <div className="min-h-full bg-[#FFFCF7] text-[#141414]">
      <Navbar />
      <main className="flex-1">
        <NavServices />
      </main>
      <Footer />
    </div>
  );
}
