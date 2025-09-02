"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from 'react-icons/fa';
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { QuillEditor } from './QuillEditor'

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  content: string; // HTML content from Quill
  image?: { asset: { _ref?: string; url?: string } };
  status: 'draft' | 'published';
  publishedAt?: string;
  _createdAt: string;
}

// Sanity client
const sanityClient = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_STUDIO_TOKEN!,
});

// Image builder
const builder = imageUrlBuilder(sanityClient);
const urlFor = (source: any) => builder.image(source).url();

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

  const [content, setContent] = useState<string>('');
  const editorRef = useRef<any>(null);
  const editorKey = useMemo(() => `${editingId ?? 'create'}`, [editingId]);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
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
      setBlogPosts(posts || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({ title: '', content: '', status: 'draft', imageFile: null, imagePreview: '' });
    setContent('');
  };

  const handleEdit = (post: BlogPost) => {
    setEditingId(post._id);
    setIsCreating(false);
    setFormData({
      title: post.title,
      content: post.content || '',
      status: post.status,
      imageFile: null,
      imagePreview: post.image?.asset?.url || ''
    });
    setContent(post.content || '');
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({ title: '', content: '', status: 'draft', imageFile: null, imagePreview: '' });
    setContent('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file, imagePreview: URL.createObjectURL(file) }));
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !content.trim()) {
      alert('Please fill in title and content');
      return;
    }

    try {
      let imageAsset = null;
      if (formData.imageFile) {
        imageAsset = await sanityClient.assets.upload('image', formData.imageFile);
      }

      const blogData: any = {
        _type: 'blogPost',
        title: formData.title,
        slug: { _type: 'slug', current: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') },
        content: content,
        status: formData.status,
        publishedAt: formData.status === 'published' ? new Date().toISOString() : null,
      };

      if (imageAsset?._id) {
        blogData.image = { _type: 'image', asset: { _type: 'reference', _ref: imageAsset._id } };
      }

      if (isCreating) {
        await sanityClient.create(blogData);
        alert('Blog post created successfully!');
      } else if (editingId) {
        await sanityClient.patch(editingId).set(blogData).commit();
        alert('Blog post updated successfully!');
      }

      handleCancel();
      fetchBlogPosts();
    } catch (err) {
      console.error(err);
      alert('Failed to save blog post.');
    }
  };

  const handleDelete = async (post: BlogPost) => {
    if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
      try {
        await sanityClient.delete(post._id);
        fetchBlogPosts();
        alert('Blog post deleted!');
      } catch (err) {
        console.error(err);
        alert('Failed to delete blog post.');
      }
    }
  };

  const formatDate = (date?: string) => date ? new Date(date).toLocaleDateString() : '';

  const getImageUrl = (post: BlogPost) => {
    if (post.image?.asset?._ref) return urlFor(post.image);
    if (post.image?.asset?.url) return post.image.asset.url;
    return '';
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Blog Posts</h2>
        <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
          <FaPlus /> Create New Post
        </button>
      </div>

      {(isCreating || editingId) && (
        <div className="mb-6 p-6 bg-gray-50 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">{isCreating ? 'Create New Blog Post' : 'Edit Blog Post'}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

                                <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Content *</label>
              <QuillEditor
                value={content}
                onChange={setContent}
                placeholder="Write your blog content..."
              />
            </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Featured Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {formData.imagePreview && <img src={formData.imagePreview} alt="Preview" className="w-32 h-32 mt-2 rounded-lg object-cover" />}
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2">
              <FaSave /> {isCreating ? 'Create Post' : 'Update Post'}
            </button>
            <button onClick={handleCancel} className="px-4 py-2 bg-gray-600 text-white rounded-lg flex items-center gap-2">
              <FaTimes /> Cancel
            </button>
          </div>
        </div>
      )}

      {blogPosts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Post</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blogPosts.map(post => (
                <tr key={post._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap flex items-center">
                    <img src={getImageUrl(post)} alt={post.title} className="h-12 w-12 rounded-lg object-cover" />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{post.title}</div>
                      <div className="text-xs text-gray-400">ID: {post._id.substring(0,8)}...</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>{post.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(post.publishedAt || post._createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex gap-2 justify-end">
                    <button onClick={() => handleEdit(post)} className="text-blue-600 hover:text-blue-900"><FaEdit /></button>
                    <button onClick={() => handleDelete(post)} className="text-red-600 hover:text-red-900"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-900 mb-2">No blog posts found</h3>
          <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 mx-auto">
            <FaPlus /> Create First Post
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogTable;
