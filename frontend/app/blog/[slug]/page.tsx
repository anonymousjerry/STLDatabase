"use client";

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Container from '@/components/Container';
import HeaderMain from '@/components/HeaderMain';
import Footer from '@/components/Footer';
import { FaCalendar, FaArrowLeft, FaShare } from 'react-icons/fa';
import { getBlogPostBySlug, getImageUrl, renderContent, BlogPost } from '@/lib/blogApi';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

const BlogPostPage = ({ params }: BlogPostPageProps) => {
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching blog post with slug:', params.slug);
        
        const post = await getBlogPostBySlug(params.slug);
        console.log('Blog post fetched:', post);
        
        if (!post) {
          setError('Blog post not found');
          return;
        }
        
        setBlogPost(post);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setError('Failed to load blog post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [params.slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: blogPost?.title,
        text: blogPost?.content.substring(0, 100) + '...',
        url: window.location.href,
      });
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderMain />
        <Container>
          <div className="py-12">
            <div className="animate-pulse space-y-8">
              <div className="h-12 bg-gray-200 rounded w-1/3"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  if (error || !blogPost) {
    if (error === 'Blog post not found') {
      notFound();
    }
    
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderMain />
        <Container>
          <div className="py-12 text-center">
            <div className="text-red-500 mb-4">
              <FaCalendar size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Error Loading Blog Post</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderMain />
      
      <Container>
        <div className="py-12">
          {/* Back Button */}
          <div className="mb-8">
            <a 
              href="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <FaArrowLeft className="mr-2" size={14} />
              Back to Blog
            </a>
          </div>

          {/* Blog Post Content */}
          <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Featured Image */}
            <div className="w-full h-64 md:h-96 bg-gray-200 overflow-hidden">
              {getImageUrl(blogPost) ? (
                <img 
                  src={getImageUrl(blogPost)} 
                  alt={blogPost.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-lg">No Image</span>
                </div>
              )}
            </div>
            
            <div className="p-8">
              {/* Meta Information */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                <div className="flex items-center">
                  <FaCalendar className="mr-2" size={12} />
                  <span>{formatDate(blogPost.publishedAt || blogPost._createdAt)}</span>
                </div>
                <button
                  onClick={sharePost}
                  className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FaShare className="mr-2" size={12} />
                  Share
                </button>
              </div>
              
              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {blogPost.title}
              </h1>
              
              {/* Content */}
              <div className="prose prose-lg max-w-none text-gray-700">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: renderContent(blogPost.content) 
                  }}
                  className="space-y-4"
                />
              </div>
            </div>
          </article>

          {/* Related Posts Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">More Articles</h2>
            <div className="text-center py-8">
              <a 
                href="/blog"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View All Blog Posts
                <FaArrowLeft className="ml-2 rotate-180" size={14} />
              </a>
            </div>
          </div>
        </div>
      </Container>
      
      <Footer />
    </div>
  );
};

export default BlogPostPage;
