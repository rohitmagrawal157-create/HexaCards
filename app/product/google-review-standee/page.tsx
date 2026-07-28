import { Navbar, Footer } from "../../Components/Landing";
import { GoogleReviewStandee } from "../../Components/Pages";

export const metadata = {
  title: "Review Standee — HexaCards",
  description:
    "Google, Instagram, and YouTube countertop standees — choose a platform and open product details.",
};

export default function GoogleReviewStandeePage() {
  return (
    <div className="min-h-full bg-[#FFFCF7] text-[#141414]">
      <Navbar />
      <main className="flex-1">
        <GoogleReviewStandee />
      </main>
      <Footer />
    </div>
  );
}
