"use client";

import React from "react";
import ThemeToggleButton from "./ThemeToggleButton";
import { FaSquareFacebook, FaSquareInstagram, FaXTwitter } from "react-icons/fa6";
import { HiOutlineGlobeAlt, HiOutlineQuestionMarkCircle } from "react-icons/hi";
import { CiGlobe } from "react-icons/ci";

const HeaderTop = () => {

  return (
    <div className="w-full bg-custom-light-titlecolor" style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}>
      <div className="mx-auto w-full max-w-[1300px] grid grid-cols-2 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 px-4 sm:px-6 md:px-8 h-auto min-h-[46px] py-2 lg:py-0 lg:h-[46px] items-center text-white">
      {/* Left Column */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 text-white text-left font-['Inter-Light',_sans-serif] text-sm sm:text-base font-light justify-center lg:justify-start">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center lg:items-start">
          <div className="text-white text-left font-['Inter-Light',_sans-serif] text-sm sm:text-base font-light">
            Follow us on
          </div>
          <div className="flex flex-row gap-2 items-center justify-center lg:justify-start shrink-0 relative">
            <a
              href="https://x.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition-colors duration-200"
            >
              <FaXTwitter size={16} className="sm:w-[18px] sm:h-[18px]" />
            </a>
            <a
              href="https://www.facebook.com//yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition-colors duration-200"
            >
              <FaSquareFacebook size={18} className="sm:w-[20px] sm:h-[20px]" />
            </a>
            <a
              href="https://www.instagram.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition-colors duration-200"
            >
              <FaSquareInstagram size={18} className="sm:w-[20px] sm:h-[20px]" />
            </a>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center lg:justify-end items-center lg:items-center">
        <div className="flex flex-row items-center gap-1">
          <ThemeToggleButton />
        </div>
        <div className="hidden sm:block">|</div>
        <div className="flex flex-row items-center gap-1">
          <HiOutlineQuestionMarkCircle size={18} className="sm:w-[20px] sm:h-[20px]" />
          <div className="text-white text-left font-['Inter-Light',_sans-serif] text-sm sm:text-base font-light">
            Help
          </div>
        </div>
        <div className="hidden sm:block">|</div>
        <div className="flex flex-row items-center gap-1">
          <CiGlobe size={18} className="sm:w-[20px] sm:h-[20px]"/>
          <div className="text-white text-left font-['Inter-Light',_sans-serif] text-sm sm:text-base font-light">
            Eng
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default HeaderTop;
