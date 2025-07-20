// // *********************
// // Role of the component: products section intended to be on the home page
// // Name of the component: ProductsSection.tsx
// // Developer: Aleksandar Kuzmanovic
// // Version: 1.0
// // Component call: <ProductsSection slug={slug} />
// // Input parameters: no input parameters
// // Output: products grid
// // *********************

// import React, { useEffect, useState } from "react";
// import ProductItem from "./ProductItem";
// // import axiosInstance from "@/lib/axios";
// // import { AxiosInstance } from "@/lib/axios-instance";
// import { getModels } from "@/lib/modelsApi";
// import Heading from "./Heading";

// const ProductsSection = async () => {
//   const [models, setModels] = useState([]);

//   useEffect(() => {
//     getModels().then(setModels).catch(console.error)
//   }, [])

//   return (
//     <div className="flex flex-row pt-10 px-32 max-xl:px-20 max-lg:px-10 max-md:px-6 bg-gray-100">
//         <div className="grid grid-cols-4 justify-items-center  gap-x-6  gap-y-8 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
//           {models.map((product: Product) => (
//             <ProductItem key={product.id} product={product} color="white" />
//           ))}
//         </div>
//     </div>
//   );
// };

// export default ProductsSection;
