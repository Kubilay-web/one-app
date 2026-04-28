import db from "@/app/lib/db";
import { redirect } from "next/navigation";


export default async function ProductPage({
  params,
}: {
  params: { productSlug: string };
}) {
  const product = await db.product.findUnique({
    where: {
      slug: params.productSlug,
    },
    include: { variants: true },
  });

  if (!product) {
    return redirect("/shop");
  }

  if (!product.variants.length) {
    return redirect("/shop");
  }

  return redirect(`/shop/productdetails/${product.slug}/${product.variants[0].slug}`);
}
