"use client"
import "./globals.scss";
import { Provider } from "react-redux";
import store from "@/shared/redux/store";
import PrelineScript from "./PrelineScript";
import { useState, useEffect } from "react";
import { Initialload } from "@/shared/layouts-components/contextapi";

const RootLayout = ({ children }: any) => {
  const [pageloading, setpageloading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // veya bir loading spinner
  }

  return (
    <html>
      <body>
        
        <Provider store={store}>
          <Initialload.Provider value={{ pageloading, setpageloading }}>
            {children}
          </Initialload.Provider>
        </Provider>
        <PrelineScript />
      </body>
    </html>
  );
};

export default RootLayout;