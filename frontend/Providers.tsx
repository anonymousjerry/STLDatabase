"use client";
import { Toaster } from "react-hot-toast";
import { ModalProvider } from "./context/ModalContext";
import ModalContainer from "./components/ModalContainer";

import React from "react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ModalProvider>
      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "17px",
          },
        }}
      />
      {children}
      <ModalContainer />
    </ModalProvider>
  );
};

export default Providers;