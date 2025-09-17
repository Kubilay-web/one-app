import OrdersTable from "@/app/projects/components/store/profile/orders/orders-table";
import { OrderTableFilter } from "@/app/lib/types";
import { getUserOrders } from "@/app/queries/profile";

export default async function ProfileFilteredOrderPage({
  params,
}: {
  params: { filter: string };
}) {
  const filter = params.filter ? (params.filter as OrderTableFilter) : "";
  console.log("filter--->", filter);
  const orders_data = await getUserOrders(filter);
  const { orders, totalPages } = orders_data;
  return (
    <div>
      <OrdersTable
        orders={orders}
        totalPages={totalPages}
        prev_filter={filter}
      />
    </div>
  );
}
