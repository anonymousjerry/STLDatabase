import Image from "next/image";
import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-custom-light-maincolor flex flex-col" aria-labelledby="footer-heading">
      <div className="flex justify-between mx-52 mb-[53px]">
        <div className="flex flex-col mt-10 gap-2 items-start jestify-start shrink-0">
          <Link href="/">
            <img
              src="/Footer_Logo.png"
              alt="Logo"
              width={506}
              height={64}
              className="cursor-pointer mb-2"
            />
          </Link>
          <div className="flex gap-3">
            <Image
              src={"/googleplay.png"}
              alt="Google Play"
              width={181}
              height={52}
              className="cursor-pointer"
            />
            <Image
              src={"/appstore.png"}
              alt="App Store"
              width={181}
              height={52}
              className="cursor-pointer"
            />
          </div>
          <div className="text-white text-left font-medium text-lg">
            Follow us
          </div>
          <div className="flex flex-row gap-1 items-center justify-start shrink-0 relative">
            <Image
              src={"/mark1.png"}
              alt="in"
              width={24}
              height={24}
              className="cursor-pointer"
            />
            <Image
              src={"/mark2 (2).png"}
              alt="in"
              width={24}
              height={24}
              className="cursor-pointer"
            />
            <Image
              src={"/mark3 (2).png"}
              alt="in"
              width={24}
              height={24}
              className="cursor-pointer"
            />
            <Image
              src={"/mark4 (2).png"}
              alt="in"
              width={24}
              height={24}
              className="cursor-pointer"
            />
            <Image
              src={"/mark5 (2).png"}
              alt="in"
              width={24}
              height={24}
              className="cursor-pointer"
            />
          </div>
        </div>
        <div className="flex flex-col gap-[2px] items-end justify-end mt-32 shrink-0 relative">
          <div className="flex gap-2 justify-center items-center">
            <Image
              src={"/Platforms/f1.png"}
              alt="in"
              width={25}
              height={24}
              className="cursor-pointer"
            />
            <Image
              src={"/Platforms/f2.png"}
              alt="in"
              width={25}
              height={24}
              className="cursor-pointer"
            />
            <Image
              src={"/Platforms/f3.png"}
              alt="in"
              width={25}
              height={24}
              className="cursor-pointer"
            />
            <Image
              src={"/Platforms/f4.png"}
              alt="in"
              width={25}
              height={24}
              className="cursor-pointer"
            />
            <Image
              src={"/Platforms/f5.png"}
              alt="in"
              width={25}
              height={24}
              className="cursor-pointer"
            />
            <Image
              src={"/Platforms/f6.png"}
              alt="in"
              width={25}
              height={24}
              className="cursor-pointer"
            />
            <Image
              src={"/Platforms/f7.png"}
              alt="in"
              width={25}
              height={24}
              className="cursor-pointer"
            />
            <Image
              src={"/Platforms/f8.png"}
              alt="in"
              width={25}
              height={24}
              className="cursor-pointer"
            />
            <Image
              src={"/Platforms/f9.png"}
              alt="in"
              width={25}
              height={24}
              className="cursor-pointer"
            />
            <span className="text-white text-left font-medium text-lg ">
              ...more
            </span>
          </div>
          <div className="text-white text-left font-bold text-2xl">
            Discover the Best of 3D Printing Models
          </div>
          <div className="flex flex-col items-end">
            <span className="text-white text-left text-[18px] font-light">
              Your all-in-one search engine for discovering the best 3D
            </span>
            <span className="text-white text-left text-lg font-light">
              printable models online
            </span>
          </div>
        </div>
        
      </div>
      <div className="flex items-center justify-center gap-6 text-white text-lg font-medium relative">
          <span>
            Privacy policy
          </span>
          <span>
            Term of policy
          </span>
          <span>
            FAQs
          </span>
          <span>
            Contact
          </span>
          <span className="absolute left-0 -bottom-2 w-full h-0.5 bg-white rounded"></span>
        </div>
        <div className="flex items-center justify-center text-white text-sm font-light my-[18px]">
          Copyright @ STLDatabase.com 2025
        </div>
      
    </footer>
  );
};

export default Footer;
