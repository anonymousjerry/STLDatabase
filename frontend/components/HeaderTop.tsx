"use client";

import React from "react";
import ThemeToggleButton from "./ThemeToggleButton";
import { FaSquareFacebook, FaSquareInstagram, FaXTwitter } from "react-icons/fa6";

const HeaderTop = () => {

  return (
    <div className="w-full bg-custom-light-titlecolor" style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}>
      <div className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 md:px-8 h-[46px] flex items-center justify-between text-white">
        {/* Left Column - Social Media */}
        <div className="flex items-center gap-3">
          <span className="text-white font-['Inter-Light',_sans-serif] text-sm font-light hidden sm:block">
            Follow us on
          </span>
          <div className="flex items-center gap-2">
            <a
              href="https://x.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition-colors duration-200 p-1"
              aria-label="Follow us on X (Twitter)"
            >
              <FaXTwitter size={18} />
            </a>
            <a
              href="https://www.facebook.com//yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition-colors duration-200 p-1"
              aria-label="Follow us on Facebook"
            >
              <FaSquareFacebook size={18} />
            </a>
            <a
              href="https://www.instagram.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition-colors duration-200 p-1"
              aria-label="Follow us on Instagram"
            >
              <FaSquareInstagram size={18} />
            </a>
          </div>
        </div>

        {/* Right Column - Theme Toggle */}
        <div className="flex items-center">
          <ThemeToggleButton />
        </div>
      </div>
    </div>
  );
};

export default HeaderTop;
