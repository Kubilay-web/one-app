"use client";
import Link from "next/link";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { ThemeChanger } from "@/shared/redux/action";
import store from "@/shared/redux/store";
import { connect } from "react-redux";
import { MENUITEMS } from "../sidebar/nav";
import Image from "next/image";
import nextConfig from "@/next.config";
import { logout } from "@/app/(components)/(authentication-layout)/authentication/actions";
import { useQueryClient } from "@tanstack/react-query";
import router from "next/router";

const Header = ({ local_varaiable, ThemeChanger }: any) => {
  const queryClient = useQueryClient(); // React Query Client
  let { basePath } = nextConfig;
  ///****fullscreeen */
  const [isFullscreen, setIsFullscreen] = useState(false);
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const fullscreenChangeHandler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", fullscreenChangeHandler);

    return () => {
      document.removeEventListener("fullscreenchange", fullscreenChangeHandler);
    };
  }, []);
  //Toggle-Function
  const overlayRef: any = useRef(null);

  function toggleSidebar() {
    const theme = store.getState().reducer;
    let sidemenuType = theme.dataNavLayout;
    if (window.innerWidth >= 992) {
      if (sidemenuType === "vertical") {
        let verticalStyle = theme.dataVerticalStyle;
        const navStyle = theme.dataNavStyle;
        switch (verticalStyle) {
          // closed
          case "closed":
            ThemeChanger({ ...theme, dataNavStyle: "" });
            if (theme.toggled === "close-menu-close") {
              ThemeChanger({ ...theme, toggled: "" });
            } else {
              ThemeChanger({ ...theme, toggled: "close-menu-close" });
            }
            break;
          // icon-overlay
          case "overlay":
            ThemeChanger({ ...theme, dataNavStyle: "" });
            if (theme.toggled === "icon-overlay-close") {
              ThemeChanger({ ...theme, toggled: "", iconOverlay: "" });
            } else {
              if (window.innerWidth >= 992) {
                ThemeChanger({
                  ...theme,
                  toggled: "icon-overlay-close",
                  iconOverlay: "",
                });
              }
            }
            break;
          // icon-text
          case "icontext":
            ThemeChanger({ ...theme, dataNavStyle: "" });
            if (theme.toggled === "icon-text-close") {
              ThemeChanger({ ...theme, toggled: "" });
            } else {
              ThemeChanger({ ...theme, toggled: "icon-text-close" });
            }
            break;
          // doublemenu
          case "doublemenu":
            ThemeChanger({ ...theme, dataNavStyle: "" });
            ThemeChanger({ ...theme, dataNavStyle: "" });
            if (theme.toggled === "double-menu-open") {
              ThemeChanger({ ...theme, toggled: "double-menu-close" });
            } else {
              let sidemenu = slidesArrow(".side-menu__item.active");
              if (sidemenu) {
                ThemeChanger({ ...theme, toggled: "double-menu-open" });
                if (sidemenu.nextElementSibling) {
                  sidemenu.nextElementSibling.classList.add(
                    "double-menu-active"
                  );
                } else {
                  ThemeChanger({ ...theme, toggled: "double-menu-close" });
                }
              }
            }
            break;
          // detached
          case "detached":
            if (theme.toggled === "detached-close") {
              ThemeChanger({ ...theme, toggled: "", iconOverlay: "" });
            } else {
              ThemeChanger({
                ...theme,
                toggled: "detached-close",
                iconOverlay: "",
              });
            }

            break;

          // default
          case "default":
            ThemeChanger({ ...theme, toggled: "" });
        }
        switch (navStyle) {
          case "menu-click":
            if (theme.toggled === "menu-click-closed") {
              ThemeChanger({ ...theme, toggled: "" });
            } else {
              ThemeChanger({ ...theme, toggled: "menu-click-closed" });
            }
            break;
          // icon-overlay
          case "menu-hover":
            if (theme.toggled === "menu-hover-closed") {
              ThemeChanger({ ...theme, toggled: "" });
            } else {
              ThemeChanger({ ...theme, toggled: "menu-hover-closed" });
            }
            break;
          case "icon-click":
            if (theme.toggled === "icon-click-closed") {
              ThemeChanger({ ...theme, toggled: "" });
            } else {
              ThemeChanger({ ...theme, toggled: "icon-click-closed" });
            }
            break;
          case "icon-hover":
            if (theme.toggled === "icon-hover-closed") {
              ThemeChanger({ ...theme, toggled: "" });
            } else {
              ThemeChanger({ ...theme, toggled: "icon-hover-closed" });
            }
            break;
        }
      }
    } else {
      if (theme.toggled === "close") {
        ThemeChanger({ ...theme, toggled: "open" });

        setTimeout(() => {
          if (theme.toggled == "open") {
            if (overlayRef.current) {
              overlayRef.current.classList.remove("active");
            }

            if (overlayRef) {
              overlayRef.classList.add("active");
              overlayRef.addEventListener("click", () => {
                if (overlayRef.current) {
                  overlayRef.current.classList.remove("active");
                  menuClose();
                }
              });
            }
          }

          window.addEventListener("resize", () => {
            if (window.screen.width >= 992) {
              if (overlayRef.current) {
                overlayRef.current.classList.remove("active");
              }
            }
          });
        }, 100);
      } else {
        ThemeChanger({ ...theme, toggled: "close" });
      }
    }
  }

  //MenuClose

  function menuClose() {
    const theme = store.getState().reducer;
    if (window.innerWidth <= 992) {
      ThemeChanger({ ...theme, toggled: "close" });
    }
    if (window.innerWidth >= 992) {
      ThemeChanger({
        ...theme,
        toggled: local_varaiable.toggled ? local_varaiable.toggled : "",
      });
    }
  }
  const slidesArrow = (selector: any) => document.querySelector(selector);
  //Search Functionality
  const searchRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleClick = (event: MouseEvent) => {
    const searchInput = searchRef.current;
    const container = containerRef.current;

    // Check if the click is outside the search input and container
    if (
      searchInput &&
      container &&
      !searchInput.contains(event.target as Node) &&
      !container.contains(event.target as Node)
    ) {
      // If the click is outside, remove 'searchdrop' class
      container.classList.remove("searchdrop");
    } else if (
      searchInput &&
      container &&
      (searchInput === event.target ||
        searchInput.contains(event.target as Node))
    ) {
      // If the click is inside the search input, add 'searchdrop' class
      container.classList.add("searchdrop");
    }
  };
  const bodyRef = useRef<any>(null);
  useEffect(() => {
    bodyRef.current = document.body;
    // Add event listener when the component is mounted
    bodyRef.current.addEventListener("click", handleClick);

    return () => {
      // Clean up the event listener when the component unmounts
      bodyRef.current.removeEventListener("click", handleClick);
    };
  }, []);

  const searchResultRef = useRef<HTMLDivElement | null>(null);
  const [showa, setShowa] = useState(false);
  const [InputValue, setInputValue] = useState("");
  const [show2, setShow2] = useState(false);
  const [searchcolor, setsearchcolor] = useState("text-dark");
  const [searchval, setsearchval] = useState("Type something");
  const [NavData, setNavData] = useState([]);

  useEffect(() => {
    const clickHandler = (event: any) => {
      if (
        searchResultRef.current &&
        !searchResultRef.current.contains(event.target)
      ) {
        searchResultRef.current.classList.add("!hidden");
      }
    };

    document.addEventListener("click", clickHandler);

    return () => {
      // Clean up the event listener when the component unmounts
      document.removeEventListener("click", clickHandler);
    };
  }, []);

  const myfunction = (inputvalue: string) => {
    if (searchResultRef.current) {
      searchResultRef.current.classList.remove("!hidden");
    }

    const i: any = [];
    const allElement2: any = [];
    MENUITEMS.forEach((mainLevel: any) => {
      if (mainLevel.children) {
        setShowa(true);
        mainLevel.children.forEach((subLevel: any) => {
          i.push(subLevel);
          if (subLevel.children) {
            subLevel.children.forEach((subLevel1: any) => {
              i.push(subLevel1);
              if (subLevel1.children) {
                subLevel1.children.forEach((subLevel2: any) => {
                  i.push(subLevel2);
                });
              }
            });
          }
        });
      }
    });
    for (const allElement of i) {
      if (allElement.title.toLowerCase().includes(inputvalue.toLowerCase())) {
        if (
          allElement.title.toLowerCase().startsWith(inputvalue.toLowerCase())
        ) {
          setShow2(true);

          // Check if the element has a path and doesn't already exist in allElement2 before pushing
          if (
            allElement.path &&
            !allElement2.some((el: any) => el.title === allElement.title)
          ) {
            allElement2.push(allElement);
          }
        }
      }
    }

    if (!allElement2.length || inputvalue === "") {
      if (inputvalue === "") {
        setShow2(false);
        setsearchval("Type something");
        setsearchcolor("text-dark");
      }
      if (!allElement2.length) {
        setShow2(false);
        setsearchcolor("text-danger");
        setsearchval("There is no component with this name");
      }
    }
    setNavData(allElement2);
  };
  //
  const initialNotifications = [
    {
      id: 1,
      icon: "message-dots",
      title: "Messages",
      text1: "John Doe messaged you.",
      text2: "",
      text3: "",
      color: "primary",
      class: "",
    },
    {
      id: 2,
      icon: "shopping-cart",
      title: "Orders",
      text1: "Order",
      text2: " #12345",
      text3: "confirmed.",
      color: "secondary",
      class: "text-warning me-1",
    },
    {
      id: 3,
      icon: "user-circle",
      title: "Profile",
      text1: "Complete your profile for offers!",
      text2: "",
      text3: "",
      color: "success",
      class: "",
    },
    {
      id: 4,
      icon: "gift",
      title: "Offers",
      text1: "20% off electronics!",
      text2: "",
      text3: "",
      color: "orangemain",
      class: "",
    },
    {
      id: 5,
      icon: "calendar",
      title: "Events",
      text1: "Webinar in 1 hour!",
      text2: "",
      text3: "",
      color: "info",
      class: "",
    },
  ];

  const [notifications, setNotifications] = useState(initialNotifications); // assuming 'data' is an array of notifications
  const [unreadCount, setUnreadCount] = useState(5); // initial unread count

  const hasNotifications = notifications.length > 0;

  const handleRemove1 = (id: number) => {
    if (event) {
      event.stopPropagation();
    }
    // Filter out the notification by id
    const updatedNotifications = notifications.filter(
      (notification) => notification.id !== id
    );
    setNotifications(updatedNotifications);
    setUnreadCount(unreadCount - 1); // decrease unread count
  };

  const cartProduct = [
    {
      id: 1,
      src: "/assets/images/ecommerce/png/30.png",
      name: "SoundSync Headphones",
      qty: "2",
      color: "Ocean Blue",
      oldpr: "99",
      newpr: "75",
      class: "cart-headset",
      colorclass: "text-[#19719e]",
    },
    {
      id: 2,
      src: "/assets/images/ecommerce/png/31.png",
      name: "Western Ladies Bag",
      qty: "1",
      color: "Blush Pink",
      oldpr: "149",
      newpr: "120",
      class: "cart-handbag",
      colorclass: "text-[#de8cb2]",
    },
    {
      id: 3,
      src: "/assets/images/ecommerce/png/32.png",
      name: "Elitr Alarm Clock",
      qty: "2",
      color: "Sky Blue",
      oldpr: "49",
      newpr: "30",
      class: "cart-alaramclock",
      colorclass: "text-[#06a7ef]",
    },
    {
      id: 4,
      src: "/assets/images/ecommerce/png/12.png",
      name: "Aus Polo Assn",
      qty: "3",
      color: " Soft Peach",
      oldpr: "129",
      newpr: "70",
      class: "cart-sweatshirt",
      colorclass: "text-[#decac1]",
    },
    {
      id: 5,
      src: "/assets/images/ecommerce/png/16.png",
      name: "Smart Watch",
      qty: "1",
      color: "Crimson Red",
      oldpr: "249",
      newpr: "200",
      class: "cart-smartwatch",
      colorclass: "text-[#fb6c67]",
    },
  ];

  const [cartItems, setCartItems] = useState([...cartProduct]);
  const [cartItemCount, setCartItemCount] = useState(cartProduct.length);
  const handleRemove = (
    itemId: number,
    event: { stopPropagation: () => void }
  ) => {
    event.stopPropagation();
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
    setCartItemCount(updatedCart.length);
  };

  const Toggledark = () => {
    ThemeChanger({
      ...local_varaiable,
      class: local_varaiable.class == "dark" ? "light" : "dark",
      dataHeaderStyles:
        local_varaiable.class == "dark" ? "transparent" : "transparent",
      dataMenuStyles: local_varaiable.class == "dark" ? "light" : "dark",
      // "dataMenuStyles": local_varaiable.dataNavLayout == 'horizontal' ? local_varaiable.class == 'dark' ? 'light' : 'dark'
    });

    const theme = store.getState().reducer;

    if (local_varaiable.class == "dark") {
      console.log("Switching to light theme");
      ThemeChanger({
        ...theme,
        bodyBg: "",
        lightRgb: "",
        bodyBg2: "",
        inputBorder: "",
        formControlBg: "",
        gray: "",
        darkBg: "",
      });
      localStorage.setItem("mamixlighttheme", "light");
      localStorage.removeItem("mamixdarktheme");
      localStorage.removeItem("mamixMenu");
      localStorage.removeItem("mamixHeader");
      localStorage.removeItem("darkBg");
      localStorage.removeItem("bodyBg");
    } else {
      localStorage.setItem("mamixdarktheme", "dark");
      localStorage.removeItem("mamixlighttheme");
      localStorage.removeItem("mamixMenu");
      localStorage.removeItem("mamixHeader");
      localStorage.removeItem("darkBg");
      localStorage.removeItem("bodyBg");
    }
  };

  return (
    <Fragment>
      <header className="app-header">
        <nav className="main-header" aria-label="Global">
          <div className="main-header-container ">
            <div className="header-content-left">
              {/* <!-- Start::header-element --> */}

              <div className="header-element !items-center">
                {/* <!-- Start::header-link --> */}
                <Link
                  scroll={false}
                  aria-label="Hide Sidebar"
                  className="sidemenu-toggle animated-arrow  hor-toggle horizontal-navtoggle inline-flex items-center"
                  onClick={() => toggleSidebar()}
                  href="#!"
                >
                  <span></span>
                </Link>
                {/* <!-- End::header-link --> */}
              </div>

              <div className="header-element">
                <div className="horizontal-logo">
                  <div
                    
                    className="header-logo relative"
                  >
                    <img
                      src={`${
                        process.env.NODE_ENV === "production" ? basePath : ""
                      }/assets/images/brand-logos/desktop-logo.png`}
                      alt="logo"
                      className="desktop-logo"
                    />
                    <Image
                      fill
                      src={`${
                        process.env.NODE_ENV === "production" ? basePath : ""
                      }/assets/images/brand-logos/toggle-logo.png`}
                      alt="logo"
                      className="toggle-logo"
                    />
                    <Image
                      fill
                      src={`${
                        process.env.NODE_ENV === "production" ? basePath : ""
                      }/assets/images/brand-logos/desktop-dark.png`}
                      alt="logo"
                      className="desktop-dark"
                    />
                    <Image
                      fill
                      src={`${
                        process.env.NODE_ENV === "production" ? basePath : ""
                      }/assets/images/brand-logos/toggle-dark.png`}
                      alt="logo"
                      className="toggle-dark"
                    />
                    <Image
                      fill
                      src={`${
                        process.env.NODE_ENV === "production" ? basePath : ""
                      }/assets/images/brand-logos/desktop-white.png`}
                      alt="logo"
                      className="desktop-white"
                    />
                    <Image
                      fill
                      src={`${
                        process.env.NODE_ENV === "production" ? basePath : ""
                      }/assets/images/brand-logos/toggle-white.png`}
                      alt="logo"
                      className="toggle-white"
                    />
                  </div>
                </div>
              </div>
              {/* <!-- End::header-element --> */}

              {/* <!-- Start::header-element --> */}

              {/* <!-- End::header-element --> */}

              {/* <!-- Start::header-element --> */}
              <div
                ref={containerRef}
                className="autoComplete_wrapper  header-element header-search md:!block !hidden my-auto relative"
                id="search-modal"
              >
                {/* <!-- Start::header-link --> */}
                <input
                  type="text"
                  className="header-search-bar form-control"
                  id="header-search"
                  placeholder="Search for Results..."
                  autoComplete="off"
                  autoCapitalize="off"
                  onClick={() => {}}
                  ref={searchRef}
                  defaultValue={InputValue}
                  onChange={(ele) => {
                    myfunction(ele.target.value);
                    setInputValue(ele.target.value);
                  }}
                />

                {showa ? (
                  <div
                    className="box search-result !absolute z-[9] search-fix border border-gray-200 dark:border-white/10 mt-1 w-full"
                    ref={searchResultRef}
                  >
                    <div className="box-header">
                      <div className="box-title mb-0 break-all">
                        Search result of {InputValue}
                      </div>
                    </div>
                    <div className="box-body overflow-auto p-2 flex flex-col max-h-[250px]">
                      {show2 ? (
                        NavData.map((e: any, index) => (
                          <div
                            key={index}
                            className="ti-list-group gap-x-3.5 text-gray-800 dark:bg-bgdark dark:border-white/10 dark:text-white"
                          >
                            <Link
                              href={`${e.path}/`}
                              className="search-result-item"
                              onClick={() => {
                                setShowa(false), setInputValue("");
                              }}
                            >
                              {e.title}
                            </Link>
                          </div>
                        ))
                      ) : (
                        <span className={`${searchcolor} `}>{searchval}</span>
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                )}

                <Link
                  scroll={false}
                  href="#!"
                  className="header-search-icon border-0"
                >
                  <i className="bi bi-search"></i>
                </Link>
                {/* <!-- End::header-link --> */}
              </div>
              {/* <!-- End::header-element --> */}
            </div>

            <div className="header-content-right">
              <div className="header-element md:px-[0.5rem] px-1 header-search md:!hidden !block">
                <button
                  aria-label="button"
                  type="button"
                  data-hs-overlay="#search-modal"
                  className="inline-flex flex-shrink-0 justify-center items-center gap-2  rounded-full font-medium focus:ring-offset-0 focus:ring-offset-white transition-all text-xs dark:bg-bgdark dark:hover:bg-black/20 text-textmuted dark:text-textmuted/50 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
                >
                  <i className="bi bi-search header-link-icon"></i>
                </button>
              </div>

              {/* <!-- start header country --> */}
              <div className="header-element md:px-[0.5rem] px-1  header-country hs-dropdown ti-dropdown  hidden sm:block [--placement:bottom-right] rtl:[--placement:bottom-left]">
                <button
                  id="dropdown-flag"
                  type="button"
                  className="hs-dropdown-toggle ti-dropdown-toggle !p-0 flex-shrink-0  !border-0 !rounded-full !shadow-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="header-link-icon"
                    width="32"
                    height="32"
                    viewBox="0 0 256 256"
                  >
                    <rect width="256" height="256" fill="none" />
                    <polygon
                      points="136 184 216 184 176 104 136 184"
                      opacity="0.2"
                    />
                    <path
                      d="M88,127.56A95.78,95.78,0,0,1,56,56h64a95.78,95.78,0,0,1-32,71.56Z"
                      opacity="0.2"
                    />
                    <polyline
                      points="231.97 216 175.97 104 119.97 216"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="16"
                    />
                    <line
                      x1="135.97"
                      y1="184"
                      x2="215.97"
                      y2="184"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="16"
                    />
                    <line
                      x1="87.97"
                      y1="32"
                      x2="87.97"
                      y2="56"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="16"
                    />
                    <line
                      x1="23.97"
                      y1="56"
                      x2="151.97"
                      y2="56"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="16"
                    />
                    <path
                      d="M120,56a96,96,0,0,1-96,96"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="16"
                    />
                    <path
                      d="M61.44,88A96,96,0,0,0,152,152"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="16"
                    />
                  </svg>
                </button>

                <ul className="main-header-dropdown ti-dropdown-menu hs-dropdown-menu hidden">
                  <li>
                    <Link
                      scroll={false}
                      className="ti-dropdown-item flex items-center !py-[0.6rem] !px-4 !border-b dark:!border-defaultborder/10"
                      href="#!"
                    >
                      <span className="avatar avatar-rounded avatar-xs leading-none me-2 custom-img">
                        <Image
                          fill
                          src={`${
                            process.env.NODE_ENV === "production"
                              ? basePath
                              : ""
                          }/assets/images/flags/us_flag.jpg`}
                          alt="img"
                        />
                      </span>
                      English
                    </Link>
                  </li>
                  <li>
                    <Link
                      scroll={false}
                      className="ti-dropdown-item flex items-center !py-[0.6rem] !px-4 !border-b dark:!border-defaultborder/10"
                      href="#!"
                    >
                      <span className="avatar avatar-rounded avatar-xs leading-none me-2 custom-img">
                        <Image
                          fill
                          src={`${
                            process.env.NODE_ENV === "production"
                              ? basePath
                              : ""
                          }/assets/images/flags/spain_flag.jpg`}
                          alt="img"
                        />
                      </span>
                      español
                    </Link>
                  </li>
                  <li>
                    <Link
                      scroll={false}
                      className="ti-dropdown-item flex items-center !py-[0.6rem] !px-4 !border-b dark:!border-defaultborder/10"
                      href="#!"
                    >
                      <span className="avatar avatar-rounded avatar-xs leading-none me-2 custom-img">
                        <Image
                          fill
                          src={`${
                            process.env.NODE_ENV === "production"
                              ? basePath
                              : ""
                          }/assets/images/flags/french_flag.jpg`}
                          alt="img"
                        />
                      </span>
                      français
                    </Link>
                  </li>
                  <li>
                    <Link
                      scroll={false}
                      className="ti-dropdown-item flex items-center !py-[0.6rem] !px-4 !border-b dark:!border-defaultborder/10"
                      href="#!"
                    >
                      <span className="avatar avatar-rounded avatar-xs leading-none me-2 custom-img">
                        <Image
                          fill
                          src={`${
                            process.env.NODE_ENV === "production"
                              ? basePath
                              : ""
                          }/assets/images/flags/uae_flag.jpg`}
                          alt="img"
                        />
                      </span>
                      عربي
                    </Link>
                  </li>
                  <li>
                    <Link
                      scroll={false}
                      className="ti-dropdown-item flex items-center !py-[0.6rem] !px-4 !border-b dark:!border-defaultborder/10"
                      href="#!"
                    >
                      <span className="avatar avatar-rounded avatar-xs leading-none me-2 custom-img">
                        <Image
                          fill
                          src={`${
                            process.env.NODE_ENV === "production"
                              ? basePath
                              : ""
                          }/assets/images/flags/germany_flag.jpg`}
                          alt="img"
                        />
                      </span>
                      Deutsch
                    </Link>
                  </li>
                  <li>
                    <Link
                      scroll={false}
                      className="ti-dropdown-item flex items-center !py-[0.6rem] !px-4 !border-b dark:!border-defaultborder/10"
                      href="#!"
                    >
                      <span className="avatar avatar-rounded avatar-xs leading-none me-2 custom-img">
                        <Image
                          fill
                          src={`${
                            process.env.NODE_ENV === "production"
                              ? basePath
                              : ""
                          }/assets/images/flags/china_flag.jpg`}
                          alt="img"
                        />
                      </span>
                      中国人
                    </Link>
                  </li>
                  <li>
                    <Link
                      scroll={false}
                      className="ti-dropdown-item flex items-center !py-[0.6rem] !px-4 !border-b dark:!border-defaultborder/10"
                      href="#!"
                    >
                      <span className="avatar avatar-rounded avatar-xs leading-none me-2 custom-img">
                        <Image
                          fill
                          src={`${
                            process.env.NODE_ENV === "production"
                              ? basePath
                              : ""
                          }/assets/images/flags/italy_flag.jpg`}
                          alt="img"
                        />
                      </span>
                      Italiano
                    </Link>
                  </li>
                  <li>
                    <Link
                      scroll={false}
                      className="ti-dropdown-item flex items-center !py-[0.6rem] !px-4"
                      href="#!"
                    >
                      <span className="avatar avatar-rounded avatar-xs leading-none me-2 custom-img">
                        <Image
                          fill
                          src={`${
                            process.env.NODE_ENV === "production"
                              ? basePath
                              : ""
                          }/assets/images/flags/russia_flag.jpg`}
                          alt="img"
                        />
                      </span>
                      Русский
                    </Link>
                  </li>
                </ul>
              </div>
              {/* <!-- end header country --> */}

              {/* <!-- light and dark theme --> */}
              <div
                className="header-element header-theme-mode hidden !items-center sm:block md:!px-[0.5rem] px-1"
                onClick={() => Toggledark()}
              >
                <Link
                  scroll={false}
                  aria-label="anchor"
                  className="hs-dark-mode-active:hidden flex hs-dark-mode group flex-shrink-0 justify-center items-center gap-2  rounded-full font-medium transition-all text-xs dark:bg-bgdark dark:hover:bg-black/20 text-textmuted dark:text-textmuted/50 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
                  href="#!"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="header-link-icon"
                    width="32"
                    height="32"
                    fill="#000000"
                    viewBox="0 0 256 256"
                  >
                    <path
                      d="M98.31,130.38ZM94.38,17.62h0A64.06,64.06,0,0,1,17.62,94.38h0A64.12,64.12,0,0,0,55,138.93h0a44.08,44.08,0,0,1,43.33-8.54,68.13,68.13,0,0,1,45.47-47.32l.15,0c0-1,.07-2,.07-3A64,64,0,0,0,94.38,17.62Z"
                      opacity="0.1"
                    ></path>
                    <path d="M164,72a76.45,76.45,0,0,0-12.36,1A71.93,71.93,0,0,0,96.17,9.83a8,8,0,0,0-9.59,9.58A56.45,56.45,0,0,1,88,32,56.06,56.06,0,0,1,32,88a56.45,56.45,0,0,1-12.59-1.42,8,8,0,0,0-9.59,9.59,72.22,72.22,0,0,0,32.29,45.06A52,52,0,0,0,84,224h80a76,76,0,0,0,0-152ZM29.37,104c.87,0,1.75,0,2.63,0a72.08,72.08,0,0,0,72-72c0-.89,0-1.78,0-2.67a55.63,55.63,0,0,1,32,48,76.28,76.28,0,0,0-43,43.4A52,52,0,0,0,54,129.59,56.22,56.22,0,0,1,29.37,104ZM164,208H84a36,36,0,1,1,4.78-71.69c-.37,2.37-.63,4.79-.77,7.23a8,8,0,0,0,16,.92,58.91,58.91,0,0,1,1.88-11.81c0-.16.09-.32.12-.48A60.06,60.06,0,1,1,164,208Z"></path>
                  </svg>
                </Link>
                <Link
                  scroll={false}
                  aria-label="anchor"
                  className="hs-dark-mode-active:flex hidden hs-dark-mode group flex-shrink-0 justify-center items-center gap-2  rounded-full font-medium text-defaulttextcolor  transition-all text-xs dark:bg-bodybg dark:bg-bgdark dark:hover:bg-black/20  dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
                  href="#!"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="header-link-icon"
                    width="32"
                    height="32"
                    fill="#000000"
                    viewBox="0 0 256 256"
                  >
                    <path
                      d="M131.84,84.41v0a68.22,68.22,0,0,0-41.65,46v-.11a44.08,44.08,0,0,0-38.54,5h0a48,48,0,1,1,80.19-50.94Z"
                      opacity="0.1"
                    ></path>
                    <path d="M156,72a76.2,76.2,0,0,0-20.26,2.73,55.63,55.63,0,0,0-9.41-11.54l9.51-13.57a8,8,0,1,0-13.11-9.18L113.22,54A55.9,55.9,0,0,0,88,48c-.58,0-1.16,0-1.74,0L83.37,31.71a8,8,0,1,0-15.75,2.77L70.5,50.82A56.1,56.1,0,0,0,47.23,65.67L33.61,56.14a8,8,0,1,0-9.17,13.11L38,78.77A55.55,55.55,0,0,0,32,104c0,.57,0,1.15,0,1.72L15.71,108.6a8,8,0,0,0,1.38,15.88,8.24,8.24,0,0,0,1.39-.12l16.32-2.88a55.74,55.74,0,0,0,5.86,12.42A52,52,0,0,0,76,224h80a76,76,0,0,0,0-152ZM48,104a40,40,0,0,1,72.54-23.24,76.26,76.26,0,0,0-35.62,40,52.14,52.14,0,0,0-31,4.17A40,40,0,0,1,48,104ZM156,208H76a36,36,0,1,1,4.78-71.69c-.37,2.37-.63,4.79-.77,7.23a8,8,0,0,0,16,.92,58.91,58.91,0,0,1,1.88-11.81c0-.16.09-.32.12-.48A60.06,60.06,0,1,1,156,208Z"></path>
                  </svg>
                </Link>
              </div>
              {/* <!-- End light and dark theme --> */}

              {/* <!-- Header Cart item --> */}
              <div className="header-element cart-dropdown hs-dropdown ti-dropdown md:!block !hidden md:px-[0.5rem] px-1  [--placement:bottom-right] rtl:[--placement:bottom-left]">
                <button
                  id="dropdown-cart"
                  type="button"
                  className="hs-dropdown-toggle relative ti-dropdown-toggle !p-0 !border-0 flex-shrink-0  !rounded-full !shadow-none align-middle text-xs"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="header-link-icon"
                    width="32"
                    height="32"
                    fill="#000000"
                    viewBox="0 0 256 256"
                  >
                    <path
                      d="M224,72l-28.52,92.71A16,16,0,0,1,180.18,176H84.07a16,16,0,0,1-15.39-11.6L42.29,72Z"
                      opacity="0.1"
                    ></path>
                    <path d="M96,216a16,16,0,1,1-16-16A16,16,0,0,1,96,216Zm88-16a16,16,0,1,0,16,16A16,16,0,0,0,184,200ZM231.65,74.35l-28.53,92.71A23.89,23.89,0,0,1,180.18,184H84.07A24.11,24.11,0,0,1,61,166.59L24.82,40H8A8,8,0,0,1,8,24H24.82A16.08,16.08,0,0,1,40.21,35.6L48.32,64H224a8,8,0,0,1,7.65,10.35ZM213.17,80H52.89l23.49,82.2a8,8,0,0,0,7.69,5.8h96.11a8,8,0,0,0,7.65-5.65Z"></path>
                  </svg>
                  <span className="flex absolute h-5 w-5 top-[0rem] end-[2px]  -me-[0.6rem]">
                    <span
                      className="relative inline-flex rounded-full h-[14.7px] w-[14px] text-[0.625rem] bg-primary text-white justify-center items-center"
                      id="cart-icon-badge"
                    >
                      {cartItemCount}
                    </span>
                  </span>
                </button>
                <div
                  className="main-header-dropdown !p-0 hs-dropdown-menu ti-dropdown-menu !w-[25rem] hidden"
                  aria-labelledby="dropdown-cart"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="mb-0 text-[1rem]">
                        Cart Items
                        <span
                          className="badge bg-success/[0.15] text-success ms-1 text-[0.75rem] !rounded-full"
                          id="cart-data"
                        >
                          {cartItemCount}
                        </span>
                      </p>
                      <Link
                        scroll={false}
                        href="/ecommerce/customer/shop"
                        className="ti-btn ti-btn-soft-secondary ti-btn-sm btn-wave"
                      >
                        Continue Shopping{" "}
                        <i className="ti ti-arrow-narrow-right ms-1"></i>
                      </Link>
                    </div>
                  </div>
                  <div>
                    <hr className="dropdown-divider dark:border-white/10" />
                  </div>
                  <ul className="list-none mb-0" id="header-cart-items-scroll">
                    {cartItems.map((idx) => (
                      <li
                        className="ti-dropdown-item !border-b !block dark:!border-defaultborder/10"
                        key={idx.id}
                      >
                        <div className="flex items-center cart-dropdown-item gap-4">
                          <div className="leading-none">
                            <span className="avatar avatar-md bg-gray-300 dark:bg-light">
                              <Image
                                fill
                                src={`${
                                  process.env.NODE_ENV === "production"
                                    ? basePath
                                    : ""
                                }${idx.src}`}
                                alt="img"
                              />
                            </span>
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center justify-between mb-0">
                              <div className="mb-0 text-[0.875rem] font-medium">
                                <Link
                                  scroll={false}
                                  href="/ecommerce/customer/cart/"
                                >
                                  {idx.name}
                                </Link>
                                <div className="text-[0.6875rem] text-textmuted dark:text-textmuted/50">
                                  <span> Qty : {idx.qty},</span>
                                  <span>
                                    {" "}
                                    Color :{" "}
                                    <span
                                      className={`${idx.colorclass} font-semibold`}
                                    >
                                      {idx.color}
                                    </span>
                                  </span>
                                </div>
                              </div>
                              <div className="text-end">
                                <Link
                                  scroll={false}
                                  href="#!"
                                  className="header-cart-remove dropdown-item-close"
                                  onClick={(event) =>
                                    handleRemove(idx.id, event)
                                  }
                                >
                                  <i className="ri-delete-bin-line opacity-40"></i>
                                </Link>
                                <h6 className="font-medium mb-0 mt-1">
                                  ${idx.newpr}
                                  <span className="line-through text-textmuted dark:text-textmuted/50 font-normal ms-1 text-[0.8125rem] inline-block">
                                    ${idx.oldpr}
                                  </span>
                                </h6>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div
                    className={`p-4 empty-header-item   ${
                      cartItemCount === 0 ? "hidden" : "block"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-medium text-[0.875rem]">Total :</div>
                      <h5 className="mb-0 font-medium">$740</h5>
                    </div>
                    <div className="text-center grid">
                      <Link
                        href="/ecommerce/customer/checkout/"
                        className="ti-btn ti-btn-primary btn-wave waves-effect waves-light"
                      >
                        Proceed to checkout
                      </Link>
                    </div>
                  </div>

                  <div
                    className={`p-[3rem] empty-item ${
                      cartItemCount === 0 ? "block" : "hidden"
                    }`}
                  >
                    <div className="text-center">
                      <span className="!w-[4rem] !h-[4rem] !leading-[4rem] !rounded-full avatar bg-primary/10 !text-primary">
                        <i className="ri-shopping-cart-2-line text-[2rem]"></i>
                      </span>
                      <h6 className="font-medium mb-1 mt-3 text-[1rem] text-defaulttextcolor dark:text-white">
                        Your Cart is Empty
                      </h6>
                      <span className="mb-3 !font-normal text-[0.8125rem] block text-textmuted dark:text-textmuted/50">
                        Add some items to make me happy :)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!--End Header cart item  --> */}

              {/* <!--Header Notifictaion --> */}
              <div className="header-element  md:px-[0.5rem] px-1 notifications-dropdown header-notification hs-dropdown ti-dropdown !hidden xl:!block [--placement:bottom-right] rtl:[--placement:bottom-left]">
                <button
                  id="dropdown-notification"
                  type="button"
                  className="hs-dropdown-toggle relative ti-dropdown-toggle !p-0 !border-0 flex-shrink-0  !rounded-full !shadow-none align-middle text-xs"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="header-link-icon animate-bell"
                    width="32"
                    height="32"
                    fill="#000000"
                    viewBox="0 0 256 256"
                  >
                    <path
                      d="M208,192H48a8,8,0,0,1-6.88-12C47.71,168.6,56,139.81,56,104a72,72,0,0,1,144,0c0,35.82,8.3,64.6,14.9,76A8,8,0,0,1,208,192Z"
                      opacity="0.1"
                    ></path>
                    <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"></path>
                  </svg>
                  <span className="flex absolute h-[15px] w-[15px] top-[5px] end-[10px]  -me-[0.6rem]">
                    <span className="animate-slow-ping absolute inline-flex -top-[6px] -start-[5px] h-full w-full rounded-full bg-secondary/40 opacity-75"></span>
                    <span className="relative inline-flex justify-center items-center rounded-full  !h-[5px] !w-[5px] bg-secondary"></span>
                  </span>
                </button>
                <div
                  className="main-header-dropdown ti-dropdown-menu hs-dropdown-menu hidden"
                  data-popper-placement="none"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="mb-0 text-[1rem]">Notifications</p>
                      <span
                        className="badge bg-secondary/10 text-secondary !rounded-sm"
                        id="notifiation-data"
                      >{`${notifications.length} Unread`}</span>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <ul
                    className="ti-list-unstyled mb-0"
                    id="header-notification-scroll"
                  >
                    {notifications.map((idx, index) => (
                      <li
                        className="ti-dropdown-item !block !border-b dark:!border-defaultborder/10"
                        key={index}
                      >
                        <div className="flex items-center">
                          <div className="pe-2 leading-none">
                            <span
                              className={`avatar avatar-md avatar-rounded bg-${idx.color} text-white`}
                            >
                              <i
                                className={`ti ti-${idx.icon} text-[1.25rem]`}
                              ></i>
                            </span>
                          </div>
                          <div className="flex-grow flex items-center justify-between">
                            <div>
                              <p className="mb-0 font-medium">
                                <Link scroll={false} href="#!">
                                  {idx.title}
                                </Link>
                              </p>
                              <div className="text-textmuted dark:text-textmuted/50 font-normal text-[0.75rem] header-notification-text truncate">
                                {idx.text1}
                                <span className={idx.class}>{idx.text2}</span>
                                {idx.text3}
                              </div>
                            </div>
                            <div>
                              <Link
                                scroll={false}
                                href="#!"
                                className="min-w-fit-content text-textmuted dark:text-textmuted/50 dropdown-item-close1"
                                onClick={() => handleRemove1(idx.id)}
                              >
                                <i className="ri-close-circle-line opacity-40 text-[1.25rem]"></i>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div
                    className={`p-4 empty-header-item1  ${
                      notifications.length === 0 ? "hidden" : "block"
                    }`}
                  >
                    <div className="grid">
                      <Link
                        scroll={false}
                        href="#!"
                        className="ti-btn ti-btn-primary btn-wave"
                      >
                        View All
                      </Link>
                    </div>
                  </div>
                  <div
                    className={`p-[3rem] empty-item1 ${
                      notifications.length === 0 ? "block" : "hidden"
                    }`}
                  >
                    <div className="text-center">
                      <span className="avatar avatar-xl avatar-rounded bg-secondary/10 text-secondary">
                        <i className="ri-notification-off-line text-[2rem]"></i>
                      </span>
                      <h6 className="font-medium mt-4">No New Notifications</h6>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!--End Header Notifictaion --> */}

              {/* <!-- Fullscreen --> */}
              <li className="header-element header-fullscreen">
                {/* <!-- Start::header-link --> */}
                <Link
                  scroll={false}
                  onClick={toggleFullscreen}
                  href="#!"
                  className="header-link"
                  aria-label="anchor"
                >
                  {isFullscreen ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="full-screen-close header-link-icon block"
                      width="32"
                      height="32"
                      fill="#000000"
                      viewBox="0 0 256 256"
                    >
                      <path
                        d="M208,48V96L160,48ZM48,208H96L48,160Z"
                        opacity="0.1"
                      ></path>
                      <path d="M208,40H160a8,8,0,0,0-5.66,13.66L172.69,72l-34.35,34.34a8,8,0,0,0,11.32,11.32L184,83.31l18.34,18.35A8,8,0,0,0,216,96V48A8,8,0,0,0,208,40Zm-8,36.69L179.31,56H200Zm-93.66,61.65L72,172.69,53.66,154.34A8,8,0,0,0,40,160v48a8,8,0,0,0,8,8H96a8,8,0,0,0,5.66-13.66L83.31,184l34.35-34.34a8,8,0,0,0-11.32-11.32ZM56,200V179.31L76.69,200Z"></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="full-screen-open header-link-icon block"
                      width="32"
                      height="32"
                      fill="#000000"
                      viewBox="0 0 256 256"
                    >
                      <path
                        d="M208,48V88L168,48ZM48,208H88L48,168Zm160,0V168l-40,40ZM48,88,88,48H48Z"
                        opacity="0.1"
                      ></path>
                      <path d="M208,40H168a8,8,0,0,0-5.66,13.66l40,40A8,8,0,0,0,216,88V48A8,8,0,0,0,208,40Zm-8,28.69L187.31,56H200ZM53.66,162.34A8,8,0,0,0,40,168v40a8,8,0,0,0,8,8H88a8,8,0,0,0,5.66-13.66ZM56,200V187.31L68.69,200Zm155.06-39.39a8,8,0,0,0-8.72,1.73l-40,40A8,8,0,0,0,168,216h40a8,8,0,0,0,8-8V168A8,8,0,0,0,211.06,160.61ZM200,200H187.31L200,187.31ZM88,40H48a8,8,0,0,0-8,8V88a8,8,0,0,0,13.66,5.66l40-40A8,8,0,0,0,88,40ZM56,68.69V56H68.69Z"></path>
                    </svg>
                  )}
                </Link>
                {/* <!-- End::header-link --> */}
              </li>
              {/* <!-- End Full screen --> */}

              {/* <!-- Header Profile --> */}
              <div className="header-element md:!px-[0.5rem] px-2 ti-dropdown hs-dropdown !items-center [--placement:bottom-right] rtl:[--placement:bottom-left]">
                <button
                  id="dropdown-profile"
                  type="button"
                  className="hs-dropdown-toggle ti-dropdown-toggle !gap-2 !p-0 flex-shrink-0 sm:me-2 me-0 !rounded-full !shadow-none text-xs align-middle !border-0 !shadow-transparent "
                >
                  <Image
                    fill
                    src={`${
                      process.env.NODE_ENV === "production" ? basePath : ""
                    }/assets/images/faces/14.jpg`}
                    alt="Image Description"
                    className="avatar avatar-sm avatar-rounded inline-block"
                  />
                </button>

                <div className="xl:block hidden dropdown-profile">
                  <span className="font-medium leading-none">Mr. Jack</span>
                </div>

                <ul className="main-header-dropdown ti-dropdown-menu hs-dropdown-menu !w-[11rem] hidden pt-0 overflow-hidden header-profile-dropdown">
                  <li>
                    <Link
                      scroll={false}
                      className="ti-dropdown-item !py-[0.6rem] !px-4 !border-b flex items-center  dark:!border-defaultborder/10"
                      href="/pages/profile"
                    >
                      <i className="ti ti-user me-2 text-[1.125rem] text-primary"></i>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      scroll={false}
                      className="ti-dropdown-item !py-[0.6rem] !px-4 !border-b flex items-center  dark:!border-defaultborder/10"
                      href="/pages/email/mail-app"
                    >
                      <i className="ti ti-mail me-2 text-[1.125rem] text-secondary"></i>
                      Inbox
                    </Link>
                  </li>
                  <li>
                    <Link
                      scroll={false}
                      className="ti-dropdown-item !py-[0.6rem] !px-4 !border-b flex items-center  dark:!border-defaultborder/10"
                      href="/pages/todolist"
                    >
                      <i className="ti ti-checklist me-2 text-[1.125rem] text-success"></i>
                      Task Manager
                    </Link>
                  </li>
                  <li>
                    <Link
                      scroll={false}
                      className="ti-dropdown-item !py-[0.6rem] !px-4 !border-b flex items-center  dark:!border-defaultborder/10"
                      href="/pages/email/mail-settings"
                    >
                      <i className="ti ti-settings me-2 text-[1.125rem] text-orangemain"></i>
                      Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      scroll={false}
                      className="ti-dropdown-item !py-[0.6rem] !px-4 !border-b flex items-center  dark:!border-defaultborder/10"
                      href="/pages/chat"
                    >
                      <i className="ti ti-headset me-2 text-[1.125rem] text-info"></i>
                      Support
                    </Link>
                  </li>
                  <li
                    onClick={() => {
                      queryClient.clear();
                      logout();
                    }}
                  >
                    <Link
                      scroll={false}
                      className="ti-dropdown-item !py-[0.6rem] !px-4 flex items-center"
                      href="/authentication/sign-in/cover"
                    >
                      <i className="ti ti-logout me-2 text-[1.125rem] text-warning"></i>
                      Log Out
                    </Link>
                  </li>
                </ul>
              </div>
              {/* <!-- End Header Profile --> */}

              {/* <!-- Switcher Icon --> */}
              <div className="header-element md:px-[0.48rem]">
                <button
                  aria-label="button"
                  type="button"
                  className="hs-dropdown-toggle switcher-icon inline-flex flex-shrink-0 justify-center items-center gap-2  rounded-full font-medium  align-middle transition-all text-xs text-textmuted dark:text-textmuted/50 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
                  data-hs-overlay="#hs-overlay-switcher"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="header-link-icon animate-spin-slow"
                    width="32"
                    height="32"
                    fill="#000000"
                    viewBox="0 0 256 256"
                  >
                    <path
                      d="M230.1,108.76,198.25,90.62c-.64-1.16-1.31-2.29-2-3.41l-.12-36A104.61,104.61,0,0,0,162,32L130,49.89c-1.34,0-2.69,0-4,0L94,32A104.58,104.58,0,0,0,59.89,51.25l-.16,36c-.7,1.12-1.37,2.26-2,3.41l-31.84,18.1a99.15,99.15,0,0,0,0,38.46l31.85,18.14c.64,1.16,1.31,2.29,2,3.41l.12,36A104.61,104.61,0,0,0,94,224l32-17.87c1.34,0,2.69,0,4,0L162,224a104.58,104.58,0,0,0,34.08-19.25l.16-36c.7-1.12,1.37-2.26,2-3.41l31.84-18.1A99.15,99.15,0,0,0,230.1,108.76ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z"
                      opacity="0.1"
                    ></path>
                    <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm109.94-52.79a8,8,0,0,0-3.89-5.4l-29.83-17-.12-33.62a8,8,0,0,0-2.83-6.08,111.91,111.91,0,0,0-36.72-20.67,8,8,0,0,0-6.46.59L128,41.85,97.88,25a8,8,0,0,0-6.47-.6A111.92,111.92,0,0,0,54.73,45.15a8,8,0,0,0-2.83,6.07l-.15,33.65-29.83,17a8,8,0,0,0-3.89,5.4,106.47,106.47,0,0,0,0,41.56,8,8,0,0,0,3.89,5.4l29.83,17,.12,33.63a8,8,0,0,0,2.83,6.08,111.91,111.91,0,0,0,36.72,20.67,8,8,0,0,0,6.46-.59L128,214.15,158.12,231a7.91,7.91,0,0,0,3.9,1,8.09,8.09,0,0,0,2.57-.42,112.1,112.1,0,0,0,36.68-20.73,8,8,0,0,0,2.83-6.07l.15-33.65,29.83-17a8,8,0,0,0,3.89-5.4A106.47,106.47,0,0,0,237.94,107.21Zm-15,34.91-28.57,16.25a8,8,0,0,0-3,3c-.58,1-1.19,2.06-1.81,3.06a7.94,7.94,0,0,0-1.22,4.21l-.15,32.25a95.89,95.89,0,0,1-25.37,14.3L134,199.13a8,8,0,0,0-3.91-1h-.19c-1.21,0-2.43,0-3.64,0a8.1,8.1,0,0,0-4.1,1l-28.84,16.1A96,96,0,0,1,67.88,201l-.11-32.2a8,8,0,0,0-1.22-4.22c-.62-1-1.23-2-1.8-3.06a8.09,8.09,0,0,0-3-3.06l-28.6-16.29a90.49,90.49,0,0,1,0-28.26L61.67,97.63a8,8,0,0,0,3-3c.58-1,1.19-2.06,1.81-3.06a7.94,7.94,0,0,0,1.22-4.21l.15-32.25a95.89,95.89,0,0,1,25.37-14.3L122,56.87a8,8,0,0,0,4.1,1c1.21,0,2.43,0,3.64,0a8,8,0,0,0,4.1-1l28.84-16.1A96,96,0,0,1,188.12,55l.11,32.2a8,8,0,0,0,1.22,4.22c.62,1,1.23,2,1.8,3.06a8.09,8.09,0,0,0,3,3.06l28.6,16.29A90.49,90.49,0,0,1,222.9,142.12Z"></path>
                  </svg>
                </button>
              </div>
              {/* <!-- Switcher Icon --> */}

              {/* <!-- End::header-element --> */}
            </div>
          </div>
        </nav>
      </header>

      <div
        id="search-modal"
        className="hs-overlay ti-modal hidden mt-[1.75rem]"
        tabIndex={-1}
      >
        <div className="ti-modal-box">
          <div className="ti-modal-content !border !border-defaultborder dark:!border-defaultborder/10 !rounded-[0.5rem]">
            <div className="ti-modal-body">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control !border-s border-e-0"
                  placeholder="Search Anything ..."
                  aria-label="Search Anything ..."
                  aria-describedby="button-addon2"
                />
                <button
                  className="ti-btn ti-btn-primary !m-0"
                  type="button"
                  id="button-addon2"
                >
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state: any) => ({
  local_varaiable: state.reducer,
});
export default connect(mapStateToProps, { ThemeChanger })(Header);
function setIsClient(arg0: boolean) {
  throw new Error("Function not implemented.");
}
