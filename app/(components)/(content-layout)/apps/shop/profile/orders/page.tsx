import OrdersTable from "@/app/projects/components/store/profile/orders/orders-table";
import { getUserOrders } from "@/app/queries/profile";

export default async function ProfileOrdersPage() {
  const orders_data = await getUserOrders();
  const { orders, totalPages } = orders_data;
  return (
    <div>
      <OrdersTable orders={orders} totalPages={totalPages} />{" "}
    </div>
  );
}
