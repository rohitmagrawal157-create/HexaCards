import { Navbar, Footer } from "../../Components/Landing";
import { DetailsForm, getProduct } from "../../Components/Pages";

type PageProps = {
  params: Promise<{ productId: string }> | { productId: string };
};

export async function generateMetadata({ params }: PageProps) {
  const resolved = await Promise.resolve(params);
  const product = getProduct(resolved.productId);
  return {
    title: `${product.ctaLabel} — HexaCards`,
    description: `Share your link and logo to order ${product.shortTitle}.`,
  };
}

export default async function OrderDetailsPage({ params }: PageProps) {
  const resolved = await Promise.resolve(params);

  return (
    <div className="min-h-full bg-[#FFFCF7] text-[#141414]">
      <Navbar />
      <main className="flex-1">
        <DetailsForm productId={resolved.productId} />
      </main>
      <Footer />
    </div>
  );
}
