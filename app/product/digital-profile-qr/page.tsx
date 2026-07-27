import { Navbar, Footer } from "../../Components/Landing";
import { DigitalProfileQr, getProduct } from "../../Components/Pages";

const product = getProduct("digital-profile-qr");

export const metadata = {
  title: `${product.shortTitle} — HexaCards`,
  description: product.description,
};

export default function DigitalProfileQrPage() {
  return (
    <div className="min-h-full bg-[#FFFCF7] text-[#141414]">
      <Navbar />
      <main className="flex-1">
        <DigitalProfileQr />
      </main>
      <Footer />
    </div>
  );
}
