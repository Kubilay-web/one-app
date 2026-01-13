// "use client";
// import { ProductType, VariantSimplified } from "@/app/lib/types";
// import Link from "next/link";
// import { useState } from "react";
// import StarRatings from "react-star-ratings";

// import ProductCardImageSwiper from "./swiper";
// import VariantSwitcher from "./variant-switcher";
// import { cn } from "@/app/lib/utils";
// import { Button } from "@/app/projects/components/store/ui/button";
// import { Heart } from "lucide-react";
// import toast from "react-hot-toast";
// import ProductPrice from "./ProductPrice";
// import { addToWishlist } from "@/app/queries/user";

// export default function ProductCard({ product }: { product: ProductType }) {
//   const { name, slug, rating, sales, variantImages, variants, id } = product;
//   const [variant, setVariant] = useState<VariantSimplified>(variants[0]);
//   const { variantSlug, variantName, images, sizes } = variant;

//   const handleaddToWishlist = async () => {
//     try {
//       const res = await addToWishlist(id, variant.variantId);
//       if (res) toast.success("Product successfully added to wishlist.");
//     } catch (error: any) {
//       toast.error(error.toString());
//     }
//   };

//   return (
//     <div>
//       <div
//         className={cn(
//           "group relative ml-5 w-[190px] rounded-t-3xl border border-transparent bg-white p-4 transition-all duration-75 ease-in-out hover:border-border hover:shadow-xl min-[480px]:w-[225px]",
//           {
//             "": true,
//           },
//         )}
//       >
//         <div className="relative h-full w-full">
//           <Link
//             href={`/shop/productdetails/${slug}?variant=${variantSlug}`}
//             className="relative inline-block w-full overflow-hidden"
//           >
//             {/* Images Swiper */}
//             <ProductCardImageSwiper images={images} />
//             {/* Title */}
//             <div className="line-clamp-1 h-[18px] overflow-hidden overflow-ellipsis text-sm text-main-primary">
//               {name} · {variantName}
//             </div>
//             {/* Rating - Sales */}
//             {product.rating > 0 && product.sales > 0 && (
//               <div className="flex h-5 items-center gap-x-1">
//                 <StarRatings
//                   rating={Math.round(product.rating * 2) / 2}
//                   starRatedColor="#FFD804"
//                   numberOfStars={5}
//                   starDimension="18px"
//                   starSpacing="2px"
//                 />
//                 <div className="text-xs text-main-secondary">{sales} sold</div>
//               </div>
//             )}
//             {/* Price */}
//             <ProductPrice sizes={sizes} isCard handleChange={() => {}} />
//           </Link>
//         </div>
//         <div className="absolute -left-[1px] z-30 hidden w-[calc(100%+2px)] space-y-2 rounded-b-3xl border border-t-0 bg-white px-4 pb-4 shadow-xl group-hover:block">
//           {/* Variant switcher */}
//           <VariantSwitcher
//             images={variantImages}
//             variants={variants}
//             setVariant={setVariant}
//             selectedVariant={variant}
//           />
//           <div className="flex-items flex gap-x-1">
//             <Button >
//               <Link href={`/shop/productdetails/${slug}/${variantSlug}`}>Add to cart</Link>
//             </Button>
//             <Button className="bg-white"
//               size="icon"
//               onClick={() => handleaddToWishlist()}
//             >
//               <Heart className="w-5" />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }







"use client";
import { useState } from "react";
import Link from "next/link";
import StarRatings from "react-star-ratings";
import ProductCardImageSwiper from "./swiper";
import VariantSwitcher from "./variant-switcher";
import { Button } from "@/app/projects/components/store/ui/button";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import ProductPrice from "./ProductPrice";
import { addToWishlist } from "@/app/queries/user";

export default function ProductCard({ product, gridFriendly }: { product: any, gridFriendly?: boolean }) {
  const { name, slug, rating, sales, variantImages, variants, id } = product;
  const [variant, setVariant] = useState(variants[0]);
  const { variantSlug, variantName, images, sizes } = variant;

  const handleaddToWishlist = async () => {
    try {
      const res = await addToWishlist(id, variant.variantId);
      if (res) toast.success("Product successfully added to wishlist.");
    } catch (error: any) {
      toast.error(error.toString());
    }
  };

  return (
    <div className={gridFriendly ? "p-2" : "ml-5 w-[190px] p-4"}>
      {/* Images & Title */}
      <Link href={`/shop/productdetails/${slug}?variant=${variantSlug}`} className="relative block">
        <div className="relative w-full h-[300px]">
          <ProductCardImageSwiper images={images} />
        </div>
        <div className="line-clamp-1 mt-2 text-sm font-semibold text-main-primary">
          {name} · {variantName}
        </div>
      </Link>

      {/* Rating & Sales */}
      {(rating > 0 || sales > 0) && (
        <div className="flex items-center gap-x-2 text-xs mt-1">
          <StarRatings
            rating={Math.round(rating * 2) / 2}
            starRatedColor="#FFD804"
            numberOfStars={5}
            starDimension="14px"
            starSpacing="1px"
          />
          {sales > 0 && <span className="text-main-secondary">{sales} sold</span>}
        </div>
      )}

      {/* Price */}
      <ProductPrice sizes={sizes} isCard handleChange={() => {}} />

      {/* Variant & Actions */}
      <div className="mt-2">
        <VariantSwitcher
          images={variantImages}
          variants={variants}
          setVariant={setVariant}
          selectedVariant={variant}
        />
        <div className="flex gap-x-1 mt-2">
          <Button>
            <Link href={`/shop/productdetails/${slug}/${variantSlug}`}>Add to cart</Link>
          </Button>
          <Button size="icon" className="bg-white" onClick={handleaddToWishlist}>
            <Heart className="w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}