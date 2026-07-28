import { Navbar, Footer } from "../../Components/Landing";
import { GoogleStandee, getProduct } from "../../Components/Pages";

const product = getProduct("google-standee");

export const metadata = {
  title: `${product.shortTitle} — HexaCards`,
  description: product.description,
};

export default function GoogleStandeePage() {
  return (
    <div className="min-h-full bg-[#FFFCF7] text-[#141414]">
      <Navbar />
      <main className="flex-1">
        <GoogleStandee />
      </main>
      <Footer />
    </div>
  );
}
