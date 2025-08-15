import React, { useEffect, useState } from "react";
import { getAllCategories } from "../lib/categoryApi";

interface Subcategory {
  name: string;
  category: string;
}

export function CategoryTable() {
  const [categories, setCategories] = useState<Record<string, string[]>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [showAll, setShowAll] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchData() {
      try {
        const res: Subcategory[] = await getAllCategories();
        const grouped = res.reduce<Record<string, string[]>>((acc, item) => {
          if (!acc[item.category]) acc[item.category] = [];
          acc[item.category].push(item.name);
          return acc;
        }, {});
        setCategories(grouped);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }
    fetchData();
  }, []);

  const toggleExpand = (category: string) => {
    setExpanded((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleShowAll = (category: string) => {
    setShowAll((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Category
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {Object.entries(categories).map(([category, subs]) => (
            <React.Fragment key={category}>
              {/* Category Row */}
              <tr
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleExpand(category)}
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {category}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 space-x-3">
                  <button className="text-indigo-600 hover:text-indigo-800">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    Delete
                  </button>
                  <button className="text-green-600 hover:text-green-800">
                    Add
                  </button>
                </td>
              </tr>

              {/* Subcategory Row (Expanded) */}
              {expanded[category] && (
                <tr className="bg-gray-50">
                  <td colSpan={2} className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {(showAll[category] ? subs : subs.slice(0, 5)).map(
                        (sub) => (
                          <span
                            key={sub}
                            className="inline-block bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs font-medium"
                          >
                            {sub}
                          </span>
                        )
                      )}
                      {subs.length > 5 && (
                        <button
                          className="text-sm text-blue-600 hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleShowAll(category);
                          }}
                        >
                          {showAll[category] ? "See less" : "See all"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
