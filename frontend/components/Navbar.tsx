"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useState, useRef, useEffect } from "react";
import { FaUser, FaHeart, FaBars, FaTimes } from 'react-icons/fa';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { useModal } from "@/context/ModalContext";
import { useSearch } from "@/context/SearchContext";
import Image from "next/image";

const Navbar = () => {

  const {openModal} = useModal();
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [accountMenuOpen, setAccountMenuOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const userId = (session?.user as { id?: string })?.id;

  const links = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explore' },
    { href: '/categories', label: 'Categories' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ];
  const isActive = (href: string) =>
    (href === '/' ? pathname === '/' : pathname.startsWith(href));


  const handleLogOut = () => {
    toast.success("Logout Successful!");
    setTimeout(() => {
      signOut({callbackUrl: '/'})
    }, 1000);
  }
  

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const {
      searchInput,
      selectedPlatform,
      selectedCategory,
      selectedSubCategory,
      searchPrice,
      favourited,
      liked,
      setSelectedPlatform,
      setSelectedCategory,
      setSelectedSubCategory,
      setliked,
      setSearchInput
  } = useSearch();

  const resetSearch = (href: string) => {
      setSelectedPlatform('All');
      setSelectedCategory('All');
      setSelectedSubCategory({id: "", name: ""});
      setSearchInput('');
      setMobileMenuOpen(false);
      router.push(href);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLike = () => {
    if (!userId) {
      toast.error("Please log in to like this model.");
      return;
    }
    setliked(true);
    const queryParams = new URLSearchParams();
    queryParams.set("liked", 'true');
    queryParams.set("userId", userId)
    if (searchInput) queryParams.set("key", searchInput);
    if (selectedPlatform && selectedPlatform !== "All")
      queryParams.set("sourcesite", selectedPlatform);
    if (selectedCategory && selectedCategory !== "All")
      queryParams.set("category", selectedCategory);
    // if (selectedSubCategory?.id)
    //   queryParams.set("subCategory", selectedSubCategory.id);
    if (searchPrice && searchPrice !== "All")
      queryParams.set("price", searchPrice);
    if (favourited) queryParams.set("favourited", "true");
    router.push(`/explore?${queryParams.toString()}`);
  }


  return (
    <nav className="bg-custom-light-maincolor px-4 sm:px-8 md:px-16 lg:px-32 xl:px-52 py-4 relative">
      {/* Desktop Navigation */}
      <div className="hidden lg:grid lg:grid-cols-3 items-center justify-between text-white">
        {/* Logo + Navigation */}
        <div className="flex items-center" onClick={() => resetSearch("/")}>
          <div className="relative w-64 h-9">
            <Image
              src="/Logo.png"
              alt="Logo"
              fill
              className="cursor-pointer object-contain"
              sizes="256px"
            />
          </div>
        </div>

        <div className="flex gap-6 justify-center">
          {links.map(link => (
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
        </div>

        {/* Right Side Icons */}
        <div className="flex justify-end items-center space-x-4">
          <button 
            className="p-2 border border-white rounded-full hover:bg-white/10"
            onClick={handleLike}
          >
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
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden flex items-center justify-between text-white">
        {/* Mobile Logo */}
        <div className="flex items-center" onClick={() => resetSearch("/")}>
          <div className="relative w-[180px] h-[25px]">
            <Image
              src="/Logo.png"
              alt="Logo"
              fill
              className="cursor-pointer object-contain"
              sizes="180px"
            />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-3">
          <button 
            className="p-2 border border-white rounded-full hover:bg-white/10"
            onClick={handleLike}
          >
            <FaHeart size={16} />
          </button>
          
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
          >
            {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="lg:hidden absolute top-full left-0 right-0 bg-custom-light-maincolor border-t border-white/20 z-50"
        >
          <div className="px-4 py-6 space-y-4">
            {/* Navigation Links */}
            <div className="space-y-3">
              {links.map(link => (
                <div
                  key={link.href}
                  onClick={() => resetSearch(link.href)}
                  className={`text-white py-2 px-3 rounded-lg cursor-pointer transition ${
                    isActive(link.href) 
                      ? 'bg-white/20 font-medium' 
                      : 'hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </div>
              ))}
            </div>

            {/* Account Section */}
            <div className="pt-6 border-t border-white/20">
              <div className="bg-white/10 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center">
                      <FaUser className="text-black text-lg" />
                    </div>
                    <div>
                      <span className="text-white font-semibold text-base block">
                        {sessionStatus === "authenticated" && session?.user?.username
                          ? session.user.username
                          : "Guest User"}
                      </span>
                      <span className="text-white/70 text-sm">
                        {sessionStatus === "authenticated" ? "Signed In" : "Not signed in"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                {sessionStatus === "authenticated" ? (
                  <>
                    <button
                      onClick={handleLogOut}
                      className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span className="text-lg">🚪</span>
                      <span>Sign Out</span>
                    </button>
                    <div className="text-center">
                      <span className="text-white/60 text-sm">
                        Welcome back! You're signed in.
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="w-full flex items-center justify-center gap-2 bg-lime-400 hover:bg-lime-500 text-black font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span className="text-lg">🔐</span>
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/register"
                      className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] border border-white/20"
                    >
                      <span className="text-lg">📝</span>
                      <span>Create Account</span>
                    </Link>
                    <div className="text-center pt-2">
                      <span className="text-white/60 text-sm">
                        Sign in to save favorites and track downloads
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
