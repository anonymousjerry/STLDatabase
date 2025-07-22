// *********************
// Role of the component: Header component
// Name of the component: Header.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Header />
// Input parameters: no input parameters
// Output: Header component
// *********************

"use client";
import React, { useEffect, useState } from "react";
import HeaderTop from "./HeaderTop";
import Navbar from "./Navbar";

const Header = () => {


  return (
    <div className="bg-white flex flex-col">
      <HeaderTop />
      <Navbar />
      {/* <HeaderMain /> */}
    </div>
  );
};

export default Header;
