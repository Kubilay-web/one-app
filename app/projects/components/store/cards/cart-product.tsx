import { useCartStore } from "@/app/cart-store/useCartStore";
import { CartProductType, Country } from "@/app/lib/types";
import { cn } from "@/app/lib/utils";
import { addToWishlist } from "@/app/queries/user";
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import {
  Check,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Trash,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";

interface Props {
  product: CartProductType;
  selectedItems: CartProductType[];
  setSelectedItems: Dispatch<SetStateAction<CartProductType[]>>;
  setTotalShipping: Dispatch<SetStateAction<number>>;
  userCountry: Country;
}

const CartProduct: FC<Props> = ({
  product,
  selectedItems,
  setSelectedItems,
  setTotalShipping,
  userCountry,
}) => {
  const {
    productId,
    variantId,
    productSlug,
    variantSlug,
    name,
    variantName,
    sizeId,
    image,
    price,
    quantity,
    stock,
    size,
    weight,
    shippingMethod,
    shippingService,
    shippingFee,
    extraShippingFee,
  } = product;

  // Store previous values to avoid unnecessary re-renders
  const prevShippingFeeRef = useRef(shippingFee);
  const prevUserCountryRef = useRef(userCountry);

  const unique_id = `${productId}-${variantId}-${sizeId}`;

  const totalPrice = price * quantity;

  const [shippingInfo, setShippingInfo] = useState({
    initialFee: 0,
    extraFee: 0,
    totalFee: 0,
    method: shippingMethod,
    weight: weight,
    shippingService: shippingService,
  });

  // Function to calculate shipping fee
  const calculateShipping = (newQty?: number) => {
    let initialFee = 0;
    let extraFee = 0;
    let totalFee = 0;

    const quantityToUse = newQty !== undefined ? newQty : quantity; // Use newQty if passed, else fallback to current quantity

    if (shippingMethod === "ITEM") {
      initialFee = shippingFee;
      extraFee = quantityToUse > 1 ? extraShippingFee * (quantityToUse - 1) : 0;
      totalFee = initialFee + extraFee;
    } else if (shippingMethod === "WEIGHT") {
      totalFee = shippingFee * weight * quantityToUse;
    } else if (shippingMethod === "FIXED") {
      totalFee = shippingFee;
    }

    // Subtract the previous shipping total for this product before updating
    // if (stock > 0) {
    //   setTotalShipping(
    //     (prevTotal) => prevTotal - shippingInfo.totalFee + totalFee,
    //   );
    // }

    if (stock > 0) {
      setTotalShipping(totalFee);
    }

    // Update state
    setShippingInfo({
      initialFee,
      extraFee,
      totalFee,
      method: shippingMethod,
      weight,
      shippingService,
    });
  };

  // Recalculate shipping fees whenever quantity, country or fees changes
  useEffect(() => {
    if (
      shippingFee !== prevShippingFeeRef.current ||
      userCountry !== prevUserCountryRef.current
    ) {
      calculateShipping();
    }

    // Update refs after calculating shipping
    prevShippingFeeRef.current = shippingFee;
    prevUserCountryRef.current = userCountry;

    // Add a check to recalculate shipping fee on component load (after a refresh)
    if (!shippingInfo.totalFee) {
      calculateShipping();
    }
  }, [quantity, shippingFee, userCountry, shippingInfo.totalFee, stock]);

  const selected = selectedItems.find(
    (p) => unique_id === `${p.productId}-${p.variantId}-${p.sizeId}`
  );

  const { updateProductQuantity, removeFromCart } = useCartStore(
    (state) => state
  );

  const handleSelectProduct = () => {
    setSelectedItems((prev) => {
      const exists = prev.some(
        (item) =>
          item.productId === product.productId &&
          item.variantId === product.variantId &&
          item.sizeId === product.sizeId
      );
      return exists
        ? prev.filter((item) => item !== product) // Remove if exists
        : [...prev, product]; // Add if not exists
    });
  };

  const updateProductQuantityHandler = (type: "add" | "remove") => {
    if (type === "add" && quantity < stock) {
      // Increase quantity by 1 but ensure it doesn't exceed stock
      updateProductQuantity(product, quantity + 1);
      calculateShipping(quantity + 1);
    } else if (type === "remove" && quantity > 1) {
      // Decrease quantity by 1 but ensure it doesn't go below 1
      updateProductQuantity(product, quantity - 1);
      calculateShipping(quantity - 1);
    }
  };

  // Handle add product to wishlist
  const handleaddToWishlist = async () => {
    try {
      const res = await addToWishlist(productId, variantId, sizeId);
      if (res) toast.success("Product successfully added to wishlist.");
    } catch (error: any) {
      toast.error(error.toString());
    }
  };

  return (
    <div className="box-body !p-0">
      <div className="table-responsive">
        <Spktables
          tableClass="ti-custom-table ti-custom-table-head w-full"
          header={[
            { title: "Product Name" },
            { title: "Price" },
            { title: "Quantity" },
            { title: "Total" },
            { title: "Action" },
          ]}
        >
          {selectedItems.map((idx: any) => (
            <tr key={idx.id}>
              <td>
                <div className="flex items-center">
                  <div className="me-3">
                    <span className="avatar avatar-xxl bg-light">
                      <Image fill src={idx.image} alt="" />
                    </span>
                  </div>
                  <div>
                    <div className="mb-1 text-[0.875rem] font-semibold">
                      <Link scroll={false} href="#!">
                        {idx.title}
                      </Link>
                    </div>
                    <div className="mb-1">
                      <span className="me-1">Size:</span>
                      <span className="font-semibold text-textmuted dark:text-textmuted/50">
                        {idx.Size}
                      </span>
                    </div>
                    <div className="mb-1">
                      <span className="me-1">Color:</span>
                      <span className="font-semibold text-textmuted dark:text-textmuted/50">
                        {idx.color}
                        {idx.color === "Blue" ? (
                          <span className="badge bg-secondary text-white ms-3">
                            25% discount
                          </span>
                        ) : (
                          <span className="badge bg-success/[0.15] text-success ms-3">
                            In Offer
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div className="font-semibold text-[0.875rem]">
                  {idx.newpr}{" "}
                </div>
              </td>
              <td className="product-quantity-container">
                <div className="input-group border !rounded-[0.3125rem] rounded !flex-nowrap dark:border-defaultborder/10">
                  <button
                       onClick={()=>updateProductQuantityHandler("remove")}
                    className="ti-btn ti-btn-icon !w-[1.5rem] ti-btn-light !m-0 input-group-text flex-grow !border-0 product-quantity-minus"
                  >
                    <i className="ri-subtract-line"></i>
                  </button>
                  <input
                    defaultValue={idx.quantity}
                    type="text"
                    className="form-control form-control-sm border-0 text-center !w-full"
                    aria-label="quantity"
                    id="product-quantity"
                  />
                  <button
                    onClick={()=>updateProductQuantityHandler("add")}
                    className="ti-btn ti-btn-icon !w-[1.5rem] ti-btn-light !m-0 input-group-text flex-grow !border-0 product-quantity-plus"
                  >
                    <i className="ri-add-line"></i>
                  </button>
                </div>
              </td>
              <td>
                <div className="text-[0.875rem] font-semibold">
                  {idx.newpr}{" "}
                </div>
              </td>
              <td>
                <div className="hs-tooltip ti-main-tooltip">
                  <Link
                    scroll={false}
                    href="/ecommerce/customer/wishlist"
                    className="hs-tooltip-toggle ti-btn ti-btn-icon ti-btn-success me-2"
                  >
                    <i className="ri-heart-line"></i>
                    <span
                      className="hs-tooltip-content  ti-main-tooltip-content !py-1 !px-2 !bg-black !text-[0.75rem] !rounded-sm !font-medium !text-white shadow-sm"
                      role="tooltip"
                    >
                      Add To Wishlist
                    </span>
                  </Link>
                </div>
                <div className="hs-tooltip ti-main-tooltip">
                  <Link
                    onClick={() => removeFromCart(idx.id)}
                    scroll={false}
                    href="#!"
                    className="hs-tooltip-toggle ti-btn ti-btn-icon ti-btn-danger btn-delete"
                  >
                    <i className="ri-delete-bin-line"></i>
                    <span
                      className="hs-tooltip-content  ti-main-tooltip-content !py-1 !px-2 !bg-black !text-[0.75rem] !rounded-sm !font-medium !text-white shadow-sm"
                      role="tooltip"
                    >
                      Remove From cart
                    </span>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </Spktables>
      </div>
    </div>
  );
};

export default CartProduct;
