// *********************
// Role of the component: Category Item that will display category icon, category name and link to the category
// Name of the component: CategoryItem.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <CategoryItem title={title} href={href} ><Image /></CategoryItem>
// Input parameters: CategoryItemProps interface
// Output: Category icon, category name and link to the category
// *********************

import Link from "next/link";
import React, { type ReactNode } from "react";

interface CategoryItemProps {
  children: ReactNode;
  title: string;
  href: string;
}

const CategoryItem = ({ title, children, href }: CategoryItemProps) => {
  return (
    <Link href={href}>
      <div className="flex flex-col gap-2 py-3 px-1 items-center aspect-square w-full h-[140px] sm:h-[160px] cursor-pointer border-[2px] border-[#C8C8C833] transition bg-white text-black hover:rounded-2xl  hover:border-[#b6e400] hover:shadow-[0_0_16px_0_rgba(0,0,0,0.32)]">
        <div className="flex ">
          {children}
        </div>
        <div className="flex items-center justify-center text-center font-medium text-[18px] text-[#505050] text-wrap leading-5 break-words">{title}</div>
      </div>
    </Link>
  );
};

export default CategoryItem;
