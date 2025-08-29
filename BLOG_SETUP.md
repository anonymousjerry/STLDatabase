# Blog Setup Guide

This guide will help you set up the professional blog functionality for your 3D Database website using Sanity CMS.

## 🚀 Features

- **Professional Design**: Modern, responsive blog layout with dark/light mode support
- **SEO Optimized**: Meta tags, Open Graph, Twitter cards, and structured data
- **Rich Content**: Support for images, code blocks, links, and formatted text
- **Search & Filter**: Advanced search, category filtering, and tag-based filtering
- **Social Sharing**: Share buttons for Facebook, Twitter, LinkedIn, and copy link
- **Related Posts**: Automatically suggests related articles
- **Reading Time**: Estimated reading time for each article
- **Author Profiles**: Author information and avatars
- **Ad Integration**: Banner ad positions for monetization

## 📋 Prerequisites

1. **Sanity Studio**: Make sure your Sanity studio is running
2. **Environment Variables**: Configure your Sanity project settings
3. **Dependencies**: Install required packages

## 🔧 Installation Steps

### 1. Install Dependencies

```bash
# In the frontend directory
npm install @sanity/image-url @portabletext/react next-sanity
```

### 2. Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token
```

### 3. Sanity Schema Setup

The blog schema has been added to your Sanity studio. Make sure to:

1. **Restart Sanity Studio** to load the new schema
2. **Create a user** in Sanity Studio (if not exists) for author references
3. **Publish the schema** changes

### 4. Create Your First Blog Post

1. **Open Sanity Studio** (usually at `http://localhost:3333`)
2. **Navigate to "Blog Post"** in the content menu
3. **Click "Create new"**
4. **Fill in the required fields**:
   - **Title**: Your blog post title
   - **Slug**: Auto-generated from title (or customize)
   - **Excerpt**: Brief description (max 200 characters)
   - **Featured Image**: Upload a high-quality image
   - **Author**: Select from existing users
   - **Published At**: Set publication date
   - **Category**: Choose from predefined categories
   - **Tags**: Add relevant tags
   - **Content**: Write your article using the rich text editor
   - **SEO**: Optional meta title, description, and image
   - **Status**: Set to "Published" to make it live
   - **Reading Time**: Optional (auto-calculated if left empty)

### 5. URL Structure

Your blog posts will be accessible at:
- **Blog Listing**: `https://3ddatabase.com/blog`
- **Individual Posts**: `https://3ddatabase.com/blog/your-post-slug`

## 🎨 Blog Categories

The blog supports these categories:
- **3D Printing Tips**: Best practices and techniques
- **Model Reviews**: Reviews of 3D models and designs
- **Tutorials**: Step-by-step guides
- **Industry News**: Latest 3D printing industry updates
- **Design Tips**: Design principles and tips
- **Software Guides**: Software tutorials and guides

## 📝 Content Guidelines

### Writing Tips
1. **Use descriptive titles** that include relevant keywords
2. **Write compelling excerpts** that encourage clicks
3. **Include high-quality images** for visual appeal
4. **Use proper headings** (H1, H2, H3) for structure
5. **Add relevant tags** for better discoverability
6. **Include internal links** to related content

### SEO Best Practices
1. **Meta titles** should be 50-60 characters
2. **Meta descriptions** should be 150-160 characters
3. **Use featured images** for social sharing
4. **Include relevant keywords** naturally in content
5. **Optimize images** with descriptive alt text

## 🔍 Search & Filter Features

### Search
- Search by title, excerpt, and tags
- Real-time results as you type
- Case-insensitive matching

### Filters
- **Category filtering**: Filter by blog category
- **Tag filtering**: Select multiple tags
- **Sort options**: Newest, oldest, alphabetical, reading time
- **Clear filters**: Reset all filters with one click

## 📱 Responsive Design

The blog is fully responsive and works on:
- **Desktop**: Full layout with sidebar
- **Tablet**: Optimized grid layout
- **Mobile**: Single column layout with touch-friendly interactions

## 🎯 Ad Integration

The blog includes ad positions for monetization:
- `blog-header-banner`: Top of blog listing page
- `blog-post-header-banner`: Top of individual blog posts
- `blog-post-mid-content-banner`: Middle of blog post content

## 🚀 Performance Features

- **Image optimization**: Automatic image resizing and optimization
- **Lazy loading**: Images load as needed
- **CDN support**: Uses Sanity's CDN for fast image delivery
- **SEO optimization**: Server-side rendering for better SEO

## 🔧 Customization

### Styling
The blog uses Tailwind CSS classes. You can customize:
- Colors in `tailwind.config.ts`
- Typography in the prose classes
- Layout in the component files

### Content Types
You can extend the blog schema to include:
- Video embeds
- Interactive elements
- Custom blocks
- Additional metadata

## 📊 Analytics & Tracking

Consider adding:
- Google Analytics for page views
- Social media tracking
- Reading time analytics
- Popular posts tracking

## 🛠️ Troubleshooting

### Common Issues

1. **Images not loading**: Check Sanity project ID and dataset
2. **Content not appearing**: Ensure posts are published (status = "published")
3. **Slug conflicts**: Each post needs a unique slug
4. **Author not showing**: Create users in Sanity Studio first

### Debug Steps

1. Check browser console for errors
2. Verify environment variables
3. Test Sanity queries in the Sanity Studio
4. Check network requests in browser dev tools

## 📚 Next Steps

1. **Create sample content** to test the functionality
2. **Set up analytics** to track performance
3. **Configure social sharing** previews
4. **Add email newsletter** integration
5. **Implement comments** system (optional)

## 🎉 You're Ready!

Your professional blog is now set up and ready to use! Start creating content and engaging with your 3D printing community.

For support or questions, refer to:
- [Sanity Documentation](https://www.sanity.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Portable Text Documentation](https://portabletext.org/)

