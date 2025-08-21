"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useState, useRef, useEffect } from "react";
import { FaUser, FaHeart } from 'react-icons/fa';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { useModal } from "@/context/ModalContext";
import { useSearch } from "@/context/SearchContext";
import { FaAngleDown } from "react-icons/fa6";
import CategoryMenu from "./CategoryMenu";
import Image from "next/image";

const Navbar = () => {

  const {openModal} = useModal();
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [accountMenuOpen, setAccountMenuOpen] = useState<boolean>(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const pathname = usePathname();
  const categoryRef = useRef<HTMLDivElement>(null);
  const isCategoryActive = categoryOpen;
  const links = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explore' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ];
  const isActive = (href: string) =>
    !isCategoryActive && (href === '/' ? pathname === '/' : pathname.startsWith(href));


  const handleLogOut = () => {
    toast.success("Logout Successful!");
    setTimeout(() => {
      signOut({callbackUrl: '/'})
    }, 1000);
  }
  

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const {
      setSelectedPlatform,
      setSelectedCategory,
      setSearchInput
  } = useSearch();

  const resetSearch = (href: string) => {
      setSelectedPlatform('All');
      setSelectedCategory('All');
      setSearchInput('');
      router.push(href);
  };


  return (
    <nav className="bg-custom-light-maincolor px-52 py-4  grid grid-cols-3 max-md:grid-cols-1 items-center justify-between text-white">
      {/* Logo + Navigation */}
      <div className="flex items-center space-x-80" onClick={() => resetSearch("/")}>
        {/* <Link href="/"> */}
          <Image
            src="/logo.png"
            alt="Logo"
            width={256}
            height={36}
            className="cursor-pointer"
          />
        {/* </Link> */}
      </div>

      <div className="hidden md:flex gap-6">
        {[...links.slice(0, 2)].map(link => (
          <div
            key={link.href}
            onClick={() => resetSearch(link.href)}
            className={`relative cursor-pointer hover:text-[#b6e402] transition ${
              isActive(link.href) ? ' font-medium' : ''
            }`}
          >
            {link.label}
            {isActive(link.href) && (
              <span className="absolute left-0 -bottom-1 w-full h-1 bg-[#b6e402] rounded transition-all"></span>
            )}
          </div>
        ))}
        <div ref={categoryRef} className="relative">
          <button
            onClick={() => setCategoryOpen(!categoryOpen)}
            className={`relative flex flex-row items-center gap-1 transition ${
              isCategoryActive ? 'font-medium' : 'hover:text-[#b6e402]'
            }`}
          >
            <span>Categories</span>
            <FaAngleDown />
            {categoryOpen && (
              <span className="absolute left-0 -bottom-1 w-full h-1 bg-[#b6e402] transition-all rounded" />
            )}
          </button>

          {/* Dropdown box */}
          { categoryOpen && (
            <CategoryMenu setCategoryOpen = {setCategoryOpen}/>
          )}
        </div>
        {[...links.slice(2)].map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`relative  hover:text-[#b6e402] transition ${
              isActive(link.href) ? ' font-medium' : ''
            }`}
          >
            {link.label}
            {isActive(link.href) && (
              <span className="absolute left-0 -bottom-1 w-full h-1 bg-[#b6e402] transition-all rounded"></span>
            )}
          </Link>
        ))}
      </div>

      {/* Right Side Icons */}
      <div className="flex justify-end items-center space-x-4">
        <button className="p-2 border border-white rounded-full hover:bg-white/10">
          <FaHeart />
        </button>

        <div className="relative">
          <button
            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            className="flex items-center bg-lime-400 text-black font-semibold px-4 py-2 rounded-full hover:bg-lime-500"
            aria-haspopup="true"
            aria-expanded={accountMenuOpen}
          >
            <FaUser className="mr-2" />
            {sessionStatus === "authenticated" && session?.user?.username
              ? session.user.username
              : "Account"} ▼
          </button>

          {accountMenuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-xl shadow-xl z-50 ring-1 ring-gray-200 animate-fade-in overflow-hidden">
              <a
                href="/login"
                className="block px-5 py-2 text-lg hover:bg-gray-100 hover:text-blue-600 transition-colors duration-150"
              >
                🔐 Login
              </a>
              <a
                href="/register"
                className="block px-5 py-2 text-lg hover:bg-gray-100 hover:text-green-600 transition-colors duration-150"
              >
                📝 Register
              </a>
              <button
                onClick={handleLogOut}
                className="w-full text-left px-5 py-2 text-lg hover:bg-gray-100 hover:text-red-600 transition-colors duration-150"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
