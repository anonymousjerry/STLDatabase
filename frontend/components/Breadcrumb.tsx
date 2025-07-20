// *********************
// Role of the component: Component that displays current page location in the application 
// Name of the component: Breadcrumb.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Breadcrumb />
// Input parameters: No input parameters
// Output: Page location in the application
// *********************

import Link from "next/link";
import React from "react";

const Breadcrumb = () => {
  return (
    <div className="text-lg breadcrumbs max-sm:text-base">
      <ul>
        <li>
          <Link href="/">
            STLDatase.com
          </Link>
        </li>
        <li>
          <Link href="/Explore">Explore</Link>
        </li>
        <li>
          <Link href="/Explore">All products</Link>
        </li>
      </ul>
    </div>
  );
};

export default Breadcrumb;
