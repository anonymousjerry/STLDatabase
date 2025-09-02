import { createClient } from '@sanity/client'

// Get environment variables with fallbacks
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'dktl6wwa'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const token = process.env.SANITY_STUDIO_TOKEN

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false, // Set to false for admin operations
  token, // Add your token for write operations
})

// Blog post queries
export const blogQueries = {
  // Get all blog posts
  getAllPosts: `*[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    author->{username, email},
    tags,
    category,
    readTime,
    publishedAt,
    status,
    _createdAt,
    _updatedAt
  }`,

  // Get published blog posts
  getPublishedPosts: `*[_type == "blogPost" && status == "published"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    author->{username, email},
    tags,
    category,
    readTime,
    publishedAt,
    _createdAt
  }`,

  // Get single blog post by slug
  getPostBySlug: (slug: string) => `*[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    content,
    author->{username, email},
    tags,
    category,
    readTime,
    publishedAt,
    status,
    seo,
    _createdAt,
    _updatedAt
  }`,

  // Get single blog post by ID
  getPostById: (id: string) => `*[_type == "blogPost" && _id == $id][0] {
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    content,
    author->{username, email},
    tags,
    category,
    readTime,
    publishedAt,
    status,
    seo,
    _createdAt,
    _updatedAt
  }`,

  // Search blog posts
  searchPosts: (query: string) => `*[_type == "blogPost" && (
    title match $query + "*" ||
    excerpt match $query + "*" ||
    tags[] match $query + "*"
  )] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    author->{username},
    tags,
    category,
    readTime,
    publishedAt,
    status
  }`,

  // Get posts by category
  getPostsByCategory: (category: string) => `*[_type == "blogPost" && category == $category && status == "published"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    author->{username},
    tags,
    category,
    readTime,
    publishedAt
  }`,

  // Get posts by tag
  getPostsByTag: (tag: string) => `*[_type == "blogPost" && $tag in tags && status == "published"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    author->{username},
    tags,
    category,
    readTime,
    publishedAt
  }`,
}

// Blog post mutations
export const blogMutations = {
  // Create new blog post
  createPost: (post: any) => sanityClient.create({
    _type: 'blogPost',
    ...post,
  }),

  // Update blog post
  updatePost: (id: string, updates: any) => sanityClient.patch(id).set(updates).commit(),

  // Delete blog post
  deletePost: (id: string) => sanityClient.delete(id),

  // Publish blog post
  publishPost: (id: string) => sanityClient.patch(id).set({
    status: 'published',
    publishedAt: new Date().toISOString(),
  }).commit(),

  // Unpublish blog post
  unpublishPost: (id: string) => sanityClient.patch(id).set({
    status: 'draft',
    publishedAt: null,
  }).commit(),
}
