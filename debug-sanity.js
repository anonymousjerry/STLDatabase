const { createClient } = require('@sanity/client');

// Create Sanity client
const sanityClient = createClient({
  projectId: 'vngrr2a1',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // Don't use CDN for debugging
});

async function debugSanity() {
  console.log('🔍 Starting Sanity debug...');
  
  try {
    // Test 1: Check if we can connect to Sanity
    console.log('\n1️⃣ Testing basic connection...');
    const testQuery = `*[_type == "blogPost"] | order(_createdAt desc) [0...5] {
      _id,
      _type,
      title,
      status,
      _createdAt
    }`;
    
    const result = await sanityClient.fetch(testQuery);
    console.log('✅ Connection successful!');
    console.log('📊 Found blog posts:', result.length);
    console.log('📋 Blog posts:', JSON.stringify(result, null, 2));
    
    // Test 2: Check all document types
    console.log('\n2️⃣ Checking all document types...');
    const allTypes = await sanityClient.fetch(`*[_type in ["blogPost", "user", "code"]] | order(_type) {
      _id,
      _type,
      title
    }`);
    console.log('📋 All documents:', JSON.stringify(allTypes, null, 2));
    
    // Test 3: Check if there are any blog posts at all
    console.log('\n3️⃣ Checking for any blog posts...');
    const allBlogPosts = await sanityClient.fetch(`*[_type == "blogPost"] {
      _id,
      title,
      status,
      publishedAt,
      _createdAt
    }`);
    console.log('📊 Total blog posts found:', allBlogPosts.length);
    console.log('📋 Blog posts details:', JSON.stringify(allBlogPosts, null, 2));
    
    // Test 4: Check published blog posts specifically
    console.log('\n4️⃣ Checking published blog posts...');
    const publishedPosts = await sanityClient.fetch(`*[_type == "blogPost" && status == "published"] {
      _id,
      title,
      status,
      publishedAt,
      _createdAt
    }`);
    console.log('📊 Published blog posts found:', publishedPosts.length);
    console.log('📋 Published posts:', JSON.stringify(publishedPosts, null, 2));
    
  } catch (error) {
    console.error('❌ Error during debug:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
  }
}

debugSanity();
