import Link from "next/link";
import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSearch } from "@/context/SearchContext";

interface PlatformItemProps {
  children: ReactNode;
  title: string;
}

const PlatformItem = ({ title, children }: PlatformItemProps) => {

  const {setSelectedPlatform, selectedPlatform} = useSearch()
  const router = useRouter();
  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      setSelectedPlatform(title);
      console.log('Search triggered:', {
        platform: title,
      });
  
      const queryParams = new URLSearchParams();
  
      if (title && title !== 'All')
        queryParams.set('sourcesite', title);
  
      router.push(`/explore?${queryParams.toString()}`);
    };

  return (
    <div
        rel="noopener noreferrer"
        onClick={handleSearch} 
        className="flex flex-col items-center gap-3 cursor-pointer"
    >
        <div className="relative w-full aspect-square">{children}</div>
        <div className="font-semibold text-xl text-center">{title}</div>
    </div>
  );
};

export default PlatformItem;