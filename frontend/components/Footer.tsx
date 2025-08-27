"use client";

import Image from "next/image";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import { getPlatforms } from "@/lib/platformApi";
import { FaSquareFacebook, FaSquareInstagram, FaXTwitter } from "react-icons/fa6";

const Footer = () => {

  const [platforms, setPlatforms] = useState([]);
  
  useEffect(() => {
    getPlatforms().then(setPlatforms).catch(console.error);
    
  }, []);
console.log(platforms)
  return (
    <footer className="bg-custom-light-maincolor flex flex-col" aria-labelledby="footer-heading">
      <div className="flex flex-col lg:flex-row justify-between px-4 sm:px-8 md:px-16 lg:px-32 xl:px-52 mb-8 lg:mb-[53px] gap-8 lg:gap-0">
        {/* Left Section */}
        <div className="flex flex-col mt-6 lg:mt-10 gap-4 lg:gap-2 items-start lg:justify-start shrink-0">
          <Link href="/" className="w-full ">
            <div className="relative w-full max-w-[300px] lg:max-w-[506px] h-12">
              <Image
                src="/Logo.png"
                alt="Logo"
                width={300}
                height={506}
                // fill
                className="cursor-pointer object-contain"
                // sizes="(max-width: 1024px) 300px, 506px"
              />
            </div>
          </Link>
          {/* <div className="flex gap-3">
            <div className="relative w-[120px] lg:w-[181px] h-[52px]">
              <Image
                src={"/googleplay.png"}
                alt="Google Play"
                fill
                className="cursor-pointer object-contain"
                sizes="(max-width: 1024px) 120px, 181px"
              />
            </div>
            <div className="relative w-[120px] lg:w-[181px] h-[52px]">
              <Image
                src={"/appstore.png"}
                alt="App Store"
                fill
                className="cursor-pointer object-contain"
                sizes="(max-width: 1024px) 120px, 181px"
              />
            </div>
          </div> */}
          <div className="text-white text-left font-medium text-base lg:text-lg">
            Follow us
          </div>
          <div className="flex flex-row gap-2 lg:gap-1 items-center justify-start shrink-0 relative">
            <a
              href="https://x.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition-colors duration-200"
            >
              <FaXTwitter size={20} className="lg:w-[24px] lg:h-[24px]" />
            </a>
            <a
              href="https://www.facebook.com//yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition-colors duration-200"
            >
              <FaSquareFacebook size={20} className="lg:w-[24px] lg:h-[24px]" />
            </a>
            <a
              href="https://www.instagram.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition-colors duration-200"
            >
              <FaSquareInstagram size={20} className="lg:w-[24px] lg:h-[24px]" />
            </a>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col gap-4 lg:gap-[2px] items-center lg:items-end justify-end lg:mt-32 shrink-0 relative">
          <div className="flex gap-2 justify-center items-center flex-wrap">
             {platforms.map((platform, index) => (
                <Link 
                  href={platform[1]} 
                  target="_blank" 
                  key={index} 
                  className="relative w-[20px] lg:w-[25px] h-[24px]"
                >
                  <Image
                    src={platform[3]}
                    alt={platform[0]}
                    fill
                    className="cursor-pointer object-contain"
                    sizes="(max-width: 1024px) 20px, 25px"
                    unoptimized
                  />
                </Link>
              ))}
            <span className="text-white text-left font-medium text-base lg:text-lg">
              ...more
            </span>
          </div>
          <div className="text-white font-bold text-xl lg:text-2xl text-center lg:text-right">
            Discover the Best of 3D Printing Models
          </div>
          <div className="flex flex-col items-center lg:items-end">
            <span className="text-white text-base lg:text-[18px] font-light text-center lg:text-right">
              Your all-in-one search engine for discovering the best 3D
            </span>
            <span className="text-white text-base lg:text-lg font-light text-center lg:text-right">
              printable models online
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Links */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-white text-base lg:text-lg font-medium relative px-4">
        <Link href="/privacy" className="hover:text-gray-300 transition-colors duration-200">
          Privacy policy
        </Link>
        <div className="hidden sm:block">|</div>
        <Link href="/terms" className="hover:text-gray-300 transition-colors duration-200">
          Term of policy
        </Link>
        <div className="hidden sm:block">|</div>
        <Link href="/blog" className="hover:text-gray-300 transition-colors duration-200">
          Blog
        </Link>
        <div className="hidden sm:block">|</div>
        <Link href="/contact" className="hover:text-gray-300 transition-colors duration-200">
          Contact
        </Link>
        <span className="absolute left-0 -bottom-2 w-full h-0.5 bg-white rounded hidden lg:block"></span>
      </div>

      {/* Copyright */}
      <div className="flex items-center justify-center text-white text-sm font-light my-4 lg:my-[18px] px-4">
        Copyright @ 3DDatabase.com 2025
      </div>
    </footer>
  );
};

export default Footer;
