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
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import HeaderTop from "./HeaderTop";
import HeaderMain from "./HeaderMain"; 
import Image from "next/image";
import SearchInput from "./SearchInput";
import Navbar from "./Navbar";
import Link from "next/link";
import { FaBell } from "react-icons/fa6";

import CartElement from "./CartElement";
import HeartElement from "./HeartElement";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";

const Header = () => {
  // const { data: session, status } = useSession();
  // const pathname = usePathname();
  // const { wishlist, setWishlist, wishQuantity } = useWishlistStore();


  // getting all wishlist items by user id
  // const getWishlistByUserId = async (id: string) => {
  //   const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/wishlist/${id}`, {
  //     cache: "no-store",
  //   });
  //   const wishlist = await response.json();
  //   const productArray: {
  //     id: string;
  //     title: string;
  //     price: number;
  //     image: string;
  //     slug:string
  //     stockAvailabillity: number;
  //   }[] = [];
    
  //   wishlist.map((item: any) => productArray.push({id: item?.product?.id, title: item?.product?.title, price: item?.product?.price, image: item?.product?.mainImage, slug: item?.product?.slug, stockAvailabillity: item?.product?.inStock}));
    
  //   setWishlist(productArray);
  // };

  // // getting user by email so I can get his user id
  // const getUserByEmail = async () => {
  //   if (session?.user?.email) {
      
  //     fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/email/${session?.user?.email}`, {
  //       cache: "no-store",
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         getWishlistByUserId(data?.id);
  //       });
  //   }
  // };

  // useEffect(() => {
  //   getUserByEmail();
  // }, [session?.user?.email, wishlist.length]);

  return (
    <div className="bg-white flex flex-col">
      <HeaderTop />
      <Navbar />
      {/* <HeaderMain /> */}
    </div>
  );
};

export default Header;
