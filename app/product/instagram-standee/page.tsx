import { Navbar, Footer } from "../../Components/Landing";
import { InstagramStandee, getProduct } from "../../Components/Pages";

const product = getProduct("instagram-standee");

export const metadata = {
  title: `${product.shortTitle} — HexaCards`,
  description: product.description,
};

export default function InstagramStandeePage() {
  return (
    <div className="min-h-full bg-[#FFFCF7] text-[#141414]">
      <Navbar />
      <main className="flex-1">
        <InstagramStandee />
      </main>
      <Footer />
    </div>
  );
}
