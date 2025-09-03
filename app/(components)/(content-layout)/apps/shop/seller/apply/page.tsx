import ApplySellerMultiForm from "@/app/projects/components/store/forms/apply-seller/apply-seller";
import MinimalHeader from "@/app/projects/components/store/layout/minimal-header/header";

export default function SellerApplyPage() {
  return (
    <div className="h-screen overflow-y-hidden bg-[#eef4fc]">
      <MinimalHeader />
      <ApplySellerMultiForm />
    </div>
  );
}
