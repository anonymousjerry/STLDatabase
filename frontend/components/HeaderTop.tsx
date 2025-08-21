"use client";

import React from "react";
import ThemeToggleButton from "./ThemeToggleButton";
import { FaSquareFacebook, FaSquareInstagram, FaXTwitter } from "react-icons/fa6";
import { HiOutlineGlobeAlt, HiOutlineQuestionMarkCircle } from "react-icons/hi";
import { CiGlobe } from "react-icons/ci";

const HeaderTop = () => {

  return (
    <div
      className="grid grid-cols-2 max-md:grid-cols-1 px-52 h-[46px] max-lg:px-5 max-lg:h-16 max-sm:px-2 items-center text-white bg-custom-light-titlecolor"
      style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
    >
      {/* Left Column */}
      <div className="flex flex-row gap-3 text-white text-left font-['Inter-Light',_sans-serif] text-base font-light max-md:justify-center max-md:py-2">
        <div className="flex gap-2">
          <div className="text-white text-left font-['Inter-Light',_sans-serif] text-base font-light">
            Follow us on
          </div>
          <div className="flex flex-row gap-2 items-center justify-start shrink-0 relative">
            <a
              href="https://x.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-600"
            >
              <FaXTwitter size={18} color="white" />
            </a>
            <a
              href="https://www.facebook.com//yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-600"
            >
              <FaSquareFacebook size={20} color="white" />
            </a>
            <a
              href="https://www.instagram.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-600"
            >
              <FaSquareInstagram size={20} color="white" />
            </a>

            
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex flex-row gap-3 justify-end  max-md:justify-center max-md:py-2">
        <div className="flex flex-row items-center gap-1">
          <ThemeToggleButton />
        </div>
        <div>|</div>
        <div className="flex flex-row items-center gap-1">
          <HiOutlineQuestionMarkCircle size={20} />
          <div className="text-white text-left font-['Inter-Light',_sans-serif] text-base font-light">
            Help
          </div>
        </div>
        <div>|</div>
        <div className="flex flex-row items-center gap-1">
          {/* <img
            className="shrink-0 w-5 h-5 relative overflow-visible"
            style={{ aspectRatio: "1" }}
            src="/mark7.png"
          /> */}
          <CiGlobe size={20}/>
          <div className="text-white text-left font-['Inter-Light',_sans-serif] text-base font-light">
            Eng
          </div>
        </div>
        
      </div>
    </div>

  );
};

export default HeaderTop;
