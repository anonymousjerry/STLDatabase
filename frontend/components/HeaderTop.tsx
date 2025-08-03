"use client";

import React from "react";
import ThemeToggleButton from "./ThemeToggleButton";

const HeaderTop = () => {

  return (
    <div
      className="grid grid-cols-2 max-md:grid-cols-1 px-52 h-[46px] max-lg:px-5 max-lg:h-16 max-sm:px-2 items-center text-white bg-custom-light-titlecolor"
      style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
    >
      {/* Left Column */}
      <div className="flex flex-row gap-3 text-white text-left font-['Inter-Light',_sans-serif] text-base font-light max-md:justify-center max-md:py-2">
        <div>Platform Center</div>
        <div>|</div>
        <div className="flex gap-1">
          <div className="text-white text-left font-['Inter-Light',_sans-serif] text-base font-light">
            Follow us on
          </div>
          <div className="flex flex-row gap-1 items-center justify-start shrink-0 relative">
            <img
              className="shrink-0 w-4 h-4 relative overflow-visible"
              style={{ aspectRatio: "1" }}
              src="/linkdin_mark.png"
            />
            <img
              className="shrink-0 w-4 h-4 relative overflow-visible"
              style={{ aspectRatio: "1" }}
              src="/mark2.png"
            />
            <img
              className="shrink-0 w-4 h-4 relative overflow-visible"
              style={{ aspectRatio: "1" }}
              src="/mark3.png"
            />
            <img
              className="shrink-0 w-4 h-4 relative overflow-visible"
              style={{ aspectRatio: "1" }}
              src="/mark4.png"
            />
            <img
              className="shrink-0 w-4 h-4 relative overflow-visible"
              style={{ aspectRatio: "1" }}
              src="/mark5.png"
            />
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
          <img
            className="shrink-0 w-5 h-5 relative overflow-visible justify-center"
            style={{ aspectRatio: "1" }}
            src="/mark6.png"
          />
          <div className="text-white text-left font-['Inter-Light',_sans-serif] text-base font-light">
            Help
          </div>
        </div>
        <div>|</div>
        <div className="flex flex-row items-center gap-1">
          <img
            className="shrink-0 w-5 h-5 relative overflow-visible"
            style={{ aspectRatio: "1" }}
            src="/mark7.png"
          />
          <div className="text-white text-left font-['Inter-Light',_sans-serif] text-base font-light">
            Eng
          </div>
        </div>
        
      </div>
    </div>

  );
};

export default HeaderTop;
