"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useState, useRef, useEffect } from "react";
import { FaUser, FaHeart, FaBars, FaTimes, FaHome, FaCompass, FaThLarge, FaBlog, FaEnvelope } from 'react-icons/fa';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { useModal } from "@/context/ModalContext";
import { useSearch } from "@/context/SearchContext";
import Image from "next/image";
import ThemeToggleButton from "./ThemeToggleButton";

const Navbar = () => {

  const {openModal} = useModal();
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [accountMenuOpen, setAccountMenuOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const userId = (session?.user as { id?: string })?.id;

  const links = [
    { href: '/', label: 'Home', icon: FaHome },
    { href: '/explore', label: 'Explore', icon: FaCompass },
    { href: '/categories', label: 'Categories', icon: FaThLarge },
    { href: '/blog', label: 'Blog', icon: FaBlog },
    { href: '/contact', label: 'Contact', icon: FaEnvelope },
  ];
  
  const isActive = (href: string) =>
    (href === '/' ? pathname === '/' : pathname.startsWith(href));

  const handleLogOut = async () => {
    try {
      setAccountMenuOpen(false);
      setMobileMenuOpen(false);
      toast.success("Logout Successful!");
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Logout failed. Please try again.");
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Close mobile menu when clicking outside
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
      // Close account dropdown when clicking outside
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    };

    // Close mobile menu on route change
    const handleRouteChange = () => {
      setMobileMenuOpen(false);
      setAccountMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const {
      searchInput,
      selectedPlatform,
      selectedCategory,
      selectedSubCategory,
      searchPrice,
      liked,
      setSelectedPlatform,
      setSelectedCategory,
      setSelectedSubCategory,
      setSearchPrice,
      setSearchTag,
      setliked,
      setUserId,
      setSearchInput
  } = useSearch();

  const resetSearch = (href: string) => {
      setSelectedPlatform('All');
      setSelectedCategory('All');
      setSelectedSubCategory({id: "", name: ""});
      setSearchInput('');
      setSearchPrice("");
      setSearchTag("");
      setliked(false);
      setMobileMenuOpen(false);
      setAccountMenuOpen(false);
      router.push(href);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setAccountMenuOpen(false); // Close account menu when opening mobile menu
  };

  const handleLike = () => {
    if (!userId) {
      toast.error("Please log in to like this model.");
      return;
    }
    setliked(true);
    setUserId(userId);
    const queryParams = new URLSearchParams();
    queryParams.set("liked", 'true');
    queryParams.set("userId", userId)
    if (searchInput) queryParams.set("key", searchInput);
    if (selectedPlatform && selectedPlatform !== "All")
      queryParams.set("sourcesite", selectedPlatform);
    if (selectedCategory && selectedCategory !== "All")
      queryParams.set("category", selectedCategory);
    if (selectedSubCategory?.id)
      queryParams.set("subCategory", selectedSubCategory.id);
    if (searchPrice && searchPrice !== "All")
      queryParams.set("price", searchPrice);
    router.push(`/explore?${queryParams.toString()}`);
  }

  return (
    <nav className="w-full bg-custom-light-maincolor py-2.5 sm:py-3 md:py-4 relative shadow-lg">
      <div className="mx-auto w-full max-w-[1300px] px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <div className="hidden lg:grid lg:grid-cols-3 items-center justify-between text-white">
          {/* Logo + Navigation */}
          <div className="flex items-center" onClick={() => resetSearch("/")}>
            <div className="relative w-64 h-9 cursor-pointer">
              <Image
                src="/Logo.png"
                alt="Logo"
                fill
                className="object-contain"
                sizes="256px"
              />
            </div>
          </div>

          <div className="flex gap-6 justify-center">
            {links.map(link => (
              <div
                key={link.href}
                onClick={() => resetSearch(link.href)}
                className={`relative cursor-pointer hover:text-[#b6e402] transition-colors duration-200 ${
                  isActive(link.href) ? 'font-medium text-[#b6e402]' : ''
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute left-0 -bottom-1 w-full h-1 bg-[#b6e402] rounded transition-all duration-200"></span>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex justify-end items-center space-x-4">
            <button 
              className="p-2 border border-white rounded-full hover:bg-white/10 transition-colors duration-200"
              onClick={handleLike}
              title="View liked models"
            >
              <FaHeart />
            </button>

            <div className="flex items-center">
              <ThemeToggleButton />
            </div>
            
            <div className="relative account-dropdown" ref={accountMenuRef}>
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center bg-lime-400 text-black font-semibold px-4 py-2 rounded-full hover:bg-lime-500 transition-colors duration-200"
                aria-haspopup="true"
                aria-expanded={accountMenuOpen}
              >
                <FaUser className="mr-2" />
                {sessionStatus === "authenticated" && session?.user?.username
                  ? session.user.username
                  : "Account"} 
                <span className="ml-1 transition-transform duration-200">
                  {accountMenuOpen ? '▲' : '▼'}
                </span>
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-xl z-50 ring-1 ring-gray-200 animate-fade-in overflow-hidden">
                  {sessionStatus === "authenticated" ? (
                    <>
                      <div className="px-5 py-3 text-sm text-gray-500 border-b border-gray-100 bg-gray-50">
                        Welcome, {session?.user?.username || 'User'}
                      </div>
                      <button
                        onClick={handleLogOut}
                        className="w-full text-left px-5 py-3 text-lg hover:bg-gray-100 hover:text-red-600 transition-colors duration-150"
                      >
                        🚪 Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block px-5 py-3 text-lg hover:bg-gray-100 hover:text-blue-600 transition-colors duration-150"
                      >
                        🔐 Login
                      </Link>
                      <Link
                        href="/register"
                        className="block px-5 py-3 text-lg hover:bg-gray-100 hover:text-green-600 transition-colors duration-150"
                      >
                        📝 Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center justify-between text-white">
          {/* Mobile Logo */}
          <div className="flex items-center" onClick={() => resetSearch("/")}>
            <div className="relative w-[140px] sm:w-[160px] h-[20px] sm:h-[22px] cursor-pointer">
              <Image
                src="/Logo.png"
                alt="Logo"
                fill
                className="object-contain"
                sizes="(max-width: 640px) 140px, 160px"
              />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button 
              className="p-1.5 sm:p-2 border border-white/70 rounded-full hover:bg-white/10 transition-colors duration-200"
              onClick={handleLike}
              title="View liked models"
            >
              <FaHeart size={14} className="sm:w-4 sm:h-4" />
            </button>
            
            <div className="flex items-center">
              <ThemeToggleButton />
            </div>
            
            <button
              onClick={toggleMobileMenu}
              className="p-1.5 sm:p-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <FaTimes size={18} className="sm:w-5 sm:h-5" /> : <FaBars size={18} className="sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          ref={mobileMenuRef}
          className={`lg:hidden absolute top-full left-0 right-0 bg-custom-light-maincolor border-t border-white/20 z-50 transition-all duration-300 ease-in-out ${
            mobileMenuOpen 
              ? 'opacity-100 visible translate-y-0' 
              : 'opacity-0 invisible -translate-y-2'
          }`}
        >
          <div className="mx-auto w-full max-w-[1300px] px-3 sm:px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
            {/* Navigation Links */}
            <div className="space-y-1.5 sm:space-y-2">
              {links.map(link => {
                const Icon = link.icon;
                return (
                  <div
                    key={link.href}
                    onClick={() => resetSearch(link.href)}
                    className={`flex items-center gap-2.5 sm:gap-3 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      isActive(link.href) 
                        ? 'bg-white/20 font-medium text-[#b6e402]' 
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="text-base sm:text-lg">{link.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Account Section */}
            <div className="pt-4 sm:pt-6 border-t border-white/20">
              <div className="bg-white/10 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-lime-400 rounded-full flex items-center justify-center">
                    <FaUser className="text-black text-lg sm:text-xl" />
                  </div>
                  <div>
                    <span className="text-white font-semibold text-base sm:text-lg block">
                      {sessionStatus === "authenticated" && session?.user?.username
                        ? session.user.username
                        : "Guest User"}
                    </span>
                    <span className="text-white/70 text-xs sm:text-sm">
                      {sessionStatus === "authenticated" ? "Signed In" : "Not signed in"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2.5 sm:space-y-3">
                {sessionStatus === "authenticated" ? (
                  <>
                    <button
                      onClick={handleLogOut}
                      className="w-full flex items-center justify-center gap-2.5 sm:gap-3 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span className="text-lg sm:text-xl">🚪</span>
                      <span className="text-base sm:text-lg">Sign Out</span>
                    </button>
                    <div className="text-center">
                      <span className="text-white/60 text-xs sm:text-sm">
                        Welcome back! You&apos;re signed in.
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="w-full flex items-center justify-center gap-2.5 sm:gap-3 bg-lime-400 hover:bg-lime-500 text-black font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span className="text-lg sm:text-xl">🔐</span>
                      <span className="text-base sm:text-lg">Sign In</span>
                    </Link>
                    <Link
                      href="/register"
                      className="w-full flex items-center justify-center gap-2.5 sm:gap-3 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] border border-white/20"
                    >
                      <span className="text-lg sm:text-xl">📝</span>
                      <span className="text-base sm:text-lg">Create Account</span>
                    </Link>
                    <div className="text-center pt-2">
                      <span className="text-white/60 text-xs sm:text-sm">
                        Sign in to save favorites and track downloads
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
