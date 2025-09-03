import OrdersOverview from "@/app/projects/components/store/profile/orders-overview";
import ProfileOverview from "@/app/projects/components/store/profile/overview";

export default function ProfilePage() {
  return (
    <div className="w-full space-y-4">
      <ProfileOverview />
      <OrdersOverview />
    </div>
  );
}
