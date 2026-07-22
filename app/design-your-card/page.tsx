import { Navbar, Footer } from "../Components/Landing";
import CardCustomizer from "../Components/Pages/CardCustomizer";

export const metadata = {
  title: "Design Your Card — HexaCards",
  description: "Customize your Hexa NFC business card colors, text, and logo.",
};

export default function DesignYourCardPage() {
  return (
    <div className="min-h-full bg-[#FFFCF7] text-[#141414]">
      <Navbar />
      <main className="flex-1">
        <CardCustomizer />
      </main>
      <Footer />
    </div>
  );
}
