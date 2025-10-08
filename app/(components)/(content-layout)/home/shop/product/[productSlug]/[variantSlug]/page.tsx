import ProductPageContainer from "@/app/projects/components/store/product-page/container";
import { getProductPageData, getProducts } from "@/app/queries/product";
import { Separator } from "@/app/projects/components/ui/separator";
import { notFound, redirect } from "next/navigation";
import React from "react";
import RelatedProducts from "@/app/projects/components/store/product-page/related-product";
import ProductDescription from "@/app/projects/components/store/product-page/product-description";
import ProductSpecs from "@/app/projects/components/store/product-page/product-specs";
import ProductQuestions from "@/app/projects/components/store/product-page/product-questions";
import StoreCard from "@/app/projects/components/store/cards/store-card";
import StoreProducts from "@/app/projects/components/store/product-page/store-products";
import ProductReviews from "@/app/projects/components/store/product-page/reviews/product-reviews";
import AddReview from "@/app/projects/components/store/product-page/reviews/add-review";
import getProductReviews from "@/app/queries/review";
import Header from "@/app/projects/components/store/layout/header/header";
import CategoriesHeader from "@/app/projects/components/store/layout/categories-header/categories-header";

interface PageProps {
  params: { productSlug: string; variantSlug: string };
  searchParams: {
    size?: string;
  };
}

export default async function ProductVariantPage({
  params: { productSlug, variantSlug },
  searchParams: { size: sizeId },
}: PageProps) {
  const productData = await getProductPageData(productSlug, variantSlug);
  console.log(productData);

  if (!productData) {
    return notFound();
    // return redirect("/");
  }

  const { sizes } = productData;

  if (sizeId) {
    const isValidSize = sizes.some((size) => size.id === sizeId);
    if (!isValidSize) {
      return redirect(`/home/shop/product/${productSlug}/${variantSlug}`);
    }
  } else if (sizes.length === 1) {
    return redirect(
      `/home/shop/product/${productSlug}/${variantSlug}?size=${sizes[0].id}`,
    );
  }

  const {
    productId,
    specs,
    questions,
    shippingDetails,
    category,
    subCategory,
    store,
    reviewsStatistics,
    reviews,
    variantInfo,
  } = productData;
  const relatedProducts = await getProducts(
    { category: category.url },
    "",
    1,
    12,
  );

  console.log("related products-->>>", relatedProducts);
  console.log("shippingDetails", shippingDetails);

  const productReviews = await getProductReviews(productId);

  return (
    <div>
      <Header />
      <CategoriesHeader />
      <div className="mx-auto max-w-[1650px] overflow-x-hidden p-4">
        <ProductPageContainer productData={productData} sizeId={sizeId}>
          {relatedProducts.products && (
            <>
              <Separator />

              <RelatedProducts products={relatedProducts.products} />
            </>
          )}
          <Separator className="mt-6" />
          <ProductReviews
            productId={productData.productId}
            rating={productData.rating}
            statistics={reviewsStatistics}
            reviews={reviews}
            reviewsProduct={productReviews} // Yorumları buraya geçiriyoruz
            variantsInfo={variantInfo}
          />

          {/* <div className="mt-4">
            <AddReview
              productId={productId}
              reviews={reviews}
              variantsInfo={variantInfo}
            />
          </div> */}

          <>
            <Separator className="mt-6" />

            <ProductDescription
              text={
                (productData.description, productData.variantDescription || "")
              }
            />
          </>
          {(specs.product.length > 0 || specs.variant.length > 0) && (
            <>
              <Separator className="mt-6" />

              <ProductSpecs specs={specs} />
            </>
          )}
          {questions.length > 0 && (
            <>
              <Separator className="mt-6" />

              <ProductQuestions questions={productData.questions} />
            </>
          )}
          <Separator className="mt-6" />
          <StoreCard store={productData.store} />
          <StoreProducts
            storeUrl={store.url}
            storeName={store.name}
            count={6}
          />
        </ProductPageContainer>
      </div>
    </div>
  );
}
