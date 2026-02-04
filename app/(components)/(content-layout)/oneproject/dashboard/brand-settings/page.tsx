

import { validateRequest } from "@/app/auth";
import { getUserById } from "../../actions/users";
import BrandForm from "../../components/Forms/BrandForm";



export default async function Brand() {
  const {user} = await validateRequest();
  const userDetails = await getUserById(user?.id ?? "");
  return (
    <div className="p-8">
      <BrandForm initialData={userDetails} editingId={user?.id} />
    </div>
  );
}
