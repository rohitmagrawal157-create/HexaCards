import { Navbar, Footer } from "../../Components/Landing";
import { NfcBusinessCard, getProduct } from "../../Components/Pages";

const product = getProduct("nfc-business-card");

export const metadata = {
  title: `${product.shortTitle} — HexaCards`,
  description: product.description,
};

export default function NfcBusinessCardPage() {
  return (
    <div className="min-h-full bg-[#FFFCF7] text-[#141414]">
      <Navbar />
      <main className="flex-1">
        <NfcBusinessCard />
      </main>
      <Footer />
    </div>
  );
}
