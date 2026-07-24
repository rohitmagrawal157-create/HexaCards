import { Navbar, Footer, Clients, HowItWorks, Testimonials, Products, FAQ } from "../Components/Landing";
import ProductDetails from "../Components/Pages/ProductDetails";

export const metadata = {
  title: "NFC Business Card — HexaCards",
  description:
    "Premium Hexa NFC business card — design your digital card, share contact details instantly.",
};

export default function ProductPage() {
  return (
    <div className="min-h-full bg-[#FFFCF7] text-[#141414]">
      <Navbar />
      <main className="flex-1">
        <ProductDetails />
        <Clients />
        <HowItWorks />
        <Testimonials />
        <Products/>
        <FAQ/>
      </main>
      <Footer />
    </div>
  );
}
