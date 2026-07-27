import { Navbar, Footer } from "../Components/Landing";
import { NavProduct } from "../Components/Pages";

export const metadata = {
  title: "Products — HexaCards",
  description:
    "Explore Hexa NFC cards, QR products, Google review cards, and review stands.",
};

export default function ProductsPage() {  
  return (
    <div className="min-h-full bg-[#FFFCF7] text-[#141414]">
      <Navbar />
      <main className="flex-1">
        <NavProduct />
      </main>
      <Footer />
    </div>
  );
}
