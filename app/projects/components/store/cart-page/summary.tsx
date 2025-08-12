import { CartProductType, CartWithCartItemsType } from "@/app/lib/types";
import { FC, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { saveUserCart } from "@/app/queries/user";
import { PulseLoader } from "react-spinners";
import Link from "next/link";

interface Props {
  cartItems: CartProductType[];
  shippingFees: number;
}

const CartSummary: FC<Props> = ({ cartItems, shippingFees }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  // Calculate subtotal from cartItems
  const subtotal = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // Calculate total price including shipping fees
  const total = subtotal + shippingFees;

  const handleSaveCart = async () => {
    try {
      setLoading(true);
      const res = await saveUserCart(cartItems);
      console.log("res-->", res);
      if (res) router.push("/checkout");
      setLoading(false);
    } catch (error: any) {
      toast.error(error.toString());
    }
  };
  return (
    <div className="xl:col-span-3 col-span-12">
      <div className="box">
        <div className="p-4 border-b dark:border-defaultborder/10 block">
          <div className="alert alert-primary text-center" role="alert">
            <span className="text-default">Sale Ends in</span>{" "}
            <span className="font-semibold text-[0.875rem] text-primary ms-1">
              18 Hours : 32 Minutes
            </span>
          </div>
        </div>
        <div className="box-body !p-0">
          <div className="p-4 border-b border-dashed border-defaultborder dark:border-defaultborder/10">
            <p className="mb-2 font-semibold">Delivery:</p>
            <div
              className="btn-group inline-flex gap-0"
              role="group"
              aria-label="Basic radio toggle button group"
            >
              <input
                type="radio"
                className="btn-check absolute opacity-0"
                name="btnradio"
                id="btnradio1"
              />
              <label
                className="ti-btn ti-btn-outline-light !text-dark !m-0 !rounded-e-none border-e-0"
                htmlFor="btnradio1"
              >
                Free Delivery
              </label>
              <input
                type="radio"
                className="btn-check absolute opacity-0"
                name="btnradio"
                id="btnradio2"
                defaultChecked
              />
              <label
                className="ti-btn ti-btn-outline-light bg-light !text-dark !m-0 !rounded-s-none !border-s-0"
                htmlFor="btnradio2"
              >
                Express Delivery
              </label>
            </div>
            <p className="mb-0 mt-2 text-[0.75rem] text-textmuted dark:text-textmuted/50">
              Delivered by 24,Nov 2022
            </p>
          </div>
          <div className="p-4 border-b border-dashed border-defaultborder dark:border-defaultborder/10">
            <div className="input-group">
              <input
                type="text"
                className="form-control form-control-sm !border-s"
                placeholder="Coupon Code"
                aria-label="coupon-code"
                aria-describedby="coupons"
              />
              <button
                className="ti-btn ti-btn-primary !bg-primary border !border-primary !text-white !m-0 input-group-text"
                id="coupons"
              >
                Apply
              </button>
            </div>
            <Link
              scroll={false}
              href="#!"
              className="text-[0.75rem] text-success"
            >
              10% off on first purchase
            </Link>
          </div>
          <div className="p-4 border-b border-dashed border-defaultborder dark:border-defaultborder/10">
            <div className="flex items-center justify-between mb-3">
              <div className="text-textmuted dark:text-textmuted/50 opacity-70">
                Sub Total
              </div>
              <div className="font-semibold text-[0.875rem]"> ${subtotal.toFixed(2)}</div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-textmuted dark:text-textmuted/50 opacity-70">
                Discount
              </div>
              <div className="font-semibold text-[0.875rem] text-success">
                10% - $129
              </div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-textmuted dark:text-textmuted/50 opacity-70">
                Delivery Charges
              </div>
              <div className="font-semibold text-[0.875rem] text-danger">
                - $49
              </div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-textmuted dark:text-textmuted/50 opacity-70">
                 Shipping Fees
              </div>
              <div className="font-semibold text-[0.875rem]">+${shippingFees.toFixed(2)}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-textmuted dark:text-textmuted/50 opacity-70">
                Total :
              </div>
              <div className="font-semibold text-[0.875rem] text-primary">
                {" "}
                ${total.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="p-4 grid">
            <Link
              scroll={false}
              href={"/ecommerce/customer/checkout"}
              className="ti-btn ti-btn-primary btn-wave mb-2"
            >
              Proceed To Checkout
            </Link>
            <Link
              scroll={false}
              href={"/ecommerce/customer/shop"}
              className="ti-btn ti-btn-light btn-wave"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
