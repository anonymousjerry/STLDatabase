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

type BreadcrumbProps = {
  category: string;
  subCategory: string;
  title: string
}

const Breadcrumb = (
  {category, subCategory, title}: BreadcrumbProps
) => {

  
  return (
    <div className="text-lg breadcrumbs max-sm:text-base">
      <ul>
        <li>
          <Link href="/">
            STLDatase.com
          </Link>
        </li>
        {category && (
          <li>
            <Link href={`/explore`}>{category.replace(/-/g, " ")}</Link>
          </li>
        )}
        {subCategory && (
          <li>
            <Link href={`/explore`}>{subCategory.replace(/-/g, " ")}</Link>
          </li>
        )}
        {title && <li>{title.replace(/-/g, " ")}</li>}
      </ul>
    </div>
  );
};

export default Breadcrumb;
