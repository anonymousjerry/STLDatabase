// *********************
// Role of the component: Topbar of the header
// Name of the component: HeaderTop.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <HeaderTop />
// Input parameters: no input parameters
// Output: topbar with phone, email and login and register links
// *********************

"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import { FaHeadphones } from "react-icons/fa6";
import { FaRegEnvelope } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa6";

const HeaderTop = () => {
  const { data: session }: any = useSession();

  const handleLogout = () => {
    setTimeout(() => signOut(), 1000);
    toast.success("Logout successful!");
  }
  return (
    <div
      className="grid grid-cols-2 max-md:grid-cols-1 px-32 h-[46px] max-lg:px-5 max-lg:h-16 max-sm:px-2 items-center text-white bg-custom-bgcolor"
      style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
    >
      {/* Left Column */}
      <div className="flex flex-row gap-3 text-[#ffffff] text-left font-['Inter-Light',_sans-serif] text-base font-light max-md:justify-center max-md:py-2">
        <div>Platform Center</div>
        <div>|</div>
        <div className="flex gap-1">
          <div className="text-[#ffffff] text-left font-['Inter-Light',_sans-serif] text-base font-light">
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
          <img
            className="shrink-0 w-5 h-5 relative overflow-visible justify-center"
            style={{ aspectRatio: "1" }}
            src="/mark6.png"
          />
          <div className="text-[#ffffff] text-left font-['Inter-Light',_sans-serif] text-base font-light">
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
          <div className="text-[#ffffff] text-left font-['Inter-Light',_sans-serif] text-base font-light">
            Eng
          </div>
        </div>
      </div>
    </div>

    //     {/* <ul className="flex items-center gap-x-5 h-full max-[370px]:text-sm max-[370px]:gap-x-2 font-semibold">
    //       {!session ? ( 
    //       <>
    //       <li className="flex items-center">
    //         <Link href="/login" className="flex items-center gap-x-2 font-semibold">
    //           <FaRegUser className="text-white" />
    //           <span>Login</span>
    //         </Link>
    //       </li>
    //       <li className="flex items-center">
    //         <Link href="/register" className="flex items-center gap-x-2 font-semibold">
    //           <FaRegUser className="text-white" />
    //           <span>Register</span>
    //         </Link>
    //       </li>
    //       </>
    //       ) :  (<>
    //       <span className="ml-10 text-base">{session.user?.email}</span>
    //       <li className="flex items-center">
    //         <button onClick={() => handleLogout()} className="flex items-center gap-x-2 font-semibold">
    //           <FaRegUser className="text-white" />
    //           <span>Log out</span>
    //         </button>
    //       </li>
    //       </>)}
    //     </ul> */}
  );
};

export default HeaderTop;
