"use client";

import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaUpload, FaLink } from 'react-icons/fa';
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

interface BlogPost {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  content: string;
  image?: {
    asset: {
      url?: string;
      _ref?: string;
    };
  };
  imageUrl?: string; // Added for direct URL fallback
  status: 'draft' | 'published';
  publishedAt?: string;
  _createdAt: string;
}

// Create Sanity client for admin with token for write permissions
const sanityClient = createClient({
  projectId: 'vngrr2a1',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: 'skRhPahQGGeCyHmEM21s5ksiJqlh387AR8aqNekPW5unAjIm8rT5XPfp6ZAIknuwglkKjVU1nAtrtHTDFodlcmfGZuXmcDLFjd26D8oAVbKJEySUxj87r8Y3kHW54W1gzVkz3ut7TuC1yKGcGug7XuBKNQCJR3i17iypHOrHhuOu5qBF3tKW',
});

// Create image URL builder
const builder = imageUrlBuilder(sanityClient);

function urlFor(source: any) {
  return builder.image(source);
}

const BlogTable = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'draft' as 'draft' | 'published',
    imageFile: null as File | null,
    imagePreview: ''
  });

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching blog posts...');
      const posts = await sanityClient.fetch(`
        *[_type == "blogPost"] | order(publishedAt desc) {
          _id,
          title,
          slug,
          content,
          image,
          status,
          publishedAt,
          _createdAt
        }
      `);
      
      console.log('Fetched posts:', posts);
      setBlogPosts(posts || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setError('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({
      title: '',
      content: '',
      status: 'draft',
      imageFile: null,
      imagePreview: ''
    });
  };

  const handleEdit = (post: BlogPost) => {
    setEditingId(post._id);
    setIsCreating(false);
    setFormData({
      title: post.title,
      content: post.content,
      status: post.status,
      imageFile: null,
      imagePreview: post.image?.asset?.url || ''
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({
      title: '',
      content: '',
      status: 'draft',
      imageFile: null,
      imagePreview: ''
    });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in title and content');
      return;
    }

    try {
      console.log('Saving blog post...');
      
      let imageAsset = null;
      
      // Upload image if selected
      if (formData.imageFile) {
        console.log('Uploading image...');
        imageAsset = await sanityClient.assets.upload('image', formData.imageFile);
        console.log('Image uploaded:', imageAsset);
      }

      const blogData: any = {
        _type: 'blogPost',
        title: formData.title,
        slug: {
          _type: 'slug',
          current: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        },
        content: formData.content,
        status: formData.status,
        publishedAt: formData.status === 'published' ? new Date().toISOString() : null,
      };

      // Only add image if we have an uploaded asset
      if (imageAsset && imageAsset._id) {
        blogData.image = { 
          _type: 'image', 
          asset: { 
            _type: 'reference', 
            _ref: imageAsset._id 
          } 
        };
      }

      console.log('Blog data to save:', blogData);

      if (isCreating) {
        const result = await sanityClient.create(blogData);
        console.log('Created post:', result);
        alert('Blog post created successfully!');
      } else if (editingId) {
        const result = await sanityClient.patch(editingId).set(blogData).commit();
        console.log('Updated post:', result);
        alert('Blog post updated successfully!');
      }

      handleCancel();
      fetchBlogPosts();
    } catch (error) {
      console.error('Error saving blog post:', error);
      alert('Failed to save blog post. Please try again.');
    }
  };

  const handleDelete = async (post: BlogPost) => {
    if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
      try {
        await sanityClient.delete(post._id);
        alert('Blog post deleted successfully!');
        fetchBlogPosts();
      } catch (error) {
        console.error('Error deleting blog post:', error);
        alert('Failed to delete blog post. Please try again.');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getImageUrl = (post: BlogPost) => {
    // First check for direct image URL
    if (post.imageUrl) {
      return post.imageUrl;
    }
    // Then check for uploaded image using Sanity image URL builder
    if (post.image?.asset?._ref) {
      try {
        return urlFor(post.image).url();
      } catch (error) {
        // Silently handle error
      }
    }
    // Also check for direct URL (fallback)
    if (post.image?.asset?.url) {
      return post.image.asset.url;
    }
    // No image available
    return '';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Blog Posts</h2>
        <button 
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <FaPlus size={16} />
          Create New Post
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}


      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <div className="mb-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            {isCreating ? 'Create New Blog Post' : 'Edit Blog Post'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter blog post title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter blog post content"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.imagePreview && (
              <div className="mt-2">
                <img src={formData.imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <FaSave size={16} />
              {isCreating ? 'Create Post' : 'Update Post'}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <FaTimes size={16} />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Blog Posts Table */}
      {blogPosts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Post
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blogPosts.map((post) => (
                <tr key={post._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img 
                          className="h-12 w-12 rounded-lg object-cover" 
                          src={getImageUrl(post)} 
                          alt={post.title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {post.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {post.content.length > 60 ? post.content.substring(0, 60) + '...' : post.content}
                        </div>
                        <div className="text-xs text-gray-400">
                          ID: {post._id.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      post.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <FaEdit className="mr-2" size={12} />
                      <span>{formatDate(post.publishedAt || post._createdAt)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Edit"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(post)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FaEdit size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No blog posts found</h3>
          <p className="text-gray-600 mb-4">
            Create your first blog post to get started.
          </p>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <FaPlus size={16} />
            Create First Post
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogTable;
