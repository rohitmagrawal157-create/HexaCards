import { Navbar, Footer } from "../../Components/Landing";
import { WoodenCard, getProduct } from "../../Components/Pages";

const product = getProduct("wooden-card");

export const metadata = {
  title: `${product.shortTitle} — HexaCards`,
  description: product.description,
};

export default function WoodenCardPage() {
  return (
    <div className="min-h-full bg-[#FFFCF7] text-[#141414]">
      <Navbar />
      <main className="flex-1">
        <WoodenCard />
      </main>
      <Footer />
    </div>
  );
}
