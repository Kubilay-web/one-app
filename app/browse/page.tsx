import ProductFilters from "@/app/projects/components/store/browse-page/filters";
import ProductSort from "@/app/projects/components/store/browse-page/sort";
import ProductCard from "@/app/projects/components/store/cards/product/product-card";
import Header from "@/app/projects/components/store/layout/header/header";
import { FiltersQueryType } from "@/app/lib/types";
import { getProducts } from "@/app/queries/product";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const category = Array.isArray(searchParams?.category) ? searchParams?.category[0] : searchParams?.category;
  const offer = Array.isArray(searchParams?.offer) ? searchParams?.offer[0] : searchParams?.offer;
  const search = Array.isArray(searchParams?.search) ? searchParams?.search[0] : searchParams?.search;
  const size = searchParams?.size;
  const sort = Array.isArray(searchParams?.sort) ? searchParams?.sort[0] : searchParams?.sort;
  const subCategory = Array.isArray(searchParams?.subCategory) ? searchParams?.subCategory[0] : searchParams?.subCategory;
  const maxPrice = Array.isArray(searchParams?.maxPrice) ? searchParams?.maxPrice[0] : searchParams?.maxPrice;
  const minPrice = Array.isArray(searchParams?.minPrice) ? searchParams?.minPrice[0] : searchParams?.minPrice;
  const color = searchParams?.color;

  const products_data = await getProducts(
    {
      search,
      minPrice: Number(minPrice) || 0,
      maxPrice: Number(maxPrice) || Number.MAX_SAFE_INTEGER,
      category,
      subCategory,
      offer,
      size: Array.isArray(size) ? size : size ? [size] : undefined,
      color: Array.isArray(color) ? color : color ? [color] : undefined,
    },
    sort,
  );

  const { products } = products_data;

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Header */}
      <div className="fixed left-0 top-0 z-10 w-full">
        <Header />
      </div>

      {/* Filters Sidebar */}
      <div className="scrollbar fixed left-2 top-[124px] h-[calc(100vh-64px)] overflow-auto pt-4 md:left-4 lg:top-16">
        <ProductFilters queries={searchParams as FiltersQueryType} />
      </div>

      {/* Main Content */}
      <div className="ml-[190px] pt-[140px] md:ml-[220px] lg:pt-20">
        {/* Sort Section */}
        <div className="sticky top-[64px] z-10 flex items-center px-4 py-2">
          <ProductSort />
        </div>

        {/* Product List */}
        <div className="scrollbar mt-4 flex max-h-[calc(100vh-155px)] w-full flex-wrap overflow-y-auto px-4 pb-28">
          {products.map((product, i) => (
            <ProductCard key={product.id + product.slug} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
