"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Container from '@/components/Container';
// import HeaderMain from '@/components/HeaderMain';
import { FaCalendar, FaUser, FaArrowRight, FaSearch } from 'react-icons/fa';
import { getBlogPosts, searchBlogPosts, getImageUrl, renderContent, BlogPost } from '@/lib/blogApi';

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Fetch real data from Sanity
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const posts = await getBlogPosts();
        
        setBlogPosts(posts);
        setFilteredPosts(posts);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Filter posts based on search term
  useEffect(() => {
    const filterPosts = async () => {
      if (searchTerm.trim()) {
        const filtered = await searchBlogPosts(searchTerm, blogPosts);
        setFilteredPosts(filtered);
      } else {
        setFilteredPosts(blogPosts);
      }
    };

    filterPosts();
  }, [blogPosts, searchTerm]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getExcerpt = (content: string) => {
    // Remove HTML tags for excerpt
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-custom-light-secondcolor dark:bg-custom-dark-secondcolor">
        {/* <HeaderMain /> */}
        <Container>
          <div className="py-12">
            <div className="animate-pulse space-y-8">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-custom-light-secondcolor dark:bg-custom-dark-secondcolor">
        {/* <HeaderMain /> */}
        <Container>
          <div className="py-12 text-center">
            <div className="text-red-500 mb-4">
              <FaSearch size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Error Loading Blog Posts</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-custom-light-secondcolor dark:bg-custom-dark-secondcolor">
      {/* <HeaderMain /> */}

      {/* Hero Section - aligned with Categories */}
      <div className="w-full bg-gradient-to-br from-[#4e4d8b] to-[#6b6aac] dark:from-[#2e2d5c] dark:to-[#49487a] text-white py-16">
        <div className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 md:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Explore 3D Printing Insights | 3DDatabase Blog
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Discover tips, tutorials, and insights from the world of 3D printing.
          </p>
        </div>
      </div>

      {/* Search Section - same format as Categories */}
      <div className="w-full bg-white dark:bg-gray-900 py-8">
        <div className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 md:px-8">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-custom-light-maincolor dark:focus:border-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
            />
          </div>
        </div>
      </div>

      <Container>
        <div className="py-12">
          {/* Results Count */}
          <div className="mb-8">
            <p className="text-gray-600 dark:text-gray-400">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Blog Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post._id}
                  className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  {/* Image */}
                  <div className="relative">
                    <Link href={`/blog/${post.slug.current}`}>
                      {getImageUrl(post) ? (
                        <Image
                          src={getImageUrl(post)}
                          alt={post.title}
                          width={400}
                          height={192}
                          className="w-full h-48 object-cover cursor-pointer"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-pointer">
                          <span className="text-gray-400 dark:text-gray-500">No Image</span>
                        </div>
                      )}
                    </Link>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <FaCalendar className="mr-2" size={12} />
                      <span>{formatDate(post.publishedAt || post._createdAt)}</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      <Link
                        href={`/blog/${post.slug.current}`}
                        className="hover:underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {getExcerpt(post.content)}
                    </p>

                    {/* Read More */}
                    <Link
                      href={`/blog/${post.slug.current}`}
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                    >
                      Read More
                      <FaArrowRight className="ml-2" size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <FaSearch size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No articles found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {blogPosts.length === 0 
                  ? "No blog posts have been published yet. Check back soon!"
                  : "Try adjusting your search terms or browse all articles."
                }
              </p>
              {blogPosts.length === 0 && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg max-w-md mx-auto">
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    <strong>Note:</strong> Blog posts need to be created in the admin panel and published to appear here.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default BlogPage;
