"use client";
import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return (
    <div className={`mx-auto w-full max-w-[1300px] px-4 sm:px-6 md:px-8 ${className || ""}`}>
      {children}
    </div>
  );
};

export default Container;


