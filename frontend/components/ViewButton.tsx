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
import React, { useState } from "react";

const ViewButton = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const router = useRouter();

  // function for modifying URL for searching products
  // After it we will grab URL on the search page and send GET request for searched products
//   const searchProducts = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     router.push(`/search?search=${searchInput}`);
//     setSearchInput("");
//   };

  return (
    <button
        className=""
    >

    </button>
  );
};

export default ViewButton;
