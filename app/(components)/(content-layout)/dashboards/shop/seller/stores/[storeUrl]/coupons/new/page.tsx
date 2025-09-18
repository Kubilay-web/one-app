import CouponDetails from "@/app/projects/components/dashboard/forms/coupon-details";
import ProductDetails from "@/app/projects/components/dashboard/forms/product-details";
import { getAllCategories } from "@/app/queries/category";
import { getAllOfferTags } from "@/app/queries/offer-tag";

export default async function SellerNewCouponPage({
  params,
}: {
  params: { storeUrl: string };
}) {
  return (
    <div className="w-full">
      <CouponDetails storeUrl={params.storeUrl} />
    </div>
  );
}
