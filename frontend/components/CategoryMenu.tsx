// "use client";

// import React, { useEffect, useState } from "react";
// import { getSubCategories } from "@/lib/categoryApi";
// import { useSearch } from "@/context/SearchContext";
// import { useRouter } from "next/navigation";
// import LoadingOverlay from "./LoadingOverlay";

// type GroupedCategory = {
//   group: string;
//   items: string[];
// };

// type Category = {
//   name: string;
//   category: string;
// };

// interface CategoryMenuProps {
//   setCategoryOpen: (open: boolean) => void;
// }

// const CategoryMenu = ({ setCategoryOpen }: CategoryMenuProps) => {
//   const [groupedCategories, setGroupedCategories] = useState<GroupedCategory[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const {
//       selectedPlatform,
//       selectedCategory,
//       searchInput,
//       searchPrice,
//       favourited,
//       userId,
//       setSelectedCategory,
//     } = useSearch();

//   useEffect(() => {
//     setLoading(true); // start loading
//     getSubCategories()
//       .then((data: Category[]) => {
//         const grouped = data.reduce((acc, curr) => {
//           if (!acc[curr.category]) acc[curr.category] = [];
//           acc[curr.category].push(curr.name);
//           return acc;
//         }, {} as Record<string, string[]>);

//         const formatted: GroupedCategory[] = Object.entries(grouped).map(([group, items]) => ({
//           group,
//           items,
//         }));

//         setGroupedCategories(formatted);
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false)); // stop loading
//   }, []);

//   const handleSubcategorySelect = (subcategory: string) => {
//     setSelectedCategory(subcategory);
//     setCategoryOpen(false)

//     const queryParams = new URLSearchParams();
//     queryParams.set("category", subcategory);
//     if (selectedPlatform && selectedPlatform !== "All")
//       queryParams.set("sourcesite", selectedPlatform);
//     if (searchInput) queryParams.set("key", searchInput);
//     if (searchPrice) queryParams.set("price", searchPrice);
//     if (favourited) {
//         queryParams.set("favourited", "true");    
//     }
//     if (userId) {
//         queryParams.set("userId", userId)
//     }

//     router.push(`/explore?${queryParams.toString()}`);
//   };
//   console.log(groupedCategories)
//   return (
//     <div className="absolute left-1/2 top-full mt-2 transform -translate-x-1/2 
//         bg-white dark:bg-gray-900 
//         border dark:border-gray-700 
//         rounded shadow-lg z-50 
//         min-w-[700px] max-h-[300px] overflow-y-auto"
//     >
//         <LoadingOverlay show={loading} size={20}/>
//         <div className="grid grid-cols-3 gap-4 p-6">
//             {groupedCategories.map(({ group, items }) => (
//                 <div key={group}>
//                     <h3 className="font-bold text-lg mb-3 
//                     text-custom-light-maincolor dark:text-white"
//                     >
//                     {group}
//                     </h3>
//                     <ul className="space-y-1 text-lg font-normal 
//                         text-custom-light-maincolor dark:text-custom-dark-textcolor"
//                     >
//                         {items.map((item) => (
//                             <li
//                                 key={item}
//                                 className="hover:text-green-600 dark:hover:text-green-400 
//                                 cursor-pointer transition-colors"
//                                 onClick={() => handleSubcategorySelect(item)}
//                             >
//                                 {item}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             ))}
//         </div>
//     </div>
//   );
// };

// export default CategoryMenu;
