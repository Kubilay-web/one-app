import ProductFilters from "@/app/projects/components/store/browse-page/filters";
import ProductSort from "@/app/projects/components/store/browse-page/sort";
import ProductCard from "@/app/projects/components/store/cards/product/product-card";
import Header from "@/app/projects/components/store/layout/header/header";
import { FiltersQueryType } from "@/app/lib/types";
import { getProducts } from "@/app/queries/product";
import { getFilteredSizes } from "@/app/queries/size";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<FiltersQueryType>;
}) {
  // ✅ Next.js 15: searchParams'ı await et
  const params = await searchParams;

  const {
    category,
    offer,
    search,
    size,
    sort,
    subCategory,
    maxPrice,
    minPrice,
    color,
  } = params;

  const products_data = await getProducts(
    {
      search,
      minPrice: Number(minPrice) || 0,
      maxPrice: Number(maxPrice) || Number.MAX_SAFE_INTEGER,
      category,
      subCategory,
      offer,
      size: Array.isArray(size)
        ? size
        : size
          ? [size] // string'i array'e çevir
          : undefined,
      color: Array.isArray(color) ? color : color ? [color] : undefined,
    },
    sort
  );

  const { products } = products_data;

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Header */}
      <div className="z-10 w-full">
        <Header />
      </div>

      {/* Filters Sidebar */}

      <div className="flex align-center">
      <div className="overflow-auto pt-4 md:left-4 lg:top-16">
        <ProductFilters queries={params} />
      </div>

      {/* Main Content */}
      <div className="ml-[190px] pt-[140px] md:ml-[220px] lg:pt-20">
        {/* Sort Section */}
        <div className="top-[64px] z-10 flex items-center px-4 py-2">
          <ProductSort />
        </div>

        {/* Product List */}
        <div className="mt-4 flex  w-full flex-wrap px-4 pb-28">
          {products.map((product) => (
            <ProductCard key={product.id + product.slug} product={product} />
          ))}
        </div>
      </div>
      </div>

    </div>
  );
}
