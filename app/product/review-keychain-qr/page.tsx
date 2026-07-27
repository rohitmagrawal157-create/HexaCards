import { Navbar, Footer } from "../../Components/Landing";
import { ReviewKeychainQr, getProduct } from "../../Components/Pages";

const product = getProduct("review-keychain-qr");

export const metadata = {
  title: `${product.shortTitle} — HexaCards`,
  description: product.description,
};

export default function ReviewKeychainQrPage() {
  return (
    <div className="min-h-full bg-[#FFFCF7] text-[#141414]">
      <Navbar />
      <main className="flex-1">
        <ReviewKeychainQr />
      </main>
      <Footer />
    </div>
  );
}
