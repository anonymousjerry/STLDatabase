const { createClient } = require('@sanity/client');

// Test Sanity connection
const sanityClient = createClient({
  projectId: 'vngrr2a1',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function testSanityConnection() {
  console.log('🔍 Testing Sanity connection...');
  
  try {
    // Test 1: Basic connection
    console.log('\n1️⃣ Testing basic connection...');
    const result = await sanityClient.fetch(`*[_type == "blogPost"] | order(_createdAt desc) [0...5] {
      _id,
      title,
      status,
      _createdAt
    }`);
    
    console.log('✅ Connection successful!');
    console.log('📊 Found blog posts:', result.length);
    console.log('📋 Blog posts:', JSON.stringify(result, null, 2));
    
    // Test 2: Published posts only
    console.log('\n2️⃣ Testing published posts...');
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
    console.error('❌ Error during test:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
  }
}

testSanityConnection();
