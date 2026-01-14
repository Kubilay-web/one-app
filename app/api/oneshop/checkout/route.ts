// import { NextRequest, NextResponse } from "next/server";
// import db from "@/app/lib/db";
// import Stripe from "stripe";
// import { validateRequest } from "@/app/auth";
// import paypal from "@paypal/checkout-server-sdk";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-08-27.basil",
// });

// // PAYPAL CLIENT
// const paypalClientId = process.env.PAYPAL_CLIENT_ID!;
// const paypalClientSecret = process.env.PAYPAL_SECRET!;
// const environment = new paypal.core.SandboxEnvironment(
//   paypalClientId,
//   paypalClientSecret
// );
// const paypalClient = new paypal.core.PayPalHttpClient(environment);

// export async function POST(request: NextRequest) {
//   try {
//     const { user } = await validateRequest();
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await request.json();
//     const {
//       shippingAddressId,
//       paymentMethod,
//       shippingMethod,
//       cartItems,
//       total,
//       shippingFee,
//       discountAmount,
//     } = body;



//     // CART VALIDATION
//     if (!Array.isArray(cartItems) || cartItems.length === 0) {
//       return NextResponse.json(
//         { error: "Cart is empty or invalid" },
//         { status: 400 }
//       );
//     }

//     const subTotal = cartItems.reduce(
//       (sum: number, item: any) =>
//         sum + Number(item.price) * Number(item.quantity),
//       0
//     );

//     const shippingFees =
//       shippingFee || (shippingMethod === "express" ? 9.99 : 4.99);

//     const finalTotal = total;

//     // ✅ SHIPPING ADDRESS (Stripe + PayPal ortak)
//     const shippingAddress = await db.shippingAddress.findUnique({
//       where: {
//         id: shippingAddressId,
//         userId: user.id,
//       },
//     });

//     if (!shippingAddress) {
//       return NextResponse.json(
//         { error: "Shipping address not found" },
//         { status: 400 }
//       );
//     }

//     // ✅ ORDER CREATE
//     const order = await db.order.create({
//       data: {
//         userId: user.id,
//         shippingAddressId,
//         subTotal,
//         shippingFees,
//         total: finalTotal,
//         orderStatus: "Pending",
//         paymentStatus: "Pending",
//         paymentMethod:
//           paymentMethod === "card"
//             ? "Stripe"
//             : paymentMethod === "paypal"
//             ? "Paypal"
//             : null,

//         groups: {
//           create: [
//             {
//               storeId:"store-1", // ✅ HARD-CODE YOK
//               status: "Pending",

//               shippingService:
//                 shippingMethod === "express"
//                   ? "Express Delivery"
//                   : "Standard Delivery",

//               shippingDeliveryMin: shippingMethod === "express" ? 2 : 5,
//               shippingDeliveryMax: shippingMethod === "express" ? 3 : 7,

//               shippingFees,
//               subTotal,
//               total: finalTotal,

//               items: {
//                 create: cartItems.map((item: any) => ({
//                   productId: item.productId,
//                   variantId: item.variantId,
//                   sizeId: item.sizeId,
//                   productSlug: item.productSlug,
//                   variantSlug: item.variantSlug,
//                   sku: item.sku,
//                   name: item.name,
//                   image: item.image,
//                   size: item.size,
//                   quantity: Number(item.quantity),
//                   price: Number(item.price),
//                   totalPrice:
//                     Number(item.price) * Number(item.quantity),
//                   shippingFee: shippingFees / cartItems.length,
//                   status: "Pending",
//                 })),
//               },
//             },
//           ],
//         },
//       },
//       include: {
//         groups: { include: { items: true } },
//       },
//     });

//     // CART CLEAN
//     await db.cartItem.deleteMany({
//       where: { cart: { userId: user.id } },
//     });

//     // ================= STRIPE =================
//     if (paymentMethod === "card") {
//       const session = await stripe.checkout.sessions.create({
//         mode: "payment",
//         payment_method_types: ["card"],

//         line_items: [
//           {
//             price_data: {
//               currency: "usd",
//               product_data: {
//                 name: `Order #${order.id.slice(0, 8)}`,
//               },
//               unit_amount: Math.round(finalTotal * 100),
//             },
//             quantity: 1,
//           },
//         ],

//         customer_email: user.email ?? undefined,

//         metadata: {
//           orderId: order.id,
//           userId: user.id,
//         },

//         success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/shop/checkout/success?orderId=${order.id}`,
//         cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/shop/checkout`,
//       });

//       return NextResponse.json({
//         success: true,
//         paymentUrl: session.url,
//         sessionId: session.id,
//         order,
//       });
//     }

//     // ================= PAYPAL =================
//     if (paymentMethod === "paypal") {
//       const req = new paypal.orders.OrdersCreateRequest();

//       req.requestBody({
//         intent: "CAPTURE",
//         purchase_units: [
//           {
//             reference_id: order.id,
//             description: `Order #${order.id.slice(0, 8)}`,
//             amount: {
//               currency_code: "USD",
//               value: finalTotal.toFixed(2),
//               breakdown: {
//                 item_total: {
//                   currency_code: "USD",
//                   value: subTotal.toFixed(2),
//                 },
//                 shipping: {
//                   currency_code: "USD",
//                   value: shippingFees.toFixed(2),
//                 },
//                 discount: {
//                   currency_code: "USD",
//                   value: (discountAmount || 0).toFixed(2),
//                 },
//               },
//             },

//             // ✅ STRIPE İLE AYNI ADRES KAYNAĞI
//             shipping: {
//               name: {
//                 full_name: shippingAddress.fullName,
//               },
//               address: {
//                 address_line_1: shippingAddress.addressLine1,
//                 address_line_2:
//                   shippingAddress.addressLine2 || "",
//                 admin_area_2: shippingAddress.city,
//                 admin_area_1: shippingAddress.state,
//                 postal_code: shippingAddress.postalCode,
//                 country_code: shippingAddress.countryCode,
//               },
//             },

//             items: cartItems.map((item: any, i: number) => ({
//               name:
//                 item.name.length > 127
//                   ? item.name.slice(0, 124) + "..."
//                   : item.name,
//               sku: item.sku || `ITEM-${i + 1}`,
//               unit_amount: {
//                 currency_code: "USD",
//                 value: Number(item.price).toFixed(2),
//               },
//               quantity: item.quantity.toString(),
//               category: "PHYSICAL_GOODS",
//             })),
//           },
//         ],

//         application_context: {
//           brand_name: "OneShop",
//           user_action: "PAY_NOW",
//           landing_page: "BILLING",
//           shipping_preference: "SET_PROVIDED_ADDRESS",
//           return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/shop/checkout/success?orderId=${order.id}&paymentMethod=paypal`,
//           cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/shop/checkout`,
//         },
//       });

//       const paypalOrder = await paypalClient.execute(req);

//       await db.order.update({
//         where: { id: order.id },
//         data: { paymentProviderId: paypalOrder.result.id },
//       });

//       const approvalUrl = paypalOrder.result.links.find(
//         (l: any) => l.rel === "approve"
//       )?.href;

//       return NextResponse.json({
//         success: true,
//         paymentUrl: approvalUrl,
//         paypalOrderId: paypalOrder.result.id,
//         order,
//       });
//     }

//     return NextResponse.json({ success: true, order });
//   } catch (error: any) {
//     console.error("Checkout error:", error);
//     return NextResponse.json(
//       { error: error.message },
//       { status: 500 }
//     );
//   }
// }








// app/api/oneshop/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db";
import Stripe from "stripe";
import { validateRequest } from "@/app/auth";
import paypal from "@paypal/checkout-server-sdk";

// Stripe initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

// PayPal initialization
let paypalClient: paypal.core.PayPalHttpClient;
const initializePayPal = () => {
  if (!paypalClient) {
    const clientId = process.env.PAYPAL_CLIENT_ID!;
    const clientSecret = process.env.PAYPAL_SECRET!;
    
    // Determine environment
    const isProduction = process.env.NODE_ENV === "production";
    const environment = isProduction
      ? new paypal.core.LiveEnvironment(clientId, clientSecret)
      : new paypal.core.SandboxEnvironment(clientId, clientSecret);
    
    paypalClient = new paypal.core.PayPalHttpClient(environment);
  }
  return paypalClient;
};

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      shippingAddressId,
      paymentMethod,
      shippingMethod,
      cartItems,
      note,
      shippingFee,
      discountAmount,
      appliedCoupon,
    } = body;

    // CART VALIDATION
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty or invalid" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!shippingAddressId) {
      return NextResponse.json(
        { error: "Shipping address is required" },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: "Payment method is required" },
        { status: 400 }
      );
    }

    // Calculate totals
    const subTotal = cartItems.reduce(
      (sum: number, item: any) =>
        sum + Number(item.price) * Number(item.quantity),
      0
    );

    const shippingFees = Number(shippingFee) || 0;
    const discount = Number(discountAmount) || 0;
    const total = Math.max(0, subTotal + shippingFees - discount);

    // ✅ SHIPPING ADDRESS
    const shippingAddress = await db.shippingAddress.findUnique({
      where: {
        id: shippingAddressId,
        userId: user.id,
      },
      include: {
        country: true,
      },
    });

    if (!shippingAddress) {
      return NextResponse.json(
        { error: "Shipping address not found" },
        { status: 400 }
      );
    }

    // Check stock availability
    for (const item of cartItems) {
      const variant = await db.productVariant.findUnique({
        where: { id: item.variantId },
        include: {
          sizeStocks: {
            where: { sizeId: item.sizeId },
          },
        },
      });

      if (!variant) {
        return NextResponse.json(
          { error: `Variant ${item.variantId} not found` },
          { status: 400 }
        );
      }

      const stock = variant.sizeStocks[0];
      if (!stock || stock.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.name}` },
          { status: 400 }
        );
      }
    }

    // ✅ CREATE ORDER
    const order = await db.order.create({
      data: {
        userId: user.id,
        shippingAddressId,
        subTotal,
        shippingFees,
        discountAmount: discount,
        total,
        orderStatus: "Pending",
        paymentStatus: "Pending",
        paymentMethod: paymentMethod === "card" ? "Stripe" 
                    : paymentMethod === "paypal" ? "PayPal"
                    : paymentMethod === "cod" ? "Cash on Delivery"
                    : paymentMethod === "upi" ? "UPI" : null,
        note: note || null,
        
        // Store coupon info if applied
        ...(appliedCoupon && {
          couponCode: appliedCoupon.couponCode,
          couponDiscountPercentage: appliedCoupon.discountPercentage,
        }),

        groups: {
          create: cartItems.map((item: any) => ({
            storeId: item.storeId || "default-store",
            status: "Pending",
            shippingService: shippingMethod === "express" 
              ? "Express Delivery" 
              : "Standard Delivery",
            shippingDeliveryMin: shippingMethod === "express" ? 2 : 5,
            shippingDeliveryMax: shippingMethod === "express" ? 3 : 7,
            shippingFees: shippingFees / cartItems.length, // Distribute shipping cost
            subTotal: Number(item.price) * Number(item.quantity),
            total: Number(item.price) * Number(item.quantity) + (shippingFees / cartItems.length),
            items: {
              create: {
                productId: item.productId,
                variantId: item.variantId,
                sizeId: item.sizeId,
                productSlug: item.productSlug,
                variantSlug: item.variantSlug,
                sku: item.sku,
                name: item.name,
                image: item.image,
                size: item.size,
                quantity: Number(item.quantity),
                price: Number(item.price),
                totalPrice: Number(item.price) * Number(item.quantity),
                shippingFee: shippingFees / cartItems.length,
                status: "Pending",
              },
            },
          })),
        },
      },
      include: {
        groups: {
          include: {
            items: true,
          },
        },
      },
    });

    // Update stock quantities
    for (const item of cartItems) {
      await db.sizeStock.update({
        where: {
          variantId_sizeId: {
            variantId: item.variantId,
            sizeId: item.sizeId,
          },
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    // ================= STRIPE PAYMENT =================
    if (paymentMethod === "card") {
      try {
        // Create Stripe customer if not exists
        let customer: Stripe.Customer;
        const existingCustomers = await stripe.customers.list({
          email: user.email,
          limit: 1,
        });

        if (existingCustomers.data.length > 0) {
          customer = existingCustomers.data[0];
        } else {
          customer = await stripe.customers.create({
            email: user.email,
            name: user.name,
            metadata: {
              userId: user.id,
            },
          });
        }

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
          customer: customer.id,
          mode: "payment",
          payment_method_types: ["card"],
          
          line_items: cartItems.map((item: any) => ({
            price_data: {
              currency: "usd",
              product_data: {
                name: item.name,
                description: `Size: ${item.size} | SKU: ${item.sku}`,
                images: item.image ? [item.image] : [],
                metadata: {
                  productId: item.productId,
                  variantId: item.variantId,
                  sizeId: item.sizeId,
                },
              },
              unit_amount: Math.round(Number(item.price) * 100),
            },
            quantity: item.quantity,
          })),

          // Add shipping fee as a separate line item
          ...(shippingFees > 0 && {
            shipping_options: [
              {
                shipping_rate_data: {
                  type: "fixed_amount",
                  fixed_amount: {
                    amount: Math.round(shippingFees * 100),
                    currency: "usd",
                  },
                  display_name: shippingMethod === "express" 
                    ? "Express Shipping" 
                    : "Standard Shipping",
                  delivery_estimate: shippingMethod === "express" 
                    ? {
                        minimum: { unit: "business_day", value: 2 },
                        maximum: { unit: "business_day", value: 3 },
                      }
                    : {
                        minimum: { unit: "business_day", value: 5 },
                        maximum: { unit: "business_day", value: 7 },
                      },
                },
              },
            ],
          }),

          // Add discount if applicable
          ...(discount > 0 && {
            discounts: [{
              coupon: await stripe.coupons.create({
                amount_off: Math.round(discount * 100),
                currency: "usd",
                duration: "once",
              }),
            }],
          }),

          metadata: {
            orderId: order.id,
            userId: user.id,
            shippingAddressId,
          },

          customer_update: {
            shipping: "auto",
          },

          shipping_address_collection: {
            allowed_countries: ["US", "CA", "GB", "AU", "DE", "FR", "IT", "ES"],
          },

          success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
        });

        // Update order with Stripe session ID
        await db.order.update({
          where: { id: order.id },
          data: { 
            paymentProviderId: session.id,
            paymentStatus: "Processing",
          },
        });

        return NextResponse.json({
          success: true,
          paymentUrl: session.url,
          sessionId: session.id,
          order,
        });

      } catch (stripeError: any) {
        console.error("Stripe error:", stripeError);
        
        // Update order as failed
        await db.order.update({
          where: { id: order.id },
          data: { 
            paymentStatus: "Failed",
            orderStatus: "Cancelled",
          },
        });

        return NextResponse.json(
          { error: `Stripe payment failed: ${stripeError.message}` },
          { status: 500 }
        );
      }
    }

    // ================= PAYPAL PAYMENT =================
    if (paymentMethod === "paypal") {
      try {
        const paypalClient = initializePayPal();
        
        // Prepare PayPal order request
        const request = new paypal.orders.OrdersCreateRequest();
        
        request.requestBody({
          intent: "CAPTURE",
          purchase_units: [
            {
              reference_id: order.id,
              description: `Order #${order.id.slice(0, 8).toUpperCase()}`,
              invoice_id: order.id,
              custom_id: user.id,
              soft_descriptor: "OneShop Store",
              
              amount: {
                currency_code: "USD",
                value: total.toFixed(2),
                breakdown: {
                  item_total: {
                    currency_code: "USD",
                    value: subTotal.toFixed(2),
                  },
                  shipping: {
                    currency_code: "USD",
                    value: shippingFees.toFixed(2),
                  },
                  ...(discount > 0 && {
                    discount: {
                      currency_code: "USD",
                      value: discount.toFixed(2),
                    },
                  }),
                },
              },
              
              items: cartItems.map((item: any, index: number) => ({
                name: item.name.length > 127 
                  ? item.name.substring(0, 124) + "..." 
                  : item.name,
                sku: item.sku || `SKU-${index + 1}`,
                unit_amount: {
                  currency_code: "USD",
                  value: Number(item.price).toFixed(2),
                },
                quantity: item.quantity.toString(),
                category: "PHYSICAL_GOODS",
              })),
              
              shipping: {
                name: {
                  full_name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
                },
                address: {
                  address_line_1: shippingAddress.address1,
                  address_line_2: shippingAddress.address2 || "",
                  admin_area_2: shippingAddress.city,
                  admin_area_1: shippingAddress.state,
                  postal_code: shippingAddress.zip_code,
                  country_code: shippingAddress.country?.code || "US",
                },
              },
            },
          ],
          
          application_context: {
            brand_name: "OneShop",
            locale: "en-US",
            landing_page: "BILLING",
            user_action: "PAY_NOW",
            shipping_preference: "SET_PROVIDED_ADDRESS",
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?order_id=${order.id}&payment_method=paypal`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
          },
        });

        // Execute PayPal order creation
        const response = await paypalClient.execute(request);
        
        if (response.statusCode !== 201) {
          throw new Error(`PayPal API error: ${response.statusCode}`);
        }

        // Update order with PayPal order ID
        await db.order.update({
          where: { id: order.id },
          data: { 
            paymentProviderId: response.result.id,
            paymentStatus: "Processing",
          },
        });

        // Find approval URL
        const approvalLink = response.result.links.find(
          (link: any) => link.rel === "approve"
        );

        if (!approvalLink) {
          throw new Error("No PayPal approval URL found");
        }

        return NextResponse.json({
          success: true,
          paymentUrl: approvalLink.href,
          paypalOrderId: response.result.id,
          order,
        });

      } catch (paypalError: any) {
        console.error("PayPal error:", paypalError);
        
        // Update order as failed
        await db.order.update({
          where: { id: order.id },
          data: { 
            paymentStatus: "Failed",
            orderStatus: "Cancelled",
          },
        });

        return NextResponse.json(
          { error: `PayPal payment failed: ${paypalError.message}` },
          { status: 500 }
        );
      }
    }

    // ================= COD / UPI PAYMENT =================
    if (paymentMethod === "cod" || paymentMethod === "upi") {
      // For COD/UPI, we don't need payment processing
      // Just update order status and clear cart
      
      await db.order.update({
        where: { id: order.id },
        data: { 
          paymentStatus: "Pending",
          orderStatus: "Confirmed",
        },
      });

      // Clear user's cart after successful order
      await db.cartItem.deleteMany({
        where: {
          cart: {
            userId: user.id,
          },
        },
      });

      return NextResponse.json({
        success: true,
        order,
        message: "Order placed successfully. Payment will be collected on delivery.",
      });
    }

    // Invalid payment method
    return NextResponse.json(
      { error: "Invalid payment method" },
      { status: 400 }
    );

  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
