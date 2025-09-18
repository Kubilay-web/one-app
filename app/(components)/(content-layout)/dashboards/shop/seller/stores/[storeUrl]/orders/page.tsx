// Queries
import DataTable from "@/app/projects/components/ui/data-table";
import { columns } from "./columns";
import { Plus } from "lucide-react";
import { getStoreCoupons } from "@/app/queries/coupon";
import CouponDetails from "@/app/projects/components/dashboard/forms/coupon-details";
import { getStoreOrders } from "@/app/queries/store";

export default async function SellerOrdersPage({
  params,
}: {
  params: { storeUrl: string };
}) {
  // Get all store coupons
  const orders = await getStoreOrders(params.storeUrl);
  return (
    <div>
      <DataTable
        filterValue="id"
        data={orders}
        columns={columns}
        searchPlaceholder="Search order by id ..."
      />
    </div>
  );
}
