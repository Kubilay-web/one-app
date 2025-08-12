import { useCartStore } from "@/app/cart-store/useCartStore";
import { CartProductType } from "@/app/lib/types";
import { cn } from "@/app/lib/utils";
import { Check } from "lucide-react";
import { Dispatch, FC, SetStateAction } from "react";

interface Props {
  cartItems: CartProductType[];
  selectedItems: CartProductType[];
  setSelectedItems: Dispatch<SetStateAction<CartProductType[]>>;
}

const CartHeader: FC<Props> = ({
  cartItems,
  selectedItems,
  setSelectedItems,
}) => {
  const removeMultipleFromCart = useCartStore(
    (state) => state.removeMultipleFromCart
  );

  const cartLength = cartItems.length;
  const selectedLength = selectedItems.length;

  const handleSelectAll = () => {
    const areAllSelected = cartItems.every((item) =>
      selectedItems.some(
        (selected) =>
          selected.productId === item.productId &&
          selected.variantId === item.variantId &&
          selected.sizeId === item.sizeId
      )
    );
    setSelectedItems(areAllSelected ? [] : cartItems);
  };

  const removeSelectedFromCart = () => {
    removeMultipleFromCart(selectedItems);

    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.filter(
        (selected) =>
          !cartItems.some(
            (item) =>
              item.productId === selected.productId &&
              item.variantId === selected.variantId &&
              item.sizeId === selected.sizeId
          )
      )
    );
  };

  return (
    <div className="box-header">
      <div className="box-title">Cart Items {cartItems.length}</div>
    </div>
  );
};

export default CartHeader;
