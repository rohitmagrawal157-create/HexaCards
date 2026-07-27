import { Navbar, Footer } from "../../Components/Landing";
import { PvcCard, getProduct } from "../../Components/Pages";

const product = getProduct("pvc-card");

export const metadata = {
  title: `${product.shortTitle} — HexaCards`,
  description: product.description,
};

export default function PvcCardPage() {
  return (
    <div className="min-h-full bg-[#FFFCF7] text-[#141414]">
      <Navbar />
      <main className="flex-1">
        <PvcCard />
      </main>
      <Footer />
    </div>
  );
}
