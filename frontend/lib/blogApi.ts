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
  content: any; // Portable Text array
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
// Render Portable Text (lightweight without extra deps)
export const renderContent = (content: any): string => {
  if (!content || !Array.isArray(content)) return '';

  const esc = (s: string) => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const renderMarks = (text: string, marks: string[] = []) => {
    return marks.reduce((acc, m) => {
      switch (m) {
        case 'strong': return `<strong>${acc}</strong>`;
        case 'em': return `<em>${acc}</em>`;
        case 'underline': return `<u>${acc}</u>`;
        case 'code': return `<code class="px-1 py-0.5 rounded bg-gray-100">${acc}</code>`;
        default: return acc;
      }
    }, esc(text));
  };

  const renderBlock = (block: any) => {
    if (block._type === 'block') {
      const tag =
        block.style === 'h1' ? 'h1' :
        block.style === 'h2' ? 'h2' :
        block.style === 'h3' ? 'h3' :
        block.style === 'blockquote' ? 'blockquote' : 'p';

      const className =
        tag === 'h1' ? 'text-3xl font-bold mb-4' :
        tag === 'h2' ? 'text-2xl font-bold mb-3' :
        tag === 'h3' ? 'text-xl font-semibold mb-2' :
        tag === 'blockquote' ? 'border-l-4 pl-4 italic text-gray-600' : 'mb-4';

      if (!block.children) return '';

      const html = block.children.map((span: any) => {
        if (span._type !== 'span') return '';

        // handle link mark defs
        if (span.marks && span.marks.length) {
          let out = esc(span.text || '');
          for (const m of span.marks) {
            const def = block.markDefs?.find((d: any) => d._key === m && d._type === 'link');
            if (def) {
              out = `<a href="${def.href}" target="${def.blank ? '_blank' : '_self'}" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${out}</a>`;
            } else {
              out = renderMarks(out, [m]);
            }
          }
          return out;
        }
        return esc(span.text || '');
      }).join('');

      return `<${tag} class="${className}">${html}</${tag}>`;
    }

    if (block._type === 'image' && block.asset?._ref) {
      try {
        const src = urlFor(block).width(1200).url();
        return `<img src="${src}" alt="" class="my-6 rounded"/>`;
      } catch (_) {
        return '';
      }
    }

    if (block._type === 'code') {
      const lang = esc(block.language || '');
      const code = esc(block.code || '');
      return `<pre class="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto my-4"><code class="language-${lang}">${code}</code></pre>`;
    }

    return '';
  };

  return content.map(renderBlock).join('\n');
};

// Simple search function that works client-side
export const searchBlogPosts = async (query: string, posts: BlogPost[]): Promise<BlogPost[]> => {
  if (!query.trim()) return posts;
  
  const searchTerm = query.toLowerCase();
  return posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.content.toLowerCase().includes(searchTerm)
  );
}

