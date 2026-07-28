import { Navbar, Footer } from "../../Components/Landing";
import { YoutubeStandee, getProduct } from "../../Components/Pages";

const product = getProduct("youtube-standee");

export const metadata = {
  title: `${product.shortTitle} — HexaCards`,
  description: product.description,
};

export default function YoutubeStandeePage() {
  return (
    <div className="min-h-full bg-[#FFFCF7] text-[#141414]">
      <Navbar />
      <main className="flex-1">
        <YoutubeStandee />
      </main>
      <Footer />
    </div>
  );
}
