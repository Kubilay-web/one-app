

import ApplySellerMultiForm from "../../components/apply-seller/apply-seller";
import MinimalHeader from "../../components/minimal-header/header";

export default function SellerApplyPage() {
  return (
    <div className="h-screen overflow-y-hidden bg-[#eef4fc]">
      <MinimalHeader />
      <ApplySellerMultiForm />
    </div>
  );
}
