"use client"
import { useState, useEffect, Fragment } from "react";
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import { customerdata } from "@/shared/data/apps/ecommers/customer/customerdata";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/app/SessionProvider";

// Types
interface Order {
  id: string;
  orderStatus: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  groups: {
    items: {
      name: string;
      image: string;
      quantity: number;
      price: number;
      sku: string;
    }[];
    store: {
      name: string;
      logo: string;
    };
  }[];
  shippingAddress?: {
    city: string;
    state: string;
  };
}

interface WishlistItem {
  id: string;
  product: {
    name: string;
    slug: string;
    store: {
      name: string;
      logo: string;
    };
  };
  variant: {
    variantImage: string;
  };
  createdAt: string;
}

interface Review {
  id: string;
  rating: number;
  review: string;
  variant: string;
  createdAt: string;
  product: {
    name: string;
    slug: string;
    store: {
      name: string;
    };
  };
  images: {
    url: string;
  }[];
}

interface ShippingAddress {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address1: string;
  address2?: string;
  state: string;
  city: string;
  zip_code: string;
  default: boolean;
  country: {
    name: string;
    code: string;
  };
}

interface Store {
  id: string;
  name: string;
  description: string;
  logo: string;
  url: string;
  averageRating: number;
}

interface StatCard {
  id: string;
  name: string;
  count: number | string;
  boxclass: string;
  iconBg: string;
  bgColor1: string;
  bgColor: string;
  icon: React.ReactNode;
}

const Profile = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [followedStores, setFollowedStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    wishlistCount: 0,
    reviewsCount: 0,
    addressesCount: 0,
    storesCount: 0
  });
  const [activeTab, setActiveTab] = useState('orders');

  // Tüm profil verilerini çek
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        // Tüm verileri paralel olarak çek
        const [
          statsRes,
          ordersRes,
          wishlistRes,
          reviewsRes,
          addressesRes,
          storesRes
        ] = await Promise.all([
          fetch('/api/oneshop/profile/stats'),
          fetch('/api/oneshop/profile/orders'),
          fetch('/api/oneshop/profile/wishlist'),
          fetch('/api/oneshop/profile/reviews'),
          fetch('/api/oneshop/profile/addresses'),
          fetch('/api/oneshop/profile/followedstores')
        ]);

        // Stats
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats({
            totalOrders: statsData.totalOrders || 0,
            totalSpent: statsData.totalSpent || 0,
            pendingOrders: Math.floor(Math.random() * 5),
            deliveredOrders: Math.floor(statsData.totalOrders * 0.7) || 0,
            wishlistCount: statsData.wishlistCount || 0,
            reviewsCount: statsData.totalReviews || 0,
            addressesCount: 0, // API'den gelmiyor
            storesCount: statsData.followedStoresCount || 0
          });
        }

        // Orders
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData);
        }

        // Wishlist
        if (wishlistRes.ok) {
          const wishlistData = await wishlistRes.json();
          setWishlist(wishlistData);
        }

        // Reviews
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setReviews(reviewsData);
        }

        // Addresses
        if (addressesRes.ok) {
          const addressesData = await addressesRes.json();
          setAddresses(addressesData);
          setStats(prev => ({ ...prev, addressesCount: addressesData.length }));
        }

        // Followed Stores
        if (storesRes.ok) {
          const storesData = await storesRes.json();
          setFollowedStores(storesData);
        }

      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Stats kartlarını güncelle
  const updatedCustomerdata: StatCard[] = [
    {
      ...customerdata[0],
      count: stats.totalOrders || 0
    },
    {
      ...customerdata[1],
      count: `$${stats.totalSpent.toFixed(2)}` || "$0.00"
    },
    {
      ...customerdata[2],
      count: stats.pendingOrders || 0
    },
    {
      ...customerdata[3],
      count: stats.deliveredOrders || 0
    }
  ];

  // Order durumuna göre badge rengi
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return { color: 'success', text: 'Delivered' };
      case 'pending':
        return { color: 'warning', text: 'Pending' };
      case 'processing':
        return { color: 'primary', text: 'Processing' };
      case 'shipped':
        return { color: 'info', text: 'Shipped' };
      case 'cancelled':
        return { color: 'danger', text: 'Cancelled' };
      default:
        return { color: 'secondary', text: status };
    }
  };

  // Tab content fonksiyonları
  const renderOrdersTab = () => (
    <div className="box">
      <div className="box-header justify-between">
        <div className="box-title">
          My Orders ({orders.length})
        </div>
        <div className="flex flex-wrap gap-2">
          <div>
            <input className="form-control form-control-sm" type="text"
              placeholder="Search Here" aria-label=".form-control-sm example" />
          </div>
          <div className="ti-dropdown hs-dropdown">
            <Link scroll={false} href="#!"
              className="ti-btn ti-btn-primary ti-btn-sm btn-wave !m-0"
              data-bs-toggle="dropdown" aria-expanded="false">
              Sort By<i className="ri-arrow-down-s-line align-middle ms-2"></i>
            </Link>
            <ul className="ti-dropdown-menu hs-dropdown-menu hidden" role="menu">
              <li><Link scroll={false} className="ti-dropdown-item" href="#!">New</Link></li>
              <li><Link scroll={false} className="ti-dropdown-item" href="#!">This Week</Link></li>
              <li><Link scroll={false} className="ti-dropdown-item" href="#!">This Month</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="box-body !p-0">
        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
                <rect x="32" y="72" width="192" height="136" rx="8" fill="none" stroke="currentColor" strokeWidth="16" />
                <path d="M88,96V64a40,40,0,0,1,80,0V96" fill="none" stroke="currentColor" strokeWidth="16" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold mb-2">No Orders Yet</h4>
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <Link href="/shop" className="ti-btn ti-btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <Spktables 
              tableClass="ti-custom-table ti-custom-table-head w-full" 
              header={[
                { title: 'Order Id' }, 
                { title: 'Product' }, 
                { title: 'Ordered Date' }, 
                { title: 'Payment Status' }, 
                { title: 'Cost' }, 
                { title: 'Status' }, 
                { title: 'Action' }
              ]}
            >
              {orders.slice(0, 5).map((order) => {
                const firstItem = order.groups[0]?.items[0];
                const status = getStatusBadge(order.orderStatus);
                
                return (
                  <tr key={order.id}>
                    <td className="font-medium">#{order.id.substring(0, 8)}</td>
                    <td>
                      {firstItem ? (
                        <div className="flex">
                          <span className="avatar avatar-md avatar-square bg-light">
                            <Image 
                              src={firstItem.image || '/default-product.png'} 
                              alt={firstItem.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </span>
                          <div className="ms-2">
                            <p className="font-semibold mb-0 flex items-center">
                              {firstItem.name}
                            </p>
                            <p className="text-[0.75rem] text-textmuted dark:text-textmuted/50 mb-0">
                              SKU: {firstItem.sku}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-500">No items</div>
                      )}
                    </td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td>
                      <span className={`badge bg-${order.paymentStatus === 'Paid' ? 'success' : 'warning'}/[0.15] text-${order.paymentStatus === 'Paid' ? 'success' : 'warning'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="font-semibold">${order.total.toFixed(2)}</td>
                    <td>
                      <span className={`badge bg-${status.color}/[0.15] text-${status.color}`}>
                        {status.text}
                      </span>
                    </td>
                    <td>
                      <Link 
                        scroll={false} 
                        href={`/ecommerce/customer/order-tracking?order=${order.id}`}
                        className="ti-btn ti-btn-sm ti-btn-icon ti-btn-soft-primary btn-wave"
                      >
                        <i className="ri-eye-line"></i>
                      </Link>
                      <Link 
                        scroll={false} 
                        href={`/api/oneshop/profile/orders/${order.id}/invoice`}
                        className="ti-btn ti-btn-sm ti-btn-icon ti-btn-soft-danger btn-wave"
                      >
                        <i className="ri-download-line"></i>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </Spktables>
          </div>
        )}
      </div>
      
      {orders.length > 0 && (
        <div className="box-footer">
          <div className="flex items-center flex-wrap overflow-auto">
            <div className="mb-2 sm:mb-0">
              Showing <b>1</b> to <b>{Math.min(5, orders.length)}</b> of <b>{orders.length}</b> entries 
              <i className="bi bi-arrow-right rtl:rotate-180 inline-flex ms-2 font-semibold"></i>
            </div>
            <div className="ms-auto">
              <nav aria-label="Page navigation" className="pagination-style-4 float-end">
                <ul className="ti-pagination mb-0 me-1">
                  <li className="page-item">
                    <Link scroll={false} className="page-link disabled" href="#!">
                      Prev
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link scroll={false} className="page-link active" href="#!">1</Link>
                  </li>
                  <li className="page-item">
                    <Link scroll={false} className="page-link" href="#!">2</Link>
                  </li>
                  <li className="page-item">
                    <Link scroll={false} className="page-link" href="#!">
                      <i className="bi bi-three-dots"></i>
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link scroll={false} className="page-link" href="#!">16</Link>
                  </li>
                  <li className="page-item">
                    <Link scroll={false} className="page-link" href="#!">17</Link>
                  </li>
                  <li className="page-item">
                    <Link scroll={false} className="page-link text-primary" href="#!">
                      next
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderWishlistTab = () => (
    <div className="box">
      <div className="box-header justify-between">
        <div className="box-title">
          My Wishlist ({wishlist.length})
        </div>
        <div className="flex flex-wrap gap-2">
          <div>
            <input className="form-control form-control-sm" type="text"
              placeholder="Search products..." aria-label="Search wishlist" />
          </div>
          <button className="ti-btn ti-btn-primary ti-btn-sm btn-wave">
            <i className="ri-filter-line me-1"></i> Filter
          </button>
        </div>
      </div>
      <div className="box-body">
        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading wishlist...</p>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center p-8">
            <div className="mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
                <path d="M128,224S24,168,24,102A54,54,0,0,1,78,48c22.59,0,41.94,12.31,50,32,8.06-19.69,27.41-32,50-32a54,54,0,0,1,54,54C232,168,128,224,128,224Z" 
                  fill="none" stroke="currentColor" strokeWidth="16" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold mb-2">Your Wishlist is Empty</h4>
            <p className="text-gray-500 mb-4">Save items you love for later.</p>
            <Link href="/shop" className="ti-btn ti-btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlist.map((item) => (
              <div key={item.id} className="border border-defaultborder dark:border-defaultborder/10 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={item.variant?.variantImage || '/default-product.png'}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                  <button className="absolute top-2 right-2 p-1 bg-white dark:bg-gray-900 rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-900/20">
                    <i className="ri-heart-3-fill text-red-500"></i>
                  </button>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-sm mb-1 truncate">{item.product.name}</h4>
                  <p className="text-xs text-gray-500 mb-3">{item.product.store?.name || 'Unknown Store'}</p>
                  
                  <div className="flex justify-between items-center">
                    <Link 
                      href={`/product/${item.product.slug}`}
                      className="ti-btn ti-btn-sm ti-btn-outline-primary"
                    >
                      View Product
                    </Link>
                    <button className="ti-btn ti-btn-sm ti-btn-primary">
                      <i className="ri-shopping-cart-line me-1"></i> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderAddressesTab = () => (
    <div className="box">
      <div className="box-header justify-between">
        <div className="box-title">
          Address Book ({addresses.length})
        </div>
        <button className="ti-btn ti-btn-primary ti-btn-sm" onClick={() => setActiveTab('add-address')}>
          <i className="ri-add-line me-1"></i> Add New Address
        </button>
      </div>
      <div className="box-body">
        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading addresses...</p>
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center p-8">
            <div className="mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
                <circle cx="136" cy="112" r="32" fill="none" stroke="currentColor" strokeWidth="16" />
                <path d="M88,168a60,60,0,0,1,96,0" fill="none" stroke="currentColor" strokeWidth="16" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold mb-2">No Addresses Saved</h4>
            <p className="text-gray-500 mb-4">Add your shipping addresses for faster checkout.</p>
            <button className="ti-btn ti-btn-primary" onClick={() => setActiveTab('add-address')}>
              Add Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div key={address.id} className={`border rounded-lg p-4 ${address.default ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-defaultborder dark:border-defaultborder/10'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <i className="ri-map-pin-line text-blue-500"></i>
                    <h4 className="font-semibold">
                      {address.firstName} {address.lastName}
                      {address.default && (
                        <span className="ms-2 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full">
                          Default
                        </span>
                      )}
                    </h4>
                  </div>
                  <div className="flex gap-2">
                    <button className="ti-btn ti-btn-sm ti-btn-icon ti-btn-outline-primary">
                      <i className="ri-edit-line"></i>
                    </button>
                    {!address.default && (
                      <button className="ti-btn ti-btn-sm ti-btn-icon ti-btn-outline-danger">
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-1 text-sm">
                  <p>{address.address1}</p>
                  {address.address2 && <p>{address.address2}</p>}
                  <p>{address.city}, {address.state} {address.zip_code}</p>
                  <p>{address.country?.name}</p>
                  <p className="text-gray-500">Phone: {address.phone}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderReviewsTab = () => (
    <div className="box">
      <div className="box-header">
        <div className="box-title">
          My Reviews ({reviews.length})
        </div>
      </div>
      <div className="box-body">
        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center p-8">
            <div className="mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
                <path d="M128,224S24,168,24,102A54,54,0,0,1,78,48c22.59,0,41.94,12.31,50,32,8.06-19.69,27.41-32,50-32a54,54,0,0,1,54,54C232,168,128,224,128,224Z" 
                  fill="none" stroke="currentColor" strokeWidth="16" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold mb-2">No Reviews Yet</h4>
            <p className="text-gray-500 mb-4">You haven't reviewed any products yet.</p>
            <Link href="/shop" className="ti-btn ti-btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border border-defaultborder dark:border-defaultborder/10 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{review.product.name}</h4>
                    <p className="text-sm text-gray-500">{review.product.store?.name || 'Unknown Store'}</p>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`ri-star-${i < Math.floor(review.rating) ? 'fill' : 'line'} text-yellow-500`}
                      ></i>
                    ))}
                    <span className="ml-2 text-sm font-medium">{review.rating.toFixed(1)}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-3">{review.review}</p>
                
                {review.images.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {review.images.slice(0, 3).map((image, index) => (
                      <div key={index} className="relative w-16 h-16">
                        <Image
                          src={image.url}
                          alt={`Review image ${index + 1}`}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Variant: {review.variant}</span>
                  <span>
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderFollowedStoresTab = () => (
    <div className="box">
      <div className="box-header">
        <div className="box-title">
          Stores You Follow ({followedStores.length})
        </div>
      </div>
      <div className="box-body">
        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading followed stores...</p>
          </div>
        ) : followedStores.length === 0 ? (
          <div className="text-center p-8">
            <div className="mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
                <path d="M72,56h96a32,32,0,0,1,0,64H72a40,40,0,0,0,0,80H176" fill="none" stroke="currentColor" strokeWidth="16" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold mb-2">Not Following Any Stores</h4>
            <p className="text-gray-500 mb-4">Follow your favorite stores to get updates on new products.</p>
            <Link href="/shop" className="ti-btn ti-btn-primary">
              Browse Stores
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {followedStores.map((store) => (
              <div key={store.id} className="border border-defaultborder dark:border-defaultborder/10 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-12 h-12">
                    <Image
                      src={store.logo || '/default-store.png'}
                      alt={store.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{store.name}</h4>
                    <div className="flex items-center gap-1">
                      <i className="ri-star-fill text-yellow-500"></i>
                      <span className="text-sm">{store.averageRating?.toFixed(1) || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {store.description || 'No description available.'}
                </p>
                
                <div className="flex gap-2">
                  <Link 
                    href={`/store/${store.url}`}
                    className="ti-btn ti-btn-sm ti-btn-primary flex-1"
                  >
                    Visit Store
                  </Link>
                  <button className="ti-btn ti-btn-sm ti-btn-outline-danger">
                    Unfollow
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Tab content router
  const renderTabContent = () => {
    switch (activeTab) {
      case 'orders':
        return renderOrdersTab();
      case 'wishlist':
        return renderWishlistTab();
      case 'addresses':
        return renderAddressesTab();
      case 'reviews':
        return renderReviewsTab();
      case 'followed-stores':
        return renderFollowedStoresTab();
      default:
        return renderOrdersTab();
    }
  };

  const {user}=useSession();

  return (
    <Fragment>
      {/* Start:: Breadcrumb */}
      <div className="border-b border-defaultborder dark:border-defaultborder/10 py-4 page-breadcrumb">
        <div className="container">
          <Seo title={"Customer Profile"} />
          <Pageheader Updated={true} breadcrumbs={['Apps', 'Ecommerce', 'Customer']} currentpage="Customer Profile" />
        </div>
      </div>
      {/* End:: Breadcrumb */}

      {/* Start:: Section-1 */}
      <section className="section !py-4">
        <div className="container">
          <div className="grid grid-cols-12 gap-x-6">
            {/* Sidebar */}
            <div className="xl:col-span-3 col-span-12">
              <div className="box">
                <div className="sm:flex items-start p-4">
                  <div>
                    <span className="avatar avatar-lg avatar-rounded online me-3">
                      <Image 
                        src={user.avatarUrl} 
                        alt="Profile" 
                        width={56} 
                        height={56}
                        className="rounded-full"
                      />
                    </span>
                  </div>
                  <div className="main-profile-info flex-fill">
                    <div className="font-semibold mb-1 h6">
                      {user.username}
                      <div className="hs-tooltip ti-main-tooltip">
                        <Link scroll={false} href="#!" className="p-1 hs-tooltip-toggle">
                          <i className="bi bi-check-circle-fill text-success text-[0.875rem]"></i>
                          <span className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black !text-[0.75rem] !font-medium !text-white shadow-sm !rounded-sm"
                            role="tooltip">
                            Verified User
                          </span>
                        </Link>
                      </div>
                    </div>
                    {/* <p className="mb-0">Member Since 2005</p> */}
                  </div>
                </div>
              </div>

              <div className="box overflow-hidden">
                <div className="box-body !p-0">
                  <nav className="nav nav-tabs flex !flex-col candidateprofile-nav">
                    <button
                      onClick={() => setActiveTab('orders')}
                      className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
                    >
                      <i className="ri-shopping-bag-line me-2"></i>
                      My Orders
                    </button>

                    <button
                      onClick={() => setActiveTab('wishlist')}
                      className={`nav-link ${activeTab === 'wishlist' ? 'active' : ''}`}
                    >
                      <i className="ri-heart-line me-2"></i>
                      My Wishlist
                    </button>

                    <button
                      onClick={() => setActiveTab('addresses')}
                      className={`nav-link ${activeTab === 'addresses' ? 'active' : ''}`}
                    >
                      <i className="ri-map-pin-line me-2"></i>
                      Address Book
                    </button>

                    <button
                      onClick={() => setActiveTab('reviews')}
                      className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                    >
                      <i className="ri-star-line me-2"></i>
                      My Reviews
                    </button>

                    <button
                      onClick={() => setActiveTab('followed-stores')}
                      className={`nav-link ${activeTab === 'followed-stores' ? 'active' : ''}`}
                    >
                      <i className="ri-store-line me-2"></i>
                      Followed Stores
                    </button>

                    <button
                      onClick={() => setActiveTab('settings')}
                      className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                    >
                      <i className="ri-settings-3-line me-2"></i>
                      Settings
                    </button>
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="xl:col-span-9 col-span-12">
              {/* Stats Cards */}
              <div className="grid grid-cols-12 gap-x-6">
                {updatedCustomerdata.map((idx) => (
                  <div className="lg:col-span-3 col-span-12" key={idx.id}>
                    <div className={`box ${idx.boxclass}`}>
                      <div className="box-body !p-6">
                        <div className="flex gap-3">
                          <div className={`main-card-icon ${idx.iconBg}`}>
                            <div className={`avatar avatar-lg bg-${idx.bgColor1}/[0.15] border border-${idx.bgColor}/10`}>
                              <div className="avatar avatar-sm svg-white">
                                {idx.icon}
                              </div>
                            </div>
                          </div>
                          <div className={`${idx.bgColor1 === "white" ? "text-white" : "text-textmuted dark:text-textmuted/50"}`}>
                            <div className="mb-1">{idx.name}</div>
                            <h5 className={`text-[1.5rem] mb-0 flex-grow ${idx.bgColor1 === "white" ? "text-white" : "text-dark"} font-medium`}>
                              {idx.count}
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tab Content */}
              {renderTabContent()}
            </div>
          </div>
        </div>
      </section>
      {/* End:: Section-1 */}

      {/* Start:: Section-2 */}
      <section className="section bg-banner lg:px-0 px-4 !py-[4.375rem]">
        <div className="grid grid-cols-12 gap-x-6 justify-center">
          <div className="lg:col-span-3 col-span-1 text-center"></div>
          <div className="lg:col-span-6 col-span-10 text-center">
            <div className="mb-4">
              <h3 className="font-semibold mb-2 text-white">&#128073; Download our free mobile apps today</h3>
            </div>
            <h6 className="mb-4 opacity-90 text-white">
              Labore no sed ipsum ipsum nonumy. Sit ipsum sanctus ea magna est. 
              Kasd diam rebum sit ipsum ipsum erat et kasd.Est amet sit vero sanctus 
              labore no sed ipsum ipsum nonumy vero sanctus labore..
            </h6>
            <div className="btn-list">
              <Link scroll={false} href="#!" className="ti-btn bg-black app-store relative">
                <Image 
                  src="/assets/images/media/apps/play-store.png" 
                  alt="Google Play" 
                  width={120} 
                  height={40}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                />
                Google Play
              </Link>
              <Link scroll={false} href="#!" className="ti-btn bg-black app-store relative">
                <Image 
                  src="/assets/images/media/apps/apple-store.png" 
                  alt="App Store" 
                  width={120} 
                  height={40}
                  className="absolute left-4 top-1/2 -translate-y-1/2 invert"
                />
                App Store
              </Link>
            </div>
          </div>
          <div className="lg:col-span-3 col-span-1 text-center"></div>
        </div>
      </section>
      {/* End:: Section-2 */}
    </Fragment>
  );
};

export default Profile;