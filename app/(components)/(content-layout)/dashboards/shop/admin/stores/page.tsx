import { getAllStores } from "@/app/queries/store";

// Data table
import DataTable from "@/app/projects/components/ui/data-table";
import { columns } from "./columns";

export default async function AdminStoresPage() {
  // Fetching stores data from the database
  const stores = await getAllStores();

  return (
    <DataTable
      filterValue="name"
      data={stores}
      searchPlaceholder="Search store name..."
      columns={columns}
    />
  );
}
