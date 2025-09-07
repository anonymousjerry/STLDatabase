import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Create Sanity client for frontend with token for read access
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false, // Same as admin configuration
  token: process.env.SANITY_API_TOKEN!
})

// Create image URL builder
const builder = imageUrlBuilder(sanityClient);

function urlFor(source: any) {
  return builder.image(source);
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  content: string; // HTML content from Quill
  image?: {
    asset: {
      url?: string;
      _ref?: string;
    };
  };
  imageUrl?: string; // For direct URL images
  status: 'draft' | 'published';
  publishedAt?: string;
  _createdAt: string;
}

export interface CreateBlogPostRequest {
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  tags?: string[];
}

export interface UpdateBlogPostRequest {
  title?: string;
  content?: string;
  excerpt?: string;
  imageUrl?: string;
  tags?: string[];
  status?: 'draft' | 'published';
}
// Get all published blog posts with better error handling
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    // Use same query as admin
    const posts = await sanityClient.fetch(`
      *[_type == "blogPost" && status == "published"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        content,
        image,
        imageUrl,
        status,
        publishedAt,
        _createdAt
      }
    `)
    
    return posts || []
  } catch (error) {
    console.error('❌ Frontend: Error fetching blog posts:', error)
    
    // Return empty array instead of throwing error
    return []
  }
}

// Get single blog post by ID
export const getBlogPost = async (id: string): Promise<BlogPost | null> => {
  try {
    const post = await sanityClient.fetch(`
      *[_type == "blogPost" && _id == $id && status == "published"][0] {
        _id,
        title,
        slug,
        content,
        image,
        imageUrl,
        status,
        publishedAt,
        _createdAt
      }
    `, { id })
    return post
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

// Get single blog post by slug
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const post = await sanityClient.fetch(`
      *[_type == "blogPost" && slug.current == $slug && status == "published"][0] {
        _id,
        title,
        slug,
        content,
        image,
        imageUrl,
        status,
        publishedAt,
        _createdAt
      }
    `, { slug })
    return post
  } catch (error) {
    console.error('Error fetching blog post by slug:', error)
    return null
  }
}

// Helper function to get image URL using Sanity image URL builder
export const getImageUrl = (post: BlogPost) => {
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
  // No image available - return empty string
  return '';
}

// Helper function to render HTML content from Quill
export const renderContent = (content: string): string => {
  if (!content || typeof content !== 'string') return '';
  
  // Return the HTML content as-is since it's already properly formatted
  // Quill generates clean, safe HTML
  return content;
};

// Simple search function that works client-side
export const searchBlogPosts = async (query: string, posts: BlogPost[]): Promise<BlogPost[]> => {
  if (!query.trim()) return posts;
  
  const searchTerm = query.toLowerCase();
  return posts.filter(post => {
    const titleMatch = post.title.toLowerCase().includes(searchTerm);
    const contentMatch = post.content.toLowerCase().includes(searchTerm);
    return titleMatch || contentMatch;
  });
}

