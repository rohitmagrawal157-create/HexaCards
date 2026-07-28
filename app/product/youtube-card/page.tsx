import { Navbar, Footer } from "../../Components/Landing";
import { YoutubeCard, getProduct } from "../../Components/Pages";

const product = getProduct("youtube-card");

export const metadata = {
  title: `${product.shortTitle} — HexaCards`,
  description: product.description,
};

export default function YoutubeCardPage() {
  return (
    <div className="min-h-full bg-[#FFFCF7] text-[#141414]">
      <Navbar />
      <main className="flex-1">
        <YoutubeCard />
      </main>
      <Footer />
    </div>
  );
}
