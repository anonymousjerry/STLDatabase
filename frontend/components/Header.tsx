"use client";
import React from "react";
import HeaderTop from "./HeaderTop";
import Navbar from "./Navbar";

const Header = () => {


  return (
    <div className="bg-white flex flex-col">
      <HeaderTop />
      <Navbar />
    </div>
  );
};

export default Header;
