import React from 'react';
import { notFound } from 'next/navigation';
import './quill-content.css';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Container from '@/components/Container';
import HeaderMain from '@/components/HeaderMain';
import Footer from '@/components/Footer';
import { FaCalendar, FaArrowLeft } from 'react-icons/fa';
import ShareButton from '@/components/ShareButton';
import { getBlogPostBySlug, getImageUrl, renderContent, BlogPost } from '@/lib/blogApi';


interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for the page
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const blogPost = await getBlogPostBySlug(slug);
    
    if (!blogPost) {
      return {
        title: 'Blog Post Not Found - 3DDatabase',
        description: 'The requested blog post could not be found.',
      };
    }

    // Extract text content from HTML for description
    const description = blogPost.content 
      ? blogPost.content.replace(/<[^>]*>/g, '').substring(0, 160)
      : '';

    return {
      title: `${blogPost.title} - 3DDatabase Blog`,
      description: description.substring(0, 160) + '...',
      keywords: ['3D printing', 'STL files', 'blog', blogPost.title],
      openGraph: {
        title: blogPost.title,
        description: description.substring(0, 160) + '...',
        type: 'article',
        url: `https://3ddatabase.com/blog/${slug}`,
        images: blogPost.image ? [getImageUrl(blogPost)] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: blogPost.title,
        description: description.substring(0, 160) + '...',
        images: blogPost.image ? [getImageUrl(blogPost)] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Blog Post - 3DDatabase',
      description: 'Blog post from 3DDatabase',
    };
  }
}

const BlogPostPage = async ({ params }: BlogPostPageProps) => {
  const { slug } = await params;
  
  let blogPost: BlogPost | null = null;
  let error: string | null = null;

  try {
    console.log('Fetching blog post with slug:', slug);
    blogPost = await getBlogPostBySlug(slug);
    console.log('Blog post fetched:', blogPost);
    console.log('Blog post content:', blogPost?.content);
    console.log('Blog post content type:', typeof blogPost?.content);
    
    if (!blogPost) {
      notFound();
    }
  } catch (err) {
    console.error('Error fetching blog post:', err);
    error = 'Failed to load blog post. Please try again later.';
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderMain />
        <Container>
          <div className="py-12">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Blog Post</h1>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  if (!blogPost) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderMain />
      
      <Container>
        <div className="py-12">
          {/* Back Button */}
          <div className="mb-8">
            <Link 
              href="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <FaArrowLeft className="mr-2" size={14} />
              Back to Blog
            </Link>
          </div>

          {/* Blog Post Content */}
          <article className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            {/* Featured Image */}
            <div className="w-full h-80 md:h-96 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
              {getImageUrl(blogPost) ? (
                <Image 
                  src={getImageUrl(blogPost)} 
                  alt={blogPost.title}
                  width={1200}
                  height={500}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-gray-500 text-2xl">📝</span>
                    </div>
                    <span className="text-gray-500 text-lg">No Featured Image</span>
                  </div>
                </div>
              )}
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            <div className="p-8 md:p-12">
              {/* Meta Information */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 mb-8">
                <div className="flex items-center mb-4 sm:mb-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <FaCalendar className="text-blue-600" size={12} />
                  </div>
                  <span className="font-medium">{formatDate(blogPost.publishedAt || blogPost._createdAt)}</span>
                </div>
                <ShareButton title={blogPost.title} content={blogPost.content} />
              </div>
              
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                {blogPost.title}
              </h1>
              

              
              {/* Content */}
              <div className="prose prose-lg max-w-none">
                {blogPost.content ? (
                  <div 
                    className="quill-content"
                    dangerouslySetInnerHTML={{ 
                      __html: renderContent(blogPost.content) 
                    }}

                  />
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-gray-400 text-2xl">📝</span>
                    </div>
                    <p className="text-gray-500 text-lg">No content available for this blog post.</p>
                    <p className="text-gray-400 text-sm mt-2">Please add content using the Quill editor in the admin panel.</p>
                  </div>
                )}
              </div>
            </div>
          </article>

          {/* Related Posts Section */}
          <div className="mt-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore More Articles</h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Discover more insights, tutorials, and updates from our 3D printing community
              </p>
              <Link 
                href="/blog"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span>View All Blog Posts</span>
                <FaArrowLeft className="ml-3 rotate-180" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </Container>
      
      <Footer />
    </div>
  );
};

export default BlogPostPage;
