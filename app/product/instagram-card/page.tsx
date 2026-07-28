import { Navbar, Footer } from "../../Components/Landing";
import { InstagramCard, getProduct } from "../../Components/Pages";

const product = getProduct("instagram-card");

export const metadata = {
  title: `${product.shortTitle} — HexaCards`,
  description: product.description,
};

export default function InstagramCardPage() {
  return (
    <div className="min-h-full bg-[#FFFCF7] text-[#141414]">
      <Navbar />
      <main className="flex-1">
        <InstagramCard />
      </main>
      <Footer />
    </div>
  );
}
