import ProductFilters from "@/app/projects/components//store/browse-page/filters";
import ProductSort from "@/app/projects/components//store/browse-page/sort";
import CategoriesHeader from "@/app/projects/components//store/layout/categories-header/categories-header";
import Header from "@/app/projects/components//store/layout/header/header";
import StoreDEetails from "@/app/projects/components//store/store-page/store-details";
import StoreProducts from "@/app/projects/components//store/store-page/store-products";
import { FiltersQueryType } from "@/app/lib/types";
import { getStorePageDetails } from "@/app/queries/store";

export default async function StorePage({
  params,
  searchParams,
}: {
  params: { storeUrl: string };
  searchParams: FiltersQueryType;
}) {
  const store = await getStorePageDetails(params.storeUrl);
  return (
    <>
      <Header />
      <CategoriesHeader />
      <div className="mx-auto max-w-[1600px] px-2">
        <StoreDEetails details={store} />
        <div className="mt-8 md:mt-14">
          <div className="flex">
            <div className="left-2 mt-3 md:left-4 lg:top-16">
              <ProductFilters queries={searchParams} />
            </div>
            <div className="pt-4">
              <div className="md:ml-5">
                <ProductSort />
              </div>
              <div className="-ml-6 md:ml-0">
                <StoreProducts
                  searchParams={searchParams}
                  store={params.storeUrl}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
