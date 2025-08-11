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
    <div className="text-lg breadcrumbs font-normal max-sm:text-base text-custom-light-textcolor dark:text-custom-dark-textcolor">
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
