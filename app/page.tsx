import {
  Navbar,
  Hero,
  Clients,
  Products,
  HowItWorks,
  // WhyHexa,
  Industries,
  Testimonials,
  FAQ,
  Footer,
} from "./Components/Landing";

export default function HomePage() {
  return (
    <div className="min-h-full bg-white text-[#141414]">
      <div className="bg-white">
        <Navbar />
        <Hero />
        <Clients />
        <Products />
        <HowItWorks />
        {/* <WhyHexa /> */}
        <Industries />
        <Testimonials />
        <FAQ />
      </div>
      <Footer />
    </div>
  );
}
