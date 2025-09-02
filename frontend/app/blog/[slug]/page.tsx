import React from 'react';
import { notFound } from 'next/navigation';
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

    return {
      title: `${blogPost.title} - 3DDatabase Blog`,
      description: blogPost.content.substring(0, 160) + '...',
      keywords: ['3D printing', 'STL files', 'blog', blogPost.title],
      openGraph: {
        title: blogPost.title,
        description: blogPost.content.substring(0, 160) + '...',
        type: 'article',
        url: `https://3ddatabase.com/blog/${slug}`,
        images: blogPost.image ? [getImageUrl(blogPost)] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: blogPost.title,
        description: blogPost.content.substring(0, 160) + '...',
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
          <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Featured Image */}
            <div className="w-full h-64 md:h-96 bg-gray-200 overflow-hidden">
              {getImageUrl(blogPost) ? (
                <Image 
                  src={getImageUrl(blogPost)} 
                  alt={blogPost.title}
                  width={800}
                  height={384}
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
                <ShareButton title={blogPost.title} content={blogPost.content} />
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
              <Link 
                href="/blog"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View All Blog Posts
                <FaArrowLeft className="ml-2 rotate-180" size={14} />
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
