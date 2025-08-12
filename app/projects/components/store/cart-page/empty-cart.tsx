// import CartImg from "@/public/assets/images/cart.avif";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
export default function EmptyCart() {
  return (
    <div className="box" id="cart-empty-cart">
      <div className="box-header">
        <div className="box-title">Empty Cart</div>
      </div>
      <div className="box-body">
        <div className="cart-empty !text-center">
          <span className="svg-muted">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="inline-flex"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M18.6 16.5H8.9c-.9 0-1.6-.6-1.9-1.4L4.8 6.7c0-.1 0-.3.1-.4.1-.1.2-.1.4-.1h17.1c.1 0 .3.1.4.2.1.1.1.3.1.4L20.5 15c-.2.8-1 1.5-1.9 1.5zM5.9 7.1 8 14.8c.1.4.5.8 1 .8h9.7c.5 0 .9-.3 1-.8l2.1-7.7H5.9z" />
              <path d="M6 10.9 3.7 2.5H1.3v-.9H4c.2 0 .4.1.4.3l2.4 8.7-.8.3zM8.1 18.8 6 11l.9-.3L9 18.5z" />
              <path d="M20.8 20.4h-.9V20c0-.7-.6-1.3-1.3-1.3H8.9c-.7 0-1.3.6-1.3 1.3v.5h-.9V20c0-1.2 1-2.2 2.2-2.2h9.7c1.2 0 2.2 1 2.2 2.2v.4z" />
              <path d="M8.9 22.2c-1.2 0-2.2-1-2.2-2.2s1-2.2 2.2-2.2c1.2 0 2.2 1 2.2 2.2s-1 2.2-2.2 2.2zm0-3.5c-.7 0-1.3.6-1.3 1.3 0 .7.6 1.3 1.3 1.3.8 0 1.3-.6 1.3-1.3 0-.7-.5-1.3-1.3-1.3zM18.6 22.2c-1.2 0-2.2-1-2.2-2.2s1-2.2 2.2-2.2c1.2 0 2.2 1 2.2 2.2s-.9 2.2-2.2 2.2zm0-3.5c-.8 0-1.3.6-1.3 1.3 0 .7.6 1.3 1.3 1.3.7 0 1.3-.6 1.3-1.3 0-.7-.5-1.3-1.3-1.3z" />
            </svg>
          </span>
          <h3 className="font-bold mb-1">Your Cart is Empty</h3>
          <h5 className="mb-4">Add some items to make me happy :)</h5>
          <Link
            scroll={false}
            href={"/ecommerce/customer/shop/"}
            className="ti-btn ti-btn-primary btn-wave m-3"
            data-abc="true"
          >
            continue shopping{" "}
            <i className="bi bi-arrow-right  rtl:rotate-180 inline-flex  ms-1"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
