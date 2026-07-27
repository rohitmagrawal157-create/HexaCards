import { HowItWorks, FAQ, Clients, Products, Testimonials } from "../Landing";
import ProductDetails from "./ProductDetails";

type ProductPageLayoutProps = {
  productId: string;
};

/** Shared layout: product-specific details on top, same sections below every page */
export default function ProductPageLayout({ productId }: ProductPageLayoutProps) {
  return (
    <>
      <ProductDetails productId={productId} />
      <Clients />
      <Products />
      <HowItWorks />
      <Testimonials />
      <FAQ />
    </>
  );
}
