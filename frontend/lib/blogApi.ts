import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Create Sanity client for frontend with token for read access
const sanityClient = createClient({
  projectId: 'vngrr2a1',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // Same as admin configuration
  token: 'skRhPahQGGeCyHmEM21s5ksiJqlh387AR8aqNekPW5unAjIm8rT5XPfp6ZAIknuwglkKjVU1nAtrtHTDFodlcmfGZuXmcDLFjd26D8oAVbKJEySUxj87r8Y3kHW54W1gzVkz3ut7TuC1yKGcGug7XuBKNQCJR3i17iypHOrHhuOu5qBF3tKW', // Token required for read access
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
  content: string;
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
    console.log('🔍 Frontend: Fetching blog posts from Sanity...');
    
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
    
    console.log('🔍 Frontend: Blog posts fetched successfully:', posts);
    console.log('🔍 Frontend: Number of posts found:', posts?.length || 0);
    
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

// Helper function to render rich content
export const renderContent = (content: string) => {
  if (!content) return '';
  
  // Convert markdown and HTML to rendered content
  let rendered = content;
  
  // Convert markdown bold
  rendered = rendered.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert markdown italic
  rendered = rendered.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Convert markdown headings
  rendered = rendered.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>');
  rendered = rendered.replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mb-3">$1</h2>');
  
  // Convert markdown links
  rendered = rendered.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Convert line breaks to paragraphs
  rendered = rendered.replace(/\n\n/g, '</p><p class="mb-4">');
  rendered = rendered.replace(/\n/g, '<br>');
  
  // Wrap in paragraph tags
  if (!rendered.startsWith('<')) {
    rendered = `<p class="mb-4">${rendered}</p>`;
  }
  
  return rendered;
}

// Simple search function that works client-side
export const searchBlogPosts = async (query: string, posts: BlogPost[]): Promise<BlogPost[]> => {
  if (!query.trim()) return posts;
  
  const searchTerm = query.toLowerCase();
  return posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.content.toLowerCase().includes(searchTerm)
  );
}

