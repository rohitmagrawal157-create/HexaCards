import { Navbar, Footer } from "../../Components/Landing";
import { GoogleReviewCard, getProduct } from "../../Components/Pages";

const product = getProduct("google-review-card");

export const metadata = {
  title: `${product.shortTitle} — HexaCards`,
  description: product.description,
};

export default function GoogleReviewCardPage() {
  return (
    <div className="min-h-full bg-[#FFFCF7] text-[#141414]">
      <Navbar />
      <main className="flex-1">
        <GoogleReviewCard />
      </main>
      <Footer />
    </div>
  );
}
