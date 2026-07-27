import { Navbar, Footer } from "../../Components/Landing";
import { SocialMediaCards, getProduct } from "../../Components/Pages";

const product = getProduct("social-media-cards");

export const metadata = {
  title: `${product.shortTitle} — HexaCards`,
  description: product.description,
};

export default function SocialMediaCardsPage() {
  return (
    <div className="min-h-full bg-[#FFFCF7] text-[#141414]">
      <Navbar />
      <main className="flex-1">
        <SocialMediaCards />
      </main>
      <Footer />
    </div>
  );
}
