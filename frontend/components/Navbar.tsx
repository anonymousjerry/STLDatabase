// *********************
// Role of the component: Search input element located in the header but it can be used anywhere in your application
// Name of the component: SearchInput.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <SearchInput />
// Input parameters: no input parameters
// Output: form with search input and button
// *********************

"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useState, useRef, useEffect } from "react";
import { FaUser, FaHeart, FaCar } from 'react-icons/fa';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import Modal from "./Modal";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import { useModal } from "@/context/ModalContext";

const Navbar = () => {

  const {openModal} = useModal();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [accountMenuOpen, setAccountMenuOpen] = useState<boolean>(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const pathname = usePathname();
  const categoryRef = useRef<HTMLDivElement>(null);
  const isCategoryActive = categoryOpen;
  const links = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explore' },
    { href: '/faqs', label: 'FAQs' },
    { href: '/contact', label: 'Contact' },
  ];
  const isActive = (href: string) =>
    !isCategoryActive && (href === '/' ? pathname === '/' : pathname.startsWith(href));

  const handleLogOut = () => {
    toast.success("Logout Successful!");
    setTimeout(() => signOut(), 1000);
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

  // useEffect(() => {
  //   if (status === "authenticated" && session?.user) {
  //     // axiosInstance.get("/protected-route")
  //     //   .then((res) => console.log("Protected data:", res.data))
  //     //   .catch((err) => console.error("Axios error:", err));
  //     console.log(session.user.accesstoken)
  //   }
  // }, [session, status]);
  // console.log(session?.user?.image)


  return (
    <nav className="bg-custom-maincolor px-32 py-4  grid grid-cols-3 max-md:grid-cols-1 items-center justify-between text-white">
      {/* Logo + Navigation */}
      <div className="flex items-center space-x-80">
        <Link href="/">
          <img
            src="/logo.png"
            alt="Logo"
            className="cursor-pointer"
          />
        </Link>
      </div>

      <div className="hidden md:flex gap-6">
        {[...links.slice(0, 2)].map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`relative hover:text-green-600 transition ${
              isActive(link.href) ? ' font-medium' : ''
            }`}
          >
            {link.label}
            {isActive(link.href) && (
              <span className="absolute left-0 -bottom-1 w-full h-1 bg-green-500 rounded"></span>
            )}
          </Link>
        ))}
        <div ref={categoryRef} className="relative">
          <button
          onClick={() => setCategoryOpen(!categoryOpen)}
          className={`relative flex flex-row items-center gap-1 transition ${
            isCategoryActive ? 'font-medium' : 'hover:text-green-600'
          }`}
        >
          <span>Categories</span>
          <svg
            className="size-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>

          {categoryOpen && (
            <span className="absolute left-0 -bottom-1 w-full h-1 bg-green-500 rounded" />
          )}
        </button>

          {/* Dropdown box */}
          {categoryOpen && (
            <div className="absolute top-10 left-0 w-48 bg-white border rounded shadow-md p-4 z-50">
              <ul className="space-y-2 text-black">
                <li className="cursor-pointer hover:text-green-600">🎮 Gaming</li>
                <li className="cursor-pointer hover:text-green-600">🎨 Art</li>
                <li className="cursor-pointer hover:text-green-600">🏠 Home & Living</li>
                <li className="cursor-pointer hover:text-green-600">🛠️ Tools</li>
                <li className="cursor-pointer hover:text-green-600">🐾 Pets</li>
              </ul>
            </div>
          )}
        </div>
        {[...links.slice(2)].map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`relative  hover:text-green-600 transition ${
              isActive(link.href) ? ' font-medium' : ''
            }`}
          >
            {link.label}
            {isActive(link.href) && (
              <span className="absolute left-0 -bottom-1 w-full h-1 bg-green-500 rounded"></span>
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
          >
            <FaUser className="mr-2" />
            Account ▼
          </button>

          {accountMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black shadow-lg rounded-md z-10">
              <button onClick={() => openModal('login')} className="block px-4 py-2 hover:bg-gray-100">Login</button>
              <button onClick={() => openModal('register')} className="block px-4 py-2 hover:bg-gray-100">Register</button>
              <a href="#" className="block px-4 py-2 hover:bg-gray-100">Logout</a>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
