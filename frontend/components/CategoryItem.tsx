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
      <div className="flex flex-col items-center aspect-square w-full justify-center cursor-pointer border-2  transition bg-white py-5 text-black hover:rounded-2xl  hover:border-[#b6e400] hover:shadow-[0_0_16px_0_rgba(0,0,0,0.32)]">
        {children}

        <div className="font-semibold text-xl">{title}</div>
      </div>
    </Link>
  );
};

export default CategoryItem;
