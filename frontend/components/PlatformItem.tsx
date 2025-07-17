import Link from "next/link";
import React, { ReactNode } from "react";

interface PlatformItemProps {
  children: ReactNode;
  title: string;
  href: string;
}

const PlatformItem = ({ title, children, href }: PlatformItemProps) => {
  return (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-3 cursor-pointer"
    >
        <div className="relative w-full aspect-square">{children}</div>
        <div className="font-semibold text-xl text-center">{title}</div>
    </a>
  );
};

export default PlatformItem;