import Link from "next/link";
import React, { ReactNode } from "react";

interface PlatformItemProps {
  children: ReactNode;
  title: string;
  href: string;
}

const PlatformItem = ({ title, children, href }: PlatformItemProps) => {
  return (
    <Link
        href={href}
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-3 cursor-pointer"
    >
        <div className="relative w-full aspect-square">{children}</div>
        <div className="font-semibold text-xl text-center">{title}</div>
    </Link>
  );
};

export default PlatformItem;