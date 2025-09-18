import { useSession } from "@/app/SessionProvider";
import { User } from "lucia";

const Dashboardicon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="side-menu__icon"
    width="32"
    height="32"
    viewBox="0 0 256 256"
  >
    <path
      d="M216,115.54V208a8,8,0,0,1-8,8H160a8,8,0,0,1-8-8V160a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v48a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V115.54a8,8,0,0,1,2.62-5.92l80-75.54a8,8,0,0,1,10.77,0l80,75.54A8,8,0,0,1,216,115.54Z"
      opacity="0.2"
    ></path>
    <path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z"></path>
  </svg>
);
const Appsicon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="side-menu__icon"
    width="32"
    height="32"
    viewBox="0 0 256 256"
  >
    <path
      d="M112,56v48a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V56a8,8,0,0,1,8-8h48A8,8,0,0,1,112,56Zm88-8H152a8,8,0,0,0-8,8v48a8,8,0,0,0,8,8h48a8,8,0,0,0,8-8V56A8,8,0,0,0,200,48Zm-96,96H56a8,8,0,0,0-8,8v48a8,8,0,0,0,8,8h48a8,8,0,0,0,8-8V152A8,8,0,0,0,104,144Zm96,0H152a8,8,0,0,0-8,8v48a8,8,0,0,0,8,8h48a8,8,0,0,0,8-8V152A8,8,0,0,0,200,144Z"
      opacity="0.2"
    ></path>
    <path d="M200,136H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Zm0,64H152V152h48v48ZM104,40H56A16,16,0,0,0,40,56v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,104,40Zm0,64H56V56h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,64H152V56h48v48Zm-96,32H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm0,64H56V152h48v48Z"></path>
  </svg>
);
const NestedmenuIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="side-menu__icon"
    width="32"
    height="32"
    viewBox="0 0 256 256"
  >
    <path d="M224,80l-96,56L32,80l96-56Z" opacity="0.2"></path>
    <path d="M230.91,172A8,8,0,0,1,228,182.91l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,36,169.09l92,53.65,92-53.65A8,8,0,0,1,230.91,172ZM220,121.09l-92,53.65L36,121.09A8,8,0,0,0,28,134.91l96,56a8,8,0,0,0,8.06,0l96-56A8,8,0,1,0,220,121.09ZM24,80a8,8,0,0,1,4-6.91l96-56a8,8,0,0,1,8.06,0l96,56a8,8,0,0,1,0,13.82l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,24,80Zm23.88,0L128,126.74,208.12,80,128,33.26Z"></path>
  </svg>
);
const Authenticationicon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="side-menu__icon"
    width="32"
    height="32"
    viewBox="0 0 256 256"
  >
    <path
      d="M216,96V208a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V96a8,8,0,0,1,8-8H208A8,8,0,0,1,216,96Z"
      opacity="0.2"
    ></path>
    <path d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Zm-68-56a12,12,0,1,1-12-12A12,12,0,0,1,140,152Z"></path>
  </svg>
);
const Erroricon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="side-menu__icon"
    width="32"
    height="32"
    viewBox="0 0 256 256"
  >
    <path
      d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z"
      opacity="0.2"
    ></path>
    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"></path>
  </svg>
);
const Pagesicon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="side-menu__icon"
    width="32"
    height="32"
    viewBox="0 0 256 256"
  >
    <path
      d="M224,56V200a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V56a8,8,0,0,1,8-8H216A8,8,0,0,1,224,56Z"
      opacity="0.2"
    ></path>
    <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM184,96a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,96Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,128Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,160Z"></path>
  </svg>
);
const Formsicon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="side-menu__icon"
    width="32"
    height="32"
    viewBox="0 0 256 256"
  >
    <path
      d="M216,48H40a8,8,0,0,0-8,8V216l32-16,32,16,32-16,32,16,32-16,32,16V56A8,8,0,0,0,216,48ZM112,160H64V96h48Z"
      opacity="0.2"
    ></path>
    <path d="M216,40H40A16,16,0,0,0,24,56V216a8,8,0,0,0,11.58,7.15L64,208.94l28.42,14.21a8,8,0,0,0,7.16,0L128,208.94l28.42,14.21a8,8,0,0,0,7.16,0L192,208.94l28.42,14.21A8,8,0,0,0,232,216V56A16,16,0,0,0,216,40Zm0,163.06-20.42-10.22a8,8,0,0,0-7.16,0L160,207.06l-28.42-14.22a8,8,0,0,0-7.16,0L96,207.06,67.58,192.84a8,8,0,0,0-7.16,0L40,203.06V56H216ZM136,112a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H144A8,8,0,0,1,136,112Zm0,32a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H144A8,8,0,0,1,136,144ZM64,168h48a8,8,0,0,0,8-8V96a8,8,0,0,0-8-8H64a8,8,0,0,0-8,8v64A8,8,0,0,0,64,168Zm8-64h32v48H72Z"></path>
  </svg>
);
const Elementsicon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="side-menu__icon"
    width="32"
    height="32"
    viewBox="0 0 256 256"
  >
    <path
      d="M216,96v96a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V96Z"
      opacity="0.2"
    ></path>
    <path d="M224,48H32A16,16,0,0,0,16,64V88a16,16,0,0,0,16,16v88a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V104a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM208,192H48V104H208ZM224,88H32V64H224V88ZM96,136a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,136Z"></path>
  </svg>
);
const Advanceuiicon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="side-menu__icon"
    width="32"
    height="32"
    viewBox="0 0 256 256"
  >
    <path
      d="M58.89,154.89l42.22,42.22-50.63,18.4a7.79,7.79,0,0,1-10-10Zm138.82-4.72L105.83,58.29A7.79,7.79,0,0,0,93,61.14l-14.9,41,75.82,75.82,41-14.9A7.79,7.79,0,0,0,197.71,150.17Z"
      opacity="0.2"
    ></path>
    <path d="M111.49,52.63a15.8,15.8,0,0,0-26,5.77L33,202.78A15.83,15.83,0,0,0,47.76,224a16,16,0,0,0,5.46-1l144.37-52.5a15.8,15.8,0,0,0,5.78-26Zm-8.33,135.21-35-35,13.16-36.21,58.05,58.05Zm-55,20,14-38.41,24.45,24.45ZM156,168.64,87.36,100l13-35.87,91.43,91.43ZM160,72a37.8,37.8,0,0,1,3.84-15.58C169.14,45.83,179.14,40,192,40c6.7,0,11-2.29,13.65-7.21A22,22,0,0,0,208,23.94,8,8,0,0,1,224,24c0,12.86-8.52,32-32,32-6.7,0-11,2.29-13.65,7.21A22,22,0,0,0,176,72.06,8,8,0,0,1,160,72ZM136,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm101.66,82.34a8,8,0,1,1-11.32,11.31l-16-16a8,8,0,0,1,11.32-11.32Zm4.87-42.75-24,8a8,8,0,0,1-5.06-15.18l24-8a8,8,0,0,1,5.06,15.18Z"></path>
  </svg>
);
const Utilitiesicon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="side-menu__icon"
    width="32"
    height="32"
    viewBox="0 0 256 256"
  >
    <path
      d="M176,96a48,48,0,1,1-48-48A48,48,0,0,1,176,96Z"
      opacity="0.2"
    ></path>
    <path d="M216,96A88,88,0,1,0,72,163.83V240a8,8,0,0,0,11.58,7.16L128,225l44.43,22.21A8.07,8.07,0,0,0,176,248a8,8,0,0,0,8-8V163.83A87.85,87.85,0,0,0,216,96ZM56,96a72,72,0,1,1,72,72A72.08,72.08,0,0,1,56,96ZM168,227.06l-36.43-18.21a8,8,0,0,0-7.16,0L88,227.06V174.37a87.89,87.89,0,0,0,80,0ZM128,152A56,56,0,1,0,72,96,56.06,56.06,0,0,0,128,152Zm0-96A40,40,0,1,1,88,96,40,40,0,0,1,128,56Z"></path>
  </svg>
);
const Widgetsicon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="side-menu__icon"
    width="32"
    height="32"
    viewBox="0 0 256 256"
  >
    <path
      d="M208,128v72a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V128Z"
      opacity="0.2"
    ></path>
    <path d="M216,72H180.92c.39-.33.79-.65,1.17-1A29.53,29.53,0,0,0,192,49.57,32.62,32.62,0,0,0,158.44,16,29.53,29.53,0,0,0,137,25.91a54.94,54.94,0,0,0-9,14.48,54.94,54.94,0,0,0-9-14.48A29.53,29.53,0,0,0,97.56,16,32.62,32.62,0,0,0,64,49.57,29.53,29.53,0,0,0,73.91,71c.38.33.78.65,1.17,1H40A16,16,0,0,0,24,88v32a16,16,0,0,0,16,16v64a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V136a16,16,0,0,0,16-16V88A16,16,0,0,0,216,72ZM149,36.51a13.69,13.69,0,0,1,10-4.5h.49A16.62,16.62,0,0,1,176,49.08a13.69,13.69,0,0,1-4.5,10c-9.49,8.4-25.24,11.36-35,12.4C137.7,60.89,141,45.5,149,36.51Zm-64.09.36A16.63,16.63,0,0,1,96.59,32h.49a13.69,13.69,0,0,1,10,4.5c8.39,9.48,11.35,25.2,12.39,34.92-9.72-1-25.44-4-34.92-12.39a13.69,13.69,0,0,1-4.5-10A16.6,16.6,0,0,1,84.87,36.87ZM40,88h80v32H40Zm16,48h64v64H56Zm144,64H136V136h64Zm16-80H136V88h80v32Z"></path>
  </svg>
);
const Mapsicon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="side-menu__icon"
    width="32"
    height="32"
    viewBox="0 0 256 256"
  >
    <path
      d="M128,32a96,96,0,1,0,96,96A96,96,0,0,0,128,32Zm16,112L80,176l32-64,64-32Z"
      opacity="0.2"
    ></path>
    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM172.42,72.84l-64,32a8.05,8.05,0,0,0-3.58,3.58l-32,64A8,8,0,0,0,80,184a8.1,8.1,0,0,0,3.58-.84l64-32a8.05,8.05,0,0,0,3.58-3.58l32-64a8,8,0,0,0-10.74-10.74ZM138,138,97.89,158.11,118,118l40.15-20.07Z"></path>
  </svg>
);
const Icons = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="side-menu__icon"
    width="32"
    height="32"
    viewBox="0 0 256 256"
  >
    <path
      d="M224,96v16a32,32,0,0,1-64,0V96H96v16a32,32,0,0,1-64,0V96L46.34,45.8A8,8,0,0,1,54,40H202a8,8,0,0,1,7.69,5.8Z"
      opacity="0.2"
    ></path>
    <path d="M232,96a7.89,7.89,0,0,0-.3-2.2L217.35,43.6A16.07,16.07,0,0,0,202,32H54A16.07,16.07,0,0,0,38.65,43.6L24.31,93.8A7.89,7.89,0,0,0,24,96v16a40,40,0,0,0,16,32v64a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V144a40,40,0,0,0,16-32ZM54,48H202l11.42,40H42.61Zm50,56h48v8a24,24,0,0,1-48,0Zm-16,0v8a24,24,0,0,1-48,0v-8ZM200,208H56V151.2a40.57,40.57,0,0,0,8,.8,40,40,0,0,0,32-16,40,40,0,0,0,64,0,40,40,0,0,0,32,16,40.57,40.57,0,0,0,8-.8Zm-8-72a24,24,0,0,1-24-24v-8h48v8A24,24,0,0,1,192,136Z"></path>
  </svg>
);
const Chartsicon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="side-menu__icon"
    width="32"
    height="32"
    viewBox="0 0 256 256"
  >
    <path d="M208,40V208H152V40Z" opacity="0.2"></path>
    <path d="M224,200h-8V40a8,8,0,0,0-8-8H152a8,8,0,0,0-8,8V80H96a8,8,0,0,0-8,8v40H48a8,8,0,0,0-8,8v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16ZM160,48h40V200H160ZM104,96h40V200H104ZM56,144H88v56H56Z"></path>
  </svg>
);
const Tableicon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="side-menu__icon"
    width="32"
    height="32"
    viewBox="0 0 256 256"
  >
    <path d="M88,104v96H32V104Z" opacity="0.2"></path>
    <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM40,112H80v32H40Zm56,0H216v32H96ZM216,64V96H40V64ZM40,160H80v32H40Zm176,32H96V160H216v32Z"></path>
  </svg>
);

const badge1 = (
  <span className="badge bg-success ms-2 shadow-success">Hot</span>
);
const badge2 = <span className="badge bg-primary ms-2 shadow-primary">8</span>;
const badge3 = (
  <span className="badge bg-secondary ms-2 shadow-secondary">3</span>
);

export const getMenuItems = (user) => [
  {
    menutitle: "MAIN",
  },
  {
    title: "Home",
    icon: Dashboardicon,
    type: "sub",
    active: false,
    children: [
      //facebook
      {
        path: "/home/facebook/pages/home",
        type: "link",
        active: false,
        selected: false,
        title: "Facebook",
      },
      //

      {
        title: "Social",
        icon: Dashboardicon,
        type: "sub",
        active: false,
        children: [
          {
            path: "/home/social",
            type: "link",
            active: false,
            selected: false,
            title: "Social Main",
          },
          {
            path: "/home/social/notifications",
            type: "link",
            active: false,
            selected: false,
            title: "Notifications",
          },
          {
            path: "/home/chat",
            type: "link",
            active: false,
            selected: false,
            title: "Messages",
          },
          {
            path: "/home/social/bookmarks",
            type: "link",
            active: false,
            selected: false,
            title: "Bookmarks",
          },
        ],
      },

      //

      {
        title: "Shop",
        type: "sub",
        active: false,
        children: [
          {
            path: "/home/shop",
            type: "link",
            active: false,
            selected: false,
            title: "Shop Main",
          },
          {
            path: "/home/shop/browse",
            type: "link",
            active: false,
            selected: false,
            title: "Browse",
          },
          {
            path: "/home/shop/cart",
            type: "link",
            active: false,
            selected: false,
            title: "Cart",
          },
          {
            path: "/home/shop/checkout",
            type: "link",
            active: false,
            selected: false,
            title: "Checkout",
          },

          {
            title: "Profile",
            type: "sub",
            active: false,
            children: [
              {
                path: "/home/shop/profile/overview",
                type: "link",
                active: false,
                selected: false,
                title: "Overview",
              },
              {
                path: "/home/shop/profile/orders",
                type: "link",
                active: false,
                selected: false,
                title: "Orders",
              },
              {
                path: "/home/shop/profile/payment",
                type: "link",
                active: false,
                selected: false,
                title: "Payment",
              },
              {
                path: "/home/shop/profile/addresses",
                type: "link",
                active: false,
                selected: false,
                title: "Addresses",
              },
              {
                path: "/home/shop/profile/reviews",
                type: "link",
                active: false,
                selected: false,
                title: "Reviews",
              },
            ],
          },

          {
            path: "/home/shop/seller/apply",
            type: "link",
            active: false,
            selected: false,
            title: "Seller Apply",
          },
        ],
      },
      //

      //Jobs

      {
        title: "Jobs",
        type: "sub",
        active: false,
        children: [
          {
            path: "/home/jobs/main",
            type: "link",
            active: false,
            selected: false,
            title: "Jobs Main",
          },
          {
            path: "/home/jobs/blog",
            type: "link",
            active: false,
            selected: false,
            title: "Blog",
          },
          {
            path: "/home/jobs/candidates",
            type: "link",
            active: false,
            selected: false,
            title: "Candidates",
          },
          {
            path: "/home/jobs/checkout",
            type: "link",
            active: false,
            selected: false,
            title: "Checkout",
          },
          {
            path: "/home/jobs/search-company",
            type: "link",
            active: false,
            selected: false,
            title: "Search Company",
          },
          {
            path: "/home/jobs/company",
            type: "link",
            active: false,
            selected: false,
            title: "Companies",
          },
          {
            path: "/home/jobs/job-details",
            type: "link",
            active: false,
            selected: false,
            title: "Job Details",
          },
          {
            path: "/home/jobs/search-jobs",
            type: "link",
            active: false,
            selected: false,
            title: "Search Jobs",
          },
          {
            path: "/home/jobs/job-post",
            type: "link",
            active: false,
            selected: false,
            title: "Job Post",
          },
          {
            path: "/home/jobs/jobs-list",
            type: "link",
            active: false,
            selected: false,
            title: "Jobs List",
          },
          {
            path: "/home/jobs/search-candidate",
            type: "link",
            active: false,
            selected: false,
            title: "Search Candidate",
          },
          {
            path: "/home/jobs/candidate-details",
            type: "link",
            active: false,
            selected: false,
            title: "Candidate Details",
          },
        ],
      },

      //

      {
        title: "Forum",
        type: "sub",
        active: false,
        children: [
          {
            path: "/home/forum",
            type: "link",
            active: false,
            selected: false,
            title: "Forum Main",
          },
          {
            path: "/home/forum/ask-question",
            type: "link",
            active: false,
            selected: false,
            title: "Ask Question",
          },
          {
            path: "/home/forum/collection",
            type: "link",
            active: false,
            selected: false,
            title: "Collection",
          },
          {
            path: "/home/forum/tags",
            type: "link",
            active: false,
            selected: false,
            title: "Tags",
          },
          {
            path: "/home/forum/community",
            type: "link",
            active: false,
            selected: false,
            title: "Community",
          },
          {
            path: `/home/forum/profile/${user.id}`,
            type: "link",
            active: false,
            selected: false,
            title: "Profile",
          },
          {
            path: "/home/jobs/main",
            type: "link",
            active: false,
            selected: false,
            title: "Jobs",
          },
        ],
      },

      {
        path: "/home/news",
        type: "link",
        active: false,
        selected: false,
        title: "News",
      },

      {
        title: "Real Estate",
        type: "sub",
        active: false,
        children: [
          {
            path: "/home/real-estate/admin",
            type: "link",
            active: false,
            selected: false,
            title: "Admin",
          },
          {
            path: "/real-estate/details",
            type: "link",
            active: false,
            selected: false,
            title: "Details",
          },
          {
            path: "/real-estate/landing",
            type: "link",
            active: false,
            selected: false,
            title: "Landing",
          },
          {
            path: "/real-estate/search",
            type: "link",
            active: false,
            selected: false,
            title: "Search",
          },
          {
            path: "/real-estate/user",
            type: "link",
            active: false,
            selected: false,
            title: "User",
          },
          {
            path: "/real-estate/user-profile",
            type: "link",
            active: false,
            selected: false,
            title: "User Profile",
          },
          {
            path: "/real-estate/vendor",
            type: "link",
            active: false,
            selected: false,
            title: "Vendor",
          },
        ],
      },

      {
        title: "CRM",
        type: "sub",
        active: false,
        children: [
          {
            path: "/home/crm/contacts",
            type: "link",
            active: false,
            selected: false,
            title: "Contacts",
          },
          {
            path: "/home/crm/companies",
            type: "link",
            active: false,
            selected: false,
            title: "Companies",
          },
          {
            path: "/home/crm/deals",
            type: "link",
            active: false,
            selected: false,
            title: "Deals",
          },
          {
            path: "/home/crm/leads",
            type: "link",
            active: false,
            selected: false,
            title: "Leads",
          },
        ],
      },

      {
        title: "Projects",
        type: "sub",
        active: false,
        children: [
          {
            path: "/home/projects/projects-list",
            type: "link",
            active: false,
            selected: false,
            title: "Projects List",
          },
          {
            path: "/home/projects/project-overview",
            type: "link",
            active: false,
            selected: false,
            title: "Project Overview",
          },
          {
            path: "/home/projects/create-project",
            type: "link",
            active: false,
            selected: false,
            title: "Create Project",
          },
        ],
      },

      {
        path: "/pages/todolist",
        type: "link",
        active: false,
        selected: false,
        title: "To Do List",
      },

      {
        path: "/home/full-calendar",
        type: "link",
        active: false,
        selected: false,
        title: "Calendar",
      },

      {
        title: "Invoice",
        type: "sub",
        menusub: true,
        active: false,
        selected: false,
        children: [
          {
            path: "/pages/invoice/create-invoice",
            type: "link",
            active: false,
            selected: false,
            title: "Create Invoice",
          },
          {
            path: "/pages/invoice/invoice-details",
            type: "link",
            active: false,
            selected: false,
            title: "Invoice Details",
          },
          {
            path: "/pages/invoice/invoice-list",
            type: "link",
            active: false,
            selected: false,
            title: "Invoice List",
          },
        ],
      },

      {
        path: "/pages/file-manager",
        type: "link",
        active: false,
        selected: false,
        title: "File Manager",
      },

      {
        title: "Task",
        type: "sub",
        active: false,
        children: [
          {
            path: "/home/task/kanban-board",
            type: "link",
            active: false,
            selected: false,
            title: "Kanban Board",
          },
          {
            path: "/home/task/list-view",
            type: "link",
            active: false,
            selected: false,
            title: "List View",
          },
          {
            path: "/home/task/task-details",
            type: "link",
            active: false,
            selected: false,
            title: "Task Details",
          },
        ],
      },

      {
        title: "Crypto",
        type: "sub",
        active: false,
        children: [
          {
            path: "/home/crypto/transactions",
            type: "link",
            active: false,
            selected: false,
            title: "Transactions",
          },
          {
            path: "/home/crypto/currency-exchange",
            type: "link",
            active: false,
            selected: false,
            title: "Currency Exchange",
          },
          {
            path: "/home/crypto/buy-sell",
            type: "link",
            active: false,
            selected: false,
            title: "Buy & Sell",
          },
          {
            path: "/home/crypto/marketcap",
            type: "link",
            active: false,
            selected: false,
            title: "Marketcap",
          },
          {
            path: "/home/crypto/wallet",
            type: "link",
            active: false,
            selected: false,
            title: "Wallet",
          },
        ],
      },

      {
        title: "NFT",
        type: "sub",
        active: false,
        children: [
          {
            path: "/home/nft/market-place",
            type: "link",
            active: false,
            selected: false,
            title: "Market Place",
          },
          {
            path: "/home/nft/nft-details",
            type: "link",
            active: false,
            selected: false,
            title: "NFT Details",
          },
          {
            path: "/home/nft/create-nft",
            type: "link",
            active: false,
            selected: false,
            title: "Create NFT",
          },
          {
            path: "/home/nft/wallet-integration",
            type: "link",
            active: false,
            selected: false,
            title: "Wallet Integration",
          },
          {
            path: "/home/nft/live-auction",
            type: "link",
            active: false,
            selected: false,
            title: "Live Auction",
          },
        ],
      },

      // {
      //   path: "/dashboards/sales",
      //   type: "link",
      //   active: false,
      //   selected: false,
      //   title: "Sales",
      // },
      // {
      //   path: "/dashboards/analytics",
      //   type: "link",
      //   active: false,
      //   selected: false,
      //   title: "Analytics",
      // },
      // {
      //   path: "/dashboards/ecommerce",
      //   type: "link",
      //   active: false,
      //   selected: false,
      //   title: "Ecommerce",
      // },
      // {
      //   path: "/dashboards/crm",
      //   type: "link",
      //   active: false,
      //   selected: false,
      //   title: "CRM",
      // },
      // {
      //   path: "/dashboards/crypto",
      //   type: "link",
      //   active: false,
      //   selected: false,
      //   title: "Crypto",
      // },
      // {
      //   path: "/dashboards/nft",
      //   type: "link",
      //   active: false,
      //   selected: false,
      //   title: "NFT",
      // },
      // {
      //   path: "/dashboards/projects",
      //   type: "link",
      //   active: false,
      //   selected: false,
      //   title: "Projects",
      // },

      //Jobs Dashboard

      // {
      //   title: "Jobs",
      //   icon: Dashboardicon,
      //   type: "sub",
      //   active: false,
      //   children: [
      //     {
      //       title: "Admin",
      //       icon: Dashboardicon,
      //       type: "sub",
      //       active: false,
      //       children: [
      //         {
      //           path: "/dashboards/jobs/admin",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Admin Main",
      //         },
      //         {
      //           path: "/dashboards/jobs/admin/alljobs",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "All Jobs",
      //         },
      //         {
      //           path: "/dashboards/jobs/admin/blog",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Blog",
      //         },
      //         {
      //           path: "/dashboards/jobs/admin/blogs",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Blogs",
      //         },
      //         {
      //           path: "/dashboards/jobs/admin/city",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "City",
      //         },
      //         {
      //           path: "/dashboards/jobs/admin/country",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Country",
      //         },
      //         {
      //           path: "/dashboards/jobs/admin/education",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Education",
      //         },
      //         {
      //           path: "/dashboards/jobs/admin/industry",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Industry",
      //         },
      //         {
      //           path: "/dashboards/jobs/admin/jobcategories",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Job Categories",
      //         },
      //         {
      //           path: "/dashboards/jobs/admin/jobexperience",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Job Experiences",
      //         },
      //         {
      //           path: "/dashboards/jobs/admin/jobrole",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Job Role",
      //         },
      //         {
      //           path: "/dashboards/jobs/admin/jobs/create",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Job Create",
      //         },
      //         {
      //           path: "/dashboards/jobs/admin/jobtype",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Job Type",
      //         },
      //         {
      //           path: "/dashboards/jobs/admin/language",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Language",
      //         },
      //         {
      //           path: "/dashboards/jobs/admin/orders",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Orders",
      //         },
      //         {
      //           path: "/dashboards/jobs/admin/organization",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Organization",
      //         },
      //         {
      //           path: "/dashboards/jobs/admin/paymentsettings",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Payment Settings",
      //         },
      //         {
      //           path: "/dashboards/jobs/admin/pricing",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Pricing",
      //         },
      //         {
      //           path: "/dashboards/jobs/admin/profession",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Profession",
      //         },
      //         {
      //           path: "/dashboards/jobs/admin/salarytype",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Salary Type",
      //         },
      //         {
      //           path: "/dashboards/jobs/admin/sitesettings",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Site Settings",
      //         },
      //         {
      //           path: "/dashboards/jobs/admin/skill",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Skill",
      //         },
      //         {
      //           path: "/dashboards/jobs/admin/state",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "State",
      //         },
      //         {
      //           path: "/dashboards/jobs/admin/tag",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Tags",
      //         },
      //         {
      //           path: "/dashboards/jobs/admin/team",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Team",
      //         },
      //       ],
      //     },

      //     {
      //       title: "Candidate",
      //       icon: Dashboardicon,
      //       type: "sub",
      //       active: false,
      //       children: [
      //         {
      //           path: "/dashboards/jobs/candidate/my-profile",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "My Profile",
      //         },
      //         {
      //           path: "/dashboards/jobs/candidate/myjobs",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "My Jobs",
      //         },
      //       ],
      //     },

      //     {
      //       title: "Company",
      //       icon: Dashboardicon,
      //       type: "sub",
      //       active: false,
      //       children: [
      //         {
      //           path: "/dashboards/jobs/company",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Company Main",
      //         },
      //         {
      //           path: "/dashboards/jobs/company/companyjob",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Company Job",
      //         },
      //         {
      //           path: "/dashboards/jobs/company/job",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Job",
      //         },
      //         {
      //           path: "/dashboards/jobs/company/jobdetails",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Job Details",
      //         },
      //         {
      //           path: "/dashboards/jobs/company/orders",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Orders",
      //         },
      //         {
      //           path: "/dashboards/jobs/company/profile",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Profile",
      //         },
      //       ],
      //     },

      //     // {
      //     //   path: "/dashboards/sales",
      //     //   type: "link",
      //     //   active: false,
      //     //   selected: false,
      //     //   title: "Sales",
      //     // },
      //     // {
      //     //   path: "/dashboards/analytics",
      //     //   type: "link",
      //     //   active: false,
      //     //   selected: false,
      //     //   title: "Analytics",
      //     // },
      //     // {
      //     //   path: "/dashboards/ecommerce",
      //     //   type: "link",
      //     //   active: false,
      //     //   selected: false,
      //     //   title: "Ecommerce",
      //     // },
      //     // {
      //     //   path: "/dashboards/crm",
      //     //   type: "link",
      //     //   active: false,
      //     //   selected: false,
      //     //   title: "CRM",
      //     // },
      //     // {
      //     //   path: "/dashboards/crypto",
      //     //   type: "link",
      //     //   active: false,
      //     //   selected: false,
      //     //   title: "Crypto",
      //     // },
      //     // {
      //     //   path: "/dashboards/nft",
      //     //   type: "link",
      //     //   active: false,
      //     //   selected: false,
      //     //   title: "NFT",
      //     // },
      //     // {
      //     //   path: "/dashboards/projects",
      //     //   type: "link",
      //     //   active: false,
      //     //   selected: false,
      //     //   title: "Projects",
      //     // },

      //     // {
      //     //   path: "/dashboards/jobs",
      //     //   type: "link",
      //     //   active: false,
      //     //   selected: false,
      //     //   title: "Jobs",
      //     // },
      //     // {
      //     //   path: "/dashboards/hrm",
      //     //   type: "link",
      //     //   active: false,
      //     //   selected: false,
      //     //   title: "HRM",
      //     // },
      //     // {
      //     //   path: "/dashboards/courses",
      //     //   type: "link",
      //     //   active: false,
      //     //   selected: false,
      //     //   title: "Courses",
      //     // },
      //     // {
      //     //   path: "/dashboards/stocks",
      //     //   type: "link",
      //     //   active: false,
      //     //   selected: false,
      //     //   title: "Stocks",
      //     // },
      //     // {
      //     //   path: "/dashboards/medical",
      //     //   type: "link",
      //     //   active: false,
      //     //   selected: false,
      //     //   title: "Medical",
      //     // },
      //     // {
      //     //   path: "/dashboards/pos-system",
      //     //   type: "link",
      //     //   active: false,
      //     //   selected: false,
      //     //   title: "POS System",
      //     // },
      //     // {
      //     //   path: "/dashboards/podcast",
      //     //   type: "link",
      //     //   active: false,
      //     //   selected: false,
      //     //   title: "Podcast",
      //     // },
      //     // {
      //     //   path: "/dashboards/school",
      //     //   type: "link",
      //     //   active: false,
      //     //   selected: false,
      //     //   title: "School",
      //     // },
      //     // {
      //     //   path: "/dashboards/social-media",
      //     //   type: "link",
      //     //   active: false,
      //     //   selected: false,
      //     //   title: "Social Media",
      //     // },
      //   ],
      // },

      //Jobs Dashboard

      // {
      //   path: "/dashboards/jobs",
      //   type: "link",
      //   active: false,
      //   selected: false,
      //   title: "Jobs",
      // },

      // {
      //   title: "NewsPortal",
      //   icon: Dashboardicon,
      //   type: "sub",
      //   active: false,
      //   children: [
      //     {
      //       path: "/dashboards/newsportal",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "NewsPortal Main",
      //     },
      //     {
      //       path: "/dashboards/newsportal/addwriter",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Add Writer",
      //     },
      //     {
      //       path: "/dashboards/newsportal/createnews",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Create News",
      //     },
      //     {
      //       path: "/dashboards/newsportal/news",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "News",
      //     },
      //     {
      //       path: "/dashboards/newsportal/profile",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Profile",
      //     },
      //     {
      //       path: "/dashboards/newsportal/writer",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Writer",
      //     },
      //     {
      //       path: "/dashboards/newsportal/writers",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Writers",
      //     },
      //   ],
      // },

      // {
      //   path: "/dashboards/hrm",
      //   type: "link",
      //   active: false,
      //   selected: false,
      //   title: "HRM",
      // },
      // {
      //   path: "/dashboards/courses",
      //   type: "link",
      //   active: false,
      //   selected: false,
      //   title: "Courses",
      // },
      // {
      //   path: "/dashboards/stocks",
      //   type: "link",
      //   active: false,
      //   selected: false,
      //   title: "Stocks",
      // },
      // {
      //   path: "/dashboards/medical",
      //   type: "link",
      //   active: false,
      //   selected: false,
      //   title: "Medical",
      // },
      // {
      //   path: "/dashboards/pos-system",
      //   type: "link",
      //   active: false,
      //   selected: false,
      //   title: "POS System",
      // },
      // {
      //   path: "/dashboards/podcast",
      //   type: "link",
      //   active: false,
      //   selected: false,
      //   title: "Podcast",
      // },
      // {
      //   path: "/dashboards/school",
      //   type: "link",
      //   active: false,
      //   selected: false,
      //   title: "School",
      // },
      // {
      //   path: "/dashboards/social-media",
      //   type: "link",
      //   active: false,
      //   selected: false,
      //   title: "Social Media",
      // },
    ],
  },

  {
    menutitle: "Admin Panels",
  },
  {
    title: "Apps",
    icon: Appsicon,
    badgetxt: badge1,
    type: "sub",
    active: false,
    selected: false,
    children: [
      {
        title: "Jobs",
        type: "sub",
        active: false,
        children: [
          {
            title: "Admin",
            type: "sub",
            active: false,
            children: [
              {
                path: "/dashboards/jobs/admin",
                type: "link",
                active: false,
                selected: false,
                title: "Admin",
              },
              {
                path: "/dashboards/jobs/admin/alljobs",
                type: "link",
                active: false,
                selected: false,
                title: "All jobs",
              },
              {
                path: "/dashboards/jobs/admin/blog",
                type: "link",
                active: false,
                selected: false,
                title: "Add Vendor",
              },
              {
                path: "/dashboards/jobs/admin/blogs",
                type: "link",
                active: false,
                selected: false,
                title: "Blogs",
              },
              {
                path: "/dashboards/jobs/admin/city",
                type: "link",
                active: false,
                selected: false,
                title: "City",
              },
              {
                path: "/dashboards/jobs/admin/country",
                type: "link",
                active: false,
                selected: false,
                title: "Country",
              },
              {
                path: "/dashboards/jobs/admin/editblog",
                type: "link",
                active: false,
                selected: false,
                title: "Edit Blog",
              },
              {
                path: "/dashboards/jobs/admin/education",
                type: "link",
                active: false,
                selected: false,
                title: "Education",
              },
              {
                path: "/dashboards/jobs/admin/industry",
                type: "link",
                active: false,
                selected: false,
                title: "Industry",
              },
              {
                path: "/dashboards/jobs/admin/jobcategories",
                type: "link",
                active: false,
                selected: false,
                title: "Job Categories",
              },
              {
                path: "/dashboards/jobs/admin/jobexperience",
                type: "link",
                active: false,
                selected: false,
                title: "Job Experience",
              },
              {
                path: "/dashboards/jobs/admin/jobrole",
                type: "link",
                active: false,
                selected: false,
                title: "Job Role",
              },
              {
                path: "/dashboards/jobs/admin/jobs",
                type: "link",
                active: false,
                selected: false,
                title: "Jobs",
              },
              {
                path: "/dashboards/jobs/admin/jobtype",
                type: "link",
                active: false,
                selected: false,
                title: "job Type",
              },
              {
                path: "/dashboards/jobs/admin/language",
                type: "link",
                active: false,
                selected: false,
                title: "Language",
              },
              {
                path: "/dashboards/jobs/admin/orders",
                type: "link",
                active: false,
                selected: false,
                title: "Orders",
              },
              {
                path: "/dashboards/jobs/admin/organization",
                type: "link",
                active: false,
                selected: false,
                title: "Organization",
              },
              {
                path: "/dashboards/jobs/admin/paymentsettings",
                type: "link",
                active: false,
                selected: false,
                title: "Payment Settings",
              },
              {
                path: "/dashboards/jobs/admin/pricing",
                type: "link",
                active: false,
                selected: false,
                title: "Pricing",
              },
              {
                path: "/dashboards/jobs/admin/profession",
                type: "link",
                active: false,
                selected: false,
                title: "Profession",
              },
              {
                path: "/dashboards/jobs/admin/salarytype",
                type: "link",
                active: false,
                selected: false,
                title: "Salary Type",
              },
              {
                path: "/dashboards/jobs/admin/sitesettings",
                type: "link",
                active: false,
                selected: false,
                title: "Site Settings",
              },
              {
                path: "/dashboards/jobs/admin/skill",
                type: "link",
                active: false,
                selected: false,
                title: "Skill",
              },
              {
                path: "/dashboards/jobs/admin/state",
                type: "link",
                active: false,
                selected: false,
                title: "State",
              },
              {
                path: "/dashboards/jobs/admin/tag",
                type: "link",
                active: false,
                selected: false,
                title: "Tags",
              },
              {
                path: "/dashboards/jobs/admin/team",
                type: "link",
                active: false,
                selected: false,
                title: "Team",
              },
            ],
          },
          {
            title: "Candidate",
            type: "sub",
            active: false,
            children: [
              {
                path: "/dashboards/jobs/candidate/my-profile",
                type: "link",
                active: false,
                selected: false,
                title: "My Profile",
              },
              {
                path: "/dashboards/jobs/candidate/myjobs",
                type: "link",
                active: false,
                selected: false,
                title: "My Jobs",
              },
            ],
          },
          {
            title: "Company",
            type: "sub",
            active: false,
            children: [
              {
                path: "/dashboards/jobs/company",
                type: "link",
                active: false,
                selected: false,
                title: "Company Main",
              },
              {
                path: "/dashboards/jobs/company/companyjob",
                type: "link",
                active: false,
                selected: false,
                title: "Company Job",
              },
              {
                path: "/dashboards/jobs/company/job",
                type: "link",
                active: false,
                selected: false,
                title: "Job",
              },
              {
                path: "/dashboards/jobs/company/jobdetails",
                type: "link",
                active: false,
                selected: false,
                title: "Job Details",
              },
              {
                path: "/dashboards/jobs/company/orders",
                type: "link",
                active: false,
                selected: false,
                title: "Orders",
              },
              {
                path: "/dashboards/jobs/company/profile",
                type: "link",
                active: false,
                selected: false,
                title: "Profile",
              },
            ],
          },
        ],
      },

      {
        title: "Shop",
        type: "sub",
        active: false,
        children: [
          {
            title: "Admin",
            type: "sub",
            active: false,
            children: [
              {
                path: "/dashboards/shop/admin/categories",
                type: "link",
                active: false,
                selected: false,
                title: "Categories",
              },
              {
                path: "/dashboards/shop/admin/categories/new",
                type: "link",
                active: false,
                selected: false,
                title: "Categories New",
              },

              {
                path: "/dashboards/shop/admin/offer-tags",
                type: "link",
                active: false,
                selected: false,
                title: "Offer Tags",
              },

              {
                path: "/dashboards/shop/admin/offer-tags/new",
                type: "link",
                active: false,
                selected: false,
                title: "Offer Tags New",
              },

              {
                path: "/dashboards/shop/admin/stores",
                type: "link",
                active: false,
                selected: false,
                title: "Stores",
              },

              {
                path: "/dashboards/shop/admin/subCategories",
                type: "link",
                active: false,
                selected: false,
                title: "SubCategories",
              },

              {
                path: "/dashboards/shop/admin/subCategories/new",
                type: "link",
                active: false,
                selected: false,
                title: "SubCategories New",
              },
            ],
          },
        ],
      },

      {
        title: "News",
        type: "sub",
        active: false,
        children: [
          {
            title: "Admin",
            type: "sub",
            active: false,
            children: [
              {
                path: "/dashboards/newsportal",
                type: "link",
                active: false,
                selected: false,
                title: "NewsPortal Main",
              },
              {
                path: "/dashboards/newsportal/addwriter",
                type: "link",
                active: false,
                selected: false,
                title: "Add Writer",
              },
              {
                path: "/dashboards/newsportal/createnews",
                type: "link",
                active: false,
                selected: false,
                title: "Create News",
              },

              {
                path: "/dashboards/newsportal/news",
                type: "link",
                active: false,
                selected: false,
                title: "News",
              },

              {
                path: "/dashboards/newsportal/profile",
                type: "link",
                active: false,
                selected: false,
                title: "Profiles",
              },

              {
                path: "/dashboards/newsportal/writer",
                type: "link",
                active: false,
                selected: false,
                title: "Writer",
              },

              {
                path: "/dashboards/newsportal/writers",
                type: "link",
                active: false,
                selected: false,
                title: "Writers",
              },
            ],
          },
        ],
      },

      //  {
      //    title: "Jobs",
      //    type: "sub",
      //    active: false,
      //    children: [
      //      {
      //        title: "Admin",
      //        type: "sub",
      //        active: false,
      //        children: [
      //          {
      //            path: "/apps/ecommerce/admin/add-customer",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Add Customer",
      //          },
      //          {
      //            path: "/apps/ecommerce/admin/add-product",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Add Product",
      //          },
      //          {
      //            path: "/apps/ecommerce/admin/add-vendor",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Add Vendor",
      //          },
      //          {
      //            path: "/apps/ecommerce/admin/blog",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Blog",
      //          },
      //          {
      //            path: "/apps/ecommerce/admin/customer-details",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Customer Details",
      //          },
      //          {
      //            path: "/apps/ecommerce/admin/customers-list",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Customers List",
      //          },
      //          {
      //            path: "/apps/ecommerce/admin/faqs",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Faq's",
      //          },
      //          {
      //            path: "/apps/ecommerce/admin/news-letter",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "News Letter",
      //          },
      //          {
      //            path: "/apps/ecommerce/admin/orders",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Orders",
      //          },
      //          {
      //            path: "/apps/ecommerce/admin/order-details",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Order Details",
      //          },
      //          {
      //            path: "/apps/ecommerce/admin/payment-gateways",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Payment Gateways",
      //          },
      //          {
      //            path: "/apps/ecommerce/admin/products",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Products",
      //          },
      //          {
      //            path: "/apps/ecommerce/admin/refund-requests",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Refund Requests",
      //          },
      //          {
      //            path: "/apps/ecommerce/admin/reports",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Reports",
      //          },
      //          {
      //            path: "/apps/ecommerce/admin/testimonials",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Testimonials",
      //          },
      //          {
      //            path: "/apps/ecommerce/admin/vendor-details",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Vendor Details",
      //          },
      //          {
      //            path: "/apps/ecommerce/admin/vendors-list",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Vendors List",
      //          },
      //          {
      //            path: "/apps/ecommerce/admin/app-settings",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "App Settings",
      //          },
      //        ],
      //      },
      //      {
      //        title: "Customer",
      //        type: "sub",
      //        active: false,
      //        children: [
      //          {
      //            path: "/ecommerce/customer/customer",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Customer",
      //          },
      //          {
      //            path: "/ecommerce/customer/browse",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Browse",
      //          },
      //          {
      //            path: "/ecommerce/customer/address",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Address",
      //          },
      //          {
      //            path: "/ecommerce/customer/landing-page",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "landing Page",
      //          },
      //          {
      //            path: "/ecommerce/customer/shop",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Shop",
      //          },
      //          {
      //            path: "/ecommerce/customer/product-details",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Product Details",
      //          },
      //          {
      //            path: "/ecommerce/customer/cart",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Cart",
      //          },
      //          {
      //            path: "/ecommerce/customer/checkout",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Checkout",
      //          },
      //          {
      //            path: "/ecommerce/customer/compare-products",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Compare Products",
      //          },
      //          {
      //            path: "/ecommerce/customer/coupons",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Coupons",
      //          },
      //          {
      //            path: "/ecommerce/customer/order-tracking",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Order Tracking",
      //          },
      //          {
      //            path: "/ecommerce/customer/refunds",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Refunds",
      //          },
      //          {
      //            path: "/ecommerce/customer/settings",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Settings",
      //          },
      //          {
      //            path: "/ecommerce/customer/wishlist",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Wishlist",
      //          },
      //        ],
      //      },
      //      {
      //        title: "Vendor",
      //        type: "sub",
      //        active: false,
      //        children: [
      //          {
      //            path: "/ecommerce/vendor/vendor",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Vendor",
      //          },
      //          {
      //            path: "/ecommerce/vendor/add-product",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Add Product",
      //          },
      //          {
      //            path: "/ecommerce/vendor/invoice-details",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Invoice Details",
      //          },
      //          {
      //            path: "/ecommerce/vendor/invoices",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Invoices",
      //          },
      //          {
      //            path: "/ecommerce/vendor/orders",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Orders",
      //          },
      //          {
      //            path: "/ecommerce/vendor/packages",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Packages",
      //          },
      //          {
      //            path: "/ecommerce/vendor/profile",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Profile",
      //          },
      //          {
      //            path: "/ecommerce/vendor/refund-requests",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Refund Requests",
      //          },
      //          {
      //            path: "/ecommerce/vendor/settings",
      //            type: "link",
      //            active: false,
      //            selected: false,
      //            title: "Settings",
      //          },
      //        ],
      //      },
      //    ],
      //  },

      // {
      //   title: "Jobs",
      //   type: "sub",
      //   active: false,
      //   children: [
      //     {
      //       title: "Admin",
      //       type: "sub",
      //       active: false,
      //       children: [
      //         {
      //           path: "/apps/ecommerce/admin/add-customer",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Add Customer",
      //         },
      //         {
      //           path: "/apps/ecommerce/admin/add-product",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Add Product",
      //         },
      //         {
      //           path: "/apps/ecommerce/admin/add-vendor",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Add Vendor",
      //         },
      //         {
      //           path: "/apps/ecommerce/admin/blog",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Blog",
      //         },
      //         {
      //           path: "/apps/ecommerce/admin/customer-details",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Customer Details",
      //         },
      //         {
      //           path: "/apps/ecommerce/admin/customers-list",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Customers List",
      //         },
      //         {
      //           path: "/apps/ecommerce/admin/faqs",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Faq's",
      //         },
      //         {
      //           path: "/apps/ecommerce/admin/news-letter",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "News Letter",
      //         },
      //         {
      //           path: "/apps/ecommerce/admin/orders",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Orders",
      //         },
      //         {
      //           path: "/apps/ecommerce/admin/order-details",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Order Details",
      //         },
      //         {
      //           path: "/apps/ecommerce/admin/payment-gateways",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Payment Gateways",
      //         },
      //         {
      //           path: "/apps/ecommerce/admin/products",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Products",
      //         },
      //         {
      //           path: "/apps/ecommerce/admin/refund-requests",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Refund Requests",
      //         },
      //         {
      //           path: "/apps/ecommerce/admin/reports",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Reports",
      //         },
      //         {
      //           path: "/apps/ecommerce/admin/testimonials",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Testimonials",
      //         },
      //         {
      //           path: "/apps/ecommerce/admin/vendor-details",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Vendor Details",
      //         },
      //         {
      //           path: "/apps/ecommerce/admin/vendors-list",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Vendors List",
      //         },
      //         {
      //           path: "/apps/ecommerce/admin/app-settings",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "App Settings",
      //         },
      //       ],
      //     },
      //     {
      //       title: "Customer",
      //       type: "sub",
      //       active: false,
      //       children: [
      //         {
      //           path: "/ecommerce/customer/customer",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Customer",
      //         },
      //         {
      //           path: "/ecommerce/customer/browse",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Browse",
      //         },
      //         {
      //           path: "/ecommerce/customer/address",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Address",
      //         },
      //         {
      //           path: "/ecommerce/customer/landing-page",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "landing Page",
      //         },
      //         {
      //           path: "/ecommerce/customer/shop",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Shop",
      //         },
      //         {
      //           path: "/ecommerce/customer/product-details",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Product Details",
      //         },
      //         {
      //           path: "/ecommerce/customer/cart",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Cart",
      //         },
      //         {
      //           path: "/ecommerce/customer/checkout",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Checkout",
      //         },
      //         {
      //           path: "/ecommerce/customer/compare-products",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Compare Products",
      //         },
      //         {
      //           path: "/ecommerce/customer/coupons",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Coupons",
      //         },
      //         {
      //           path: "/ecommerce/customer/order-tracking",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Order Tracking",
      //         },
      //         {
      //           path: "/ecommerce/customer/refunds",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Refunds",
      //         },
      //         {
      //           path: "/ecommerce/customer/settings",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Settings",
      //         },
      //         {
      //           path: "/ecommerce/customer/wishlist",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Wishlist",
      //         },
      //       ],
      //     },
      //     {
      //       title: "Vendor",
      //       type: "sub",
      //       active: false,
      //       children: [
      //         {
      //           path: "/ecommerce/vendor/vendor",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Vendor",
      //         },
      //         {
      //           path: "/ecommerce/vendor/add-product",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Add Product",
      //         },
      //         {
      //           path: "/ecommerce/vendor/invoice-details",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Invoice Details",
      //         },
      //         {
      //           path: "/ecommerce/vendor/invoices",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Invoices",
      //         },
      //         {
      //           path: "/ecommerce/vendor/orders",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Orders",
      //         },
      //         {
      //           path: "/ecommerce/vendor/packages",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Packages",
      //         },
      //         {
      //           path: "/ecommerce/vendor/profile",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Profile",
      //         },
      //         {
      //           path: "/ecommerce/vendor/refund-requests",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Refund Requests",
      //         },
      //         {
      //           path: "/ecommerce/vendor/settings",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Settings",
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   title: "Classifieds",
      //   type: "sub",
      //   active: false,
      //   children: [
      //     {
      //       path: "/apps/classifieds/admin",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Admin",
      //     },
      //     {
      //       path: "/classifieds/classified-details",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Classified Details",
      //     },
      //     {
      //       path: "/classifieds/landing",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Landing",
      //     },
      //     {
      //       path: "/classifieds/search",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Search",
      //     },
      //     {
      //       path: "/apps/classifieds/user-profile",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "User Profile",
      //     },
      //   ],
      // },
      // {
      //   title: "Domain",
      //   type: "sub",
      //   active: false,
      //   children: [
      //     {
      //       path: "/apps/domain/admin",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Admin",
      //     },
      //     {
      //       path: "/domain/single-landing",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Single Landing",
      //     },
      //     {
      //       path: "/domain/domain-details",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Domain Details",
      //     },
      //     {
      //       path: "/domain/landing",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Landing",
      //     },
      //   ],
      // },
      // {
      //   title: "Market Place",
      //   type: "sub",
      //   active: false,
      //   children: [
      //     {
      //       path: "/apps/market-place/admin",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Admin",
      //     },
      //     {
      //       path: "/market-place/details",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Details",
      //     },
      //     {
      //       path: "/market-place/landing",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Landing",
      //     },
      //     {
      //       path: "/market-place/search",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Search",
      //     },
      //     {
      //       path: "/market-place/user",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "User",
      //     },
      //     {
      //       path: "/market-place/user-profile",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "User Profile",
      //     },
      //     {
      //       path: "/market-place/vendor",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Vendor",
      //     },
      //   ],
      // },
      // {
      //   title: "Real Estate",
      //   type: "sub",
      //   active: false,
      //   children: [
      //     {
      //       path: "/apps/real-estate/admin",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Admin",
      //     },
      //     {
      //       path: "/real-estate/details",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Details",
      //     },
      //     {
      //       path: "/real-estate/landing",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Landing",
      //     },
      //     {
      //       path: "/real-estate/search",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Search",
      //     },
      //     {
      //       path: "/real-estate/user",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "User",
      //     },
      //     {
      //       path: "/real-estate/user-profile",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "User Profile",
      //     },
      //     {
      //       path: "/real-estate/vendor",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Vendor",
      //     },
      //   ],
      // },

      // //

      // {
      //   title: "Shop",
      //   type: "sub",
      //   active: false,
      //   children: [
      //     {
      //       path: "/apps/shop",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Shop Main",
      //     },
      //     {
      //       path: "/apps/shop/browse",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Browse",
      //     },
      //     {
      //       path: "/apps/shop/cart",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Cart",
      //     },
      //     {
      //       path: "/apps/shop/checkout",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Checkout",
      //     },

      //     {
      //       title: "Profile",
      //       type: "sub",
      //       active: false,
      //       children: [
      //         {
      //           path: "/apps/shop/profile/overview",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Overview",
      //         },
      //         {
      //           path: "/apps/shop/profile/orders",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Orders",
      //         },
      //         {
      //           path: "/apps/shop/profile/payment",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Payment",
      //         },
      //         {
      //           path: "/apps/shop/profile/addresses",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Addresses",
      //         },
      //         {
      //           path: "/apps/shop/profile/reviews",
      //           type: "link",
      //           active: false,
      //           selected: false,
      //           title: "Reviews",
      //         },
      //       ],
      //     },

      //     {
      //       path: "/apps/shop/seller/apply",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Seller Apply",
      //     },
      //   ],
      // },
      // //

      // {
      //   title: "Forum",
      //   type: "sub",
      //   active: false,
      //   children: [
      //     {
      //       path: "/apps/forum",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Forum Main",
      //     },
      //     {
      //       path: "/apps/forum/ask-question",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Ask Question",
      //     },
      //     {
      //       path: "/apps/forum/collection",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Collection",
      //     },
      //     {
      //       path: "/apps/forum/community",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Community",
      //     },
      //     // {
      //     //   path: "/apps/jobs",
      //     //   type: "link",
      //     //   active: false,
      //     //   selected: false,
      //     //   title: "Jobs",
      //     // },
      //   ],
      // },

      // {
      //   path: "/apps/news",
      //   type: "link",
      //   active: false,
      //   selected: false,
      //   title: "News",
      // },

      // {
      //   path: "/apps/facebook/pages/home",
      //   type: "link",
      //   active: false,
      //   selected: false,
      //   title: "Social2",
      // },

      // {
      //   path: "/apps/full-calendar",
      //   type: "link",
      //   active: false,
      //   selected: false,
      //   title: "Full Calendar",
      // },
      // {
      //   path: "/apps/gallery",
      //   type: "link",
      //   active: false,
      //   selected: false,
      //   title: "Gallery",
      // },
      // {
      //   path: "/apps/sweet-alerts",
      //   type: "link",
      //   active: false,
      //   selected: false,
      //   title: "Sweet Alerts",
      // },
      // {
      //   title: "Projects",
      //   type: "sub",
      //   active: false,
      //   children: [
      //     {
      //       path: "/home/projects/projects-list",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Projects List",
      //     },
      //     {
      //       path: "/home/projects/project-overview",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Project Overview",
      //     },
      //     {
      //       path: "/home/projects/create-project",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Create Project",
      //     },
      //   ],
      // },

      // {
      //   title: "Task",
      //   type: "sub",
      //   active: false,
      //   children: [
      //     {
      //       path: "/apps/task/kanban-board",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Kanban Board",
      //     },
      //     {
      //       path: "/apps/task/list-view",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "List View",
      //     },
      //     {
      //       path: "/apps/task/task-details",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Task Details",
      //     },
      //   ],
      // },
      // // {
      // //   title: "Jobs",
      // //   type: "sub",
      // //   active: false,
      // //   children: [
      // //     {
      // //       path: "/apps/jobs/main",
      // //       type: "link",
      // //       active: false,
      // //       selected: false,
      // //       title: "Jobs Main",
      // //     },
      // //     {
      // //       path: "/apps/jobs/blog",
      // //       type: "link",
      // //       active: false,
      // //       selected: false,
      // //       title: "Blog",
      // //     },
      // //     {
      // //       path: "/apps/jobs/candidates",
      // //       type: "link",
      // //       active: false,
      // //       selected: false,
      // //       title: "Candidates",
      // //     },
      // //     {
      // //       path: "/apps/jobs/checkout",
      // //       type: "link",
      // //       active: false,
      // //       selected: false,
      // //       title: "Checkout",
      // //     },
      // //     {
      // //       path: "/apps/jobs/search-company",
      // //       type: "link",
      // //       active: false,
      // //       selected: false,
      // //       title: "Search Company",
      // //     },
      // //     {
      // //       path: "/apps/jobs/company",
      // //       type: "link",
      // //       active: false,
      // //       selected: false,
      // //       title: "Companies",
      // //     },
      // //     {
      // //       path: "/apps/jobs/job-details",
      // //       type: "link",
      // //       active: false,
      // //       selected: false,
      // //       title: "Job Details",
      // //     },
      // //     {
      // //       path: "/apps/jobs/search-jobs",
      // //       type: "link",
      // //       active: false,
      // //       selected: false,
      // //       title: "Search Jobs",
      // //     },
      // //     {
      // //       path: "/apps/jobs/job-post",
      // //       type: "link",
      // //       active: false,
      // //       selected: false,
      // //       title: "Job Post",
      // //     },
      // //     {
      // //       path: "/apps/jobs/jobs-list",
      // //       type: "link",
      // //       active: false,
      // //       selected: false,
      // //       title: "Jobs List",
      // //     },
      // //     {
      // //       path: "/apps/jobs/search-candidate",
      // //       type: "link",
      // //       active: false,
      // //       selected: false,
      // //       title: "Search Candidate",
      // //     },
      // //     {
      // //       path: "/apps/jobs/candidate-details",
      // //       type: "link",
      // //       active: false,
      // //       selected: false,
      // //       title: "Candidate Details",
      // //     },
      // //   ],
      // // },

      // {
      //   title: "NFT",
      //   type: "sub",
      //   active: false,
      //   children: [
      //     {
      //       path: "/apps/nft/market-place",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Market Place",
      //     },
      //     {
      //       path: "/apps/nft/nft-details",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "NFT Details",
      //     },
      //     {
      //       path: "/apps/nft/create-nft",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Create NFT",
      //     },
      //     {
      //       path: "/apps/nft/wallet-integration",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Wallet Integration",
      //     },
      //     {
      //       path: "/apps/nft/live-auction",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Live Auction",
      //     },
      //   ],
      // },
      // {
      //   title: "CRM",
      //   type: "sub",
      //   active: false,
      //   children: [
      //     {
      //       path: "/home/crm/contacts",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Contacts",
      //     },
      //     {
      //       path: "/home/crm/companies",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Companies",
      //     },
      //     {
      //       path: "/home/crm/deals",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Deals",
      //     },
      //     {
      //       path: "/home/crm/leads",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Leads",
      //     },
      //   ],
      // },
      // {
      //   title: "Crypto",
      //   type: "sub",
      //   active: false,
      //   children: [
      //     {
      //       path: "/apps/crypto/transactions",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Transactions",
      //     },
      //     {
      //       path: "/apps/crypto/currency-exchange",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Currency Exchange",
      //     },
      //     {
      //       path: "/apps/crypto/buy-sell",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Buy & Sell",
      //     },
      //     {
      //       path: "/apps/crypto/marketcap",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Marketcap",
      //     },
      //     {
      //       path: "/apps/crypto/wallet",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //       title: "Wallet",
      //     },
      //   ],
      // },
    ],
  },
  // {
  //   icon: NestedmenuIcon, title: "Nested Menu", selected: false, active: false, type: "sub", children: [
  //     { path: "", title: "Nested-1", type: "empty", active: false, selected: false, dirchange: false, },
  //     { title: "Nested-2", type: "sub", active: false, selected: false, dirchange: false, children: [
  //         { path: "", type: "empty", active: false, selected: false, dirchange: false, title: "Nested-2-1", },
  //         { title: "Nested-2-2", type: "sub", active: false, selected: false, dirchange: false, children: [
  //             { path: "", type: "empty", ctive: false, selected: false, dirchange: false, title: "Nested-2-2-1", },
  //             { path: "", type: "empty", active: false, selected: false, dirchange: false, title: "Nested-2-2-2", },
  //           ]
  //         }
  //       ],
  //     },
  //   ],
  // },
  {
    menutitle: "Professional Pano",
  },
  // {
  //   icon: Authenticationicon, title: " Authentication",badgetxt: badge2, type: "sub", active: false, selected: false, children: [
  //     { path: "/authentication/coming-soon", type: "link", active: false, selected: false, title: "Coming Soon" },
  //     {
  //       title: "Create Password", type: "sub", active: false, selected: false, children: [
  //         { path: "/authentication/create-password/basic", type: "link", active: false, selected: false, title: "Basic" },
  //         { path: "/authentication/create-password/cover", type: "link", active: false, selected: false, title: "Cover" },
  //       ],
  //     },
  //     {
  //       title: "Lock Screen", type: "sub", active: false, selected: false, children: [
  //         { path: "/authentication/lock-screen/basic", type: "link", active: false, selected: false, title: "Basic" },
  //         { path: "/authentication/lock-screen/cover", type: "link", active: false, selected: false, title: "Cover" },
  //       ],
  //     },
  //     {
  //       title: "Reset Password", type: "sub", active: false, selected: false, children: [
  //         { path: "/authentication/reset-password/basic", type: "link", active: false, selected: false, title: "Basic" },
  //         { path: "/authentication/reset-password/cover", type: "link", active: false, selected: false, title: "Cover" },
  //       ],
  //     },
  //     {
  //       title: "Sign Up", type: "sub", active: false, selected: false, children: [
  //         { path: "/authentication/sign-up/basic", type: "link", active: false, selected: false, title: "Basic" },
  //         { path: "/authentication/sign-up/cover", type: "link", active: false, selected: false, title: "Cover" },
  //       ],
  //     },
  //     {
  //       title: "Sign In", type: "sub", active: false, selected: false, children: [
  //         { path: "/authentication/sign-in/basic", type: "link", active: false, selected: false, title: "Basic" },
  //         { path: "/authentication/sign-in/cover", type: "link", active: false, selected: false, title: "Cover" },
  //       ],
  //     },
  //     {
  //       title: "Two Step Verification", type: "sub", active: false, selected: false, children: [
  //         { path: "/authentication/two-step-verification/basic", type: "link", active: false, selected: false, title: "Basic" },
  //         { path: "/authentication/two-step-verification/cover", type: "link", active: false, selected: false, title: "Cover" },
  //       ],
  //     },
  //     { path: "/authentication/under-maintainance", type: "link", active: false, selected: false, title: "Under Maintainance" },
  //   ]
  // },
  // {
  //   icon: Erroricon, title: "Error",badgetxt: badge3, type: "sub", active: false, selected: false, children: [

  //     { path: "/authentication/error/error-401", type: "link", active: false, selected: false, title: "401-Error" },
  //     { path: "/authentication/error/error-404", type: "link", active: false, selected: false, title: "404-Error" },
  //     { path: "/authentication/error/error-500", type: "link", active: false, selected: false, title: "500-Error" },
  //   ]
  // },
  {
    icon: Pagesicon,
    title: "Pages",
    type: "sub",
    active: false,
    children: [
      {
        title: "Blog",
        type: "sub",
        active: false,
        children: [
          {
            path: "/pages/blog/blog",
            type: "link",
            active: false,
            selected: false,
            title: "Blog",
          },
          {
            path: "/pages/blog/blog-details",
            type: "link",
            active: false,
            selected: false,
            title: "Blog Details",
          },
          {
            path: "/pages/blog/create-blog",
            type: "link",
            active: false,
            selected: false,
            title: "Create Blog",
          },
        ],
      },
      {
        path: "/social",
        type: "link",
        active: false,
        selected: false,
        title: "Social",
      },
      {
        path: "/chat",
        type: "link",
        active: false,
        selected: false,
        title: "Chat",
      },
      {
        title: "Email",
        type: "sub",
        active: false,
        children: [
          {
            path: "/pages/email/mail-app",
            type: "link",
            active: false,
            selected: false,
            title: "Mail App",
          },
          {
            path: "/pages/email/mail-settings",
            type: "link",
            active: false,
            selected: false,
            title: "Mail Settings",
          },
        ],
      },
      {
        path: "/pages/empty",
        type: "link",
        active: false,
        selected: false,
        title: "Empty",
      },
      {
        path: "/pages/faqs",
        type: "link",
        active: false,
        selected: false,
        title: "FAQ's",
      },
      {
        path: "/pages/file-manager",
        type: "link",
        active: false,
        selected: false,
        title: "File Manager",
      },
      {
        title: "Invoice",
        type: "sub",
        menusub: true,
        active: false,
        selected: false,
        children: [
          {
            path: "/pages/invoice/create-invoice",
            type: "link",
            active: false,
            selected: false,
            title: "Create Invoice",
          },
          {
            path: "/pages/invoice/invoice-details",
            type: "link",
            active: false,
            selected: false,
            title: "Invoice Details",
          },
          {
            path: "/pages/invoice/invoice-list",
            type: "link",
            active: false,
            selected: false,
            title: "Invoice List",
          },
        ],
      },
      {
        path: "/pages/pricing",
        type: "link",
        active: false,
        selected: false,
        title: "Pricing",
      },
      {
        path: "/pages/profile",
        type: "link",
        active: false,
        selected: false,
        title: "Profile",
      },
      {
        path: "/pages/profile-setting",
        type: "link",
        active: false,
        selected: false,
        title: "Profile Settings",
      },
      {
        path: "/pages/reviews",
        type: "link",
        active: false,
        selected: false,
        title: "Reviews",
      },
      {
        path: "/pages/search",
        type: "link",
        active: false,
        selected: false,
        title: "Search",
      },
      {
        path: "/pages/team",
        type: "link",
        active: false,
        selected: false,
        title: "Team",
      },
      {
        path: "/pages/terms-conditions",
        type: "link",
        active: false,
        selected: false,
        title: "Terms & Conditions",
      },
      {
        path: "/pages/timeline",
        type: "link",
        active: false,
        selected: false,
        title: "Timeline",
      },
      {
        path: "/pages/todolist",
        type: "link",
        active: false,
        selected: false,
        title: "To Do List",
      },
    ],
  },
  // {
  //   menutitle: "GENERAL"
  // },
  // {
  //   title: "Forms", icon: Formsicon, type: "sub", active: false, selected: false, children: [

  //     { path: "/forms/form-advanced", type: "link", active: false, selected: false, title: "Form Advanced" },

  //     {
  //       title: "Form Elements", type: "sub", menusub: true, active: false, selected: false, children: [
  //         { path: "/forms/form-elements/inputs", type: "link", active: false, selected: false, title: "Inputs" },
  //         { path: "/forms/form-elements/checks-radios", type: "link", active: false, selected: false, title: "Checks & Radios " },
  //         { path: "/forms/form-elements/formswitch", type: "link", active: false, selected: false, title: "Form switch " },
  //         { path: "/forms/form-elements/input-group", type: "link", active: false, selected: false, title: "Input Group" },
  //         { path: "/forms/form-elements/form-select", type: "link", active: false, selected: false, title: "Form Select" },
  //         { path: "/forms/form-elements/range-slider", type: "link", active: false, selected: false, title: "Range Slider" },
  //         { path: "/forms/form-elements/input-masks", type: "link", active: false, selected: false, title: "Input Masks" },
  //         { path: "/forms/form-elements/file-uploads", type: "link", active: false, selected: false, title: "File Uploads" },
  //         { path: "/forms/form-elements/date-time-picker", type: "link", active: false, selected: false, title: "Date,Time Picker" },
  //         { path: "/forms/form-elements/color-picker", type: "link", active: false, selected: false, title: "Color Pickers" },
  //         { path: "/forms/form-elements/form-wizard", type: "link", active: false, selected: false, title: "Form Wizard" },
  //         { path: "/forms/form-elements/advancedselect", type: "link", active: false, selected: false, title: "Advanced Select" },
  //         { path: "/forms/form-elements/input-number", type: "link", active: false, selected: false, title: "Input Number" },
  //         { path: "/forms/form-elements/passwords", type: "link", active: false, selected: false, title: "Passwords" },
  //         { path: "/forms/form-elements/counters-markup", type: "link", active: false, selected: false, title: "Counters & Markup" },

  //       ],
  //     },
  //     { path: "/forms/form-layouts", type: "link", active: false, selected: false, title: "Form Layouts" },
  //     { path: "/forms/sun-editor", type: "link", active: false, selected: false, title: "Sun Editor" },
  //     { path: "/forms/validation", type: "link", active: false, selected: false, title: "Validation" },
  //     { path: "/forms/select2", type: "link", active: false, selected: false, title: "Select2" },
  //   ],
  // },
  // {
  //   title: "Ui Elements", icon: Elementsicon, type: "sub", active: false, selected: false, children: [
  //     { path: "/ui-elements/alerts", type: "link", active: false, selected: false, title: "Alerts" },
  //     { path: "/ui-elements/badge", type: "link", active: false, selected: false, title: "Badge" },
  //     { path: "/ui-elements/breadcrumb", type: "link", active: false, selected: false, title: "Breadcrumb" },
  //     { path: "/ui-elements/buttons", type: "link", active: false, selected: false, title: "Buttons" },
  //     { path: "/ui-elements/button-group", type: "link", active: false, selected: false, title: "Button Group" },
  //     { path: "/ui-elements/blockquotes", type: "link", active: false, selected: false, title: "Blockquotes" },
  //     { path: "/ui-elements/cards", type: "link", active: false, selected: false, title: "Cards" },
  //     { path: "/ui-elements/dropdowns", type: "link", active: false, selected: false, title: "Dropdowns" },
  //     { path: "/ui-elements/images-figures", type: "link", active: false, selected: false, title: "Images & Figures" },
  //     { path: "/ui-elements/list-group", type: "link", active: false, selected: false, title: "List Group" },
  //     { path: "/ui-elements/navs-tabs", type: "link", active: false, selected: false, title: "Navs & Tabs" },
  //     { path: "/ui-elements/object-fit", type: "link", active: false, selected: false, title: "Object Fit" },
  //     { path: "/ui-elements/pagination", type: "link", active: false, selected: false, title: "Pagination" },
  //     { path: "/ui-elements/popovers", type: "link", active: false, selected: false, title: "Popovers" },
  //     { path: "/ui-elements/progress", type: "link", active: false, selected: false, title: "Progress" },
  //     { path: "/ui-elements/indicators", type: "link", active: false, selected: false, title: "Indicators" },
  //     { path: "/ui-elements/spinners", type: "link", active: false, selected: false, title: "Spinners" },
  //     { path: "/ui-elements/toasts", type: "link", active: false, selected: false, title: "Toasts" },
  //     { path: "/ui-elements/tooltips", type: "link", active: false, selected: false, title: "Tooltips" },
  //     { path: "/ui-elements/typography", type: "link", active: false, selected: false, title: "Typography" },
  //   ],
  // },
  // {
  //   title: "Advanced Ui", icon: Advanceuiicon, type: "sub", active: false, selected: false, children: [
  //     { path: "/advanced-ui/accordions-collapse", type: "link", active: false, selected: false, title: "Accordions & collapse" },
  //     { path: "/advanced-ui/customscrollbar", type: "link", active: false, selected: false, title: "Custom scrollbar" },
  //     { path: "/advanced-ui/draggable-cards", type: "link", active: false, selected: false, title: "Draggable Cards" },
  //     { path: "/advanced-ui/media-player", type: "link", active: false, selected: false, title: "Media Player" },
  //     { path: "/advanced-ui/modals-closes", type: "link", active: false, selected: false, title: "Modals & Closes" },
  //     { path: "/advanced-ui/navbar", type: "link", active: false, selected: false, title: "Navbar" },
  //     { path: "/advanced-ui/offcanvas", type: "link", active: false, selected: false, title: "Offcanvas" },
  //     { path: "/advanced-ui/skeleton", type: "link", active: false, selected: false, title: "Skeleton" },
  //     { path: "/advanced-ui/ratings", type: "link", active: false, selected: false, title: "Ratings" },
  //     { path: "/advanced-ui/ribbons", type: "link", active: false, selected: false, title: "Ribbons" },
  //     { path: "/advanced-ui/sortable-js", type: "link", active: false, selected: false, title: "Sortable Js" },
  //     { path: "/advanced-ui/swiper-js", type: "link", active: false, selected: false, title: "Swiper JS" },
  //     { path: "/advanced-ui/tour", type: "link", active: false, selected: false, title: "Tour" },
  //   ],
  // },
  // {
  //   title: "Utilities", icon: Utilitiesicon, type: "sub", active: false, selected: false, children: [
  //     { path: "/utilities/avatars", type: "link", active: false, selected: false, title: "Avatars" },
  //     { path: "/utilities/borders", type: "link", active: false, selected: false, title: "Borders" },
  //     { path: "/utilities/colors", type: "link", active: false, selected: false, title: "Colors" },
  //     { path: "/utilities/columns", type: "link", active: false, selected: false, title: "Columns" },
  //     { path: "/utilities/grid", type: "link", active: false, selected: false, title: "Grid" },
  //     { path: "/utilities/flex", type: "link", active: false, selected: false, title: "Flex" },

  //   ],
  // },
  // { path: "/widgets", title: "widgets", icon: Widgetsicon, type: "link", active: false, selected: false },
  // {
  //   menutitle: "MAPS & ICONS"
  // },
  // {
  //   title: "Maps", icon: Mapsicon, type: "sub", background: "hor-rightangle", active: false, selected: false, children: [
  //     { path: "/maps/pigeon-maps", type: "link", active: false, selected: false, title: "Pigeon Maps" },
  //     { path: "/maps/leaflet-maps", type: "link", active: false, selected: false, title: "Leaflet Maps" },

  //   ],
  // },
  // { path: "/icons", icon: Icons, type: "link", active: false, selected: false, title: "Icons" },
  // {
  //   menutitle: "TABLES & CHARTS"
  // },
  // {
  //   title: "Charts", icon: Chartsicon, type: "sub", children: [
  //     {
  //       title: "Apex Charts", type: "sub", menusub: true, active: false, selected: false, children: [

  //         { path: "/charts/apex-charts/line-chart", type: "link", active: false, selected: false, title: "Line Charts" },
  //         { path: "/charts/apex-charts/area-chart", type: "link", active: false, selected: false, title: "Area Charts " },
  //         { path: "/charts/apex-charts/column-chart", type: "link", active: false, selected: false, title: "Column Charts" },
  //         { path: "/charts/apex-charts/bar-chart", type: "link", active: false, selected: false, title: "Bar Charts" },
  //         { path: "/charts/apex-charts/mixed-chart", type: "link", active: false, selected: false, title: "Mixed Charts" },
  //         { path: "/charts/apex-charts/range-area-chart", type: "link", active: false, selected: false, title: "Range Area Charts" },
  //         { path: "/charts/apex-charts/timeline-chart", type: "link", active: false, selected: false, title: "Timeline Charts" },
  //         { path: "/charts/apex-charts/funnel-chart", type: "link", active: false, selected: false, title: "Funnel Charts" },
  //         { path: "/charts/apex-charts/candlestick-chart", type: "link", active: false, selected: false, title: "CandleStick Charts" },
  //         { path: "/charts/apex-charts/boxplot-chart", type: "link", active: false, selected: false, title: "Boxplot Charts" },
  //         { path: "/charts/apex-charts/bubble-chart", type: "link", active: false, selected: false, title: "Bubble Charts" },
  //         { path: "/charts/apex-charts/scatter-chart", type: "link", active: false, selected: false, title: "Scatter Charts" },
  //         { path: "/charts/apex-charts/heatmap-chart", type: "link", active: false, selected: false, title: "Heatmap Charts" },
  //         { path: "/charts/apex-charts/treemap-chart", type: "link", active: false, selected: false, title: "Treemap Charts" },
  //         { path: "/charts/apex-charts/pie-chart", type: "link", active: false, selected: false, title: "Pie Charts" },
  //         { path: "/charts/apex-charts/radialbar-chart", type: "link", active: false, selected: false, title: "Radialbar Charts" },
  //         { path: "/charts/apex-charts/radar-chart", type: "link", active: false, selected: false, title: "Radar Charts" },
  //         { path: "/charts/apex-charts/polararea-chart", type: "link", active: false, selected: false, title: "Polararea Charts" },
  //         // { path: "/charts/apex-charts/slope-chart", type: "link", active: false, selected: false, title: "Slope Charts" },
  //       ],
  //     },
  //     { path: "/charts/chartjs-charts", type: "link", active: false, selected: false, title: "Chartjs Charts" },
  //     { path: "/charts/echart-charts", type: "link", active: false, selected: false, title: "Echart Charts" },
  //   ],
  // },
  // {
  //   title: "Tables", icon: Tableicon, type: "sub", menutitle: "", active: false, selected: false, children: [
  //     { path: "/tables/tables", type: "link", active: false, selected: false, title: "Tables" },
  //     { path: "/tables/grid-js-tables", type: "link", active: false, selected: false, title: "Grid JS Tables" },
  //     { path: "/tables/data-tables", type: "link", active: false, selected: false, title: "Data Tables" },
  //   ],
  // },
];
