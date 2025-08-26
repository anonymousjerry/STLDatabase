import Link from "next/link";
import React from "react";

type BreadcrumbProps = {
  category: string;
  subCategory: string;
  title: string;
};

const Breadcrumb = ({ category, subCategory, title }: BreadcrumbProps) => {
  return (
    <div className="text-lg font-normal max-sm:text-base text-custom-light-textcolor dark:text-custom-dark-textcolor overflow-hidden p-4 border-b border-gray-200 dark:border-gray-700">
      <ul className="flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis">
        <li className="flex items-center gap-2">
          <Link
            href="/"
            className="hover:underline hover:text-blue-600 dark:hover:text-blue-400"
          >
            STLDatase.com
          </Link>
          {(category || subCategory || title) && (
            <span className="text-gray-400">›</span>
          )}
        </li>

        {category && (
          <li className="flex items-center gap-2">
            <Link
              href={`/explore`}
              className="hover:underline hover:text-blue-600 dark:hover:text-blue-400"
            >
              {category.replace(/-/g, " ")}
            </Link>
            {(subCategory || title) && <span className="text-gray-400">›</span>}
          </li>
        )}

        {subCategory && (
          <li className="flex items-center gap-2">
            <Link
              href={`/explore`}
              className="hover:underline hover:text-blue-600 dark:hover:text-blue-400"
            >
              {subCategory.replace(/-/g, " ")}
            </Link>
            {title && <span className="text-gray-400">›</span>}
          </li>
        )}

        {title && (
          <li
            className="truncate overflow-hidden text-ellipsis"
            title={title.replace(/-/g, " ")}
          >
            {title.replace(/-/g, " ")}
          </li>
        )}
      </ul>
    </div>
  );
};

export default Breadcrumb;
