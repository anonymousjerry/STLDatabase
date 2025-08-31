// "use client";

// import React, { useState } from 'react';
// import { FaUpload, FaSave, FaTimes, FaExternalLinkAlt } from 'react-icons/fa';

// const BlogEditor = () => {
//   const [message, setMessage] = useState('');

//   const openSanityStudio = () => {
//     // Open Sanity Studio in a new tab
//     window.open('/structure/blogPost', '_blank');
//   };

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-sm">
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold text-gray-900">Create Blog Post</h2>
//         <p className="text-gray-600 mt-2">Use Sanity Studio to create and manage blog posts.</p>
//       </div>

//       {message && (
//         <div className={`p-4 rounded-md mb-6 ${
//           message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
//         }`}>
//           {message}
//         </div>
//       )}

//       <div className="space-y-6">
//         {/* Instructions */}
//         <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
//           <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Create Blog Posts</h3>
//           <div className="space-y-3 text-blue-800">
//             <p>1. Click the "Open Sanity Studio" button below</p>
//             <p>2. Click "Create new" to create a new blog post</p>
//             <p>3. Fill in the title, content, and upload an image</p>
//             <p>4. Set status to "published" and click "Publish"</p>
//             <p>5. Your post will appear on the frontend automatically</p>
//           </div>
//         </div>

//         {/* Blog Post Fields Info */}
//         <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
//           <h3 className="text-lg font-semibold text-gray-900 mb-3">Blog Post Fields</h3>
//           <div className="space-y-2 text-gray-700">
//             <div><strong>Title:</strong> The main title of your blog post</div>
//             <div><strong>Content:</strong> The main content of your blog post (supports rich text)</div>
//             <div><strong>Image:</strong> Featured image for your blog post</div>
//             <div><strong>Status:</strong> Set to "published" to make it visible on frontend</div>
//             <div><strong>Published At:</strong> Automatically set when you publish</div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end pt-6 border-t">
//           <button
//             onClick={openSanityStudio}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
//           >
//             <FaExternalLinkAlt size={16} />
//             Open Sanity Studio
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogEditor;
