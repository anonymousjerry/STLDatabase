const { createClient } = require('@sanity/client');
require('dotenv').config();

// Test Sanity connection with token
const sanityClient = createClient({
  projectId: 'vngrr2a1',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_STUDIO_TOKEN || process.env.NEXT_PUBLIC_SANITY_STUDIO_TOKEN,
});

async function testToken() {
  console.log('🔍 Testing Sanity token...');
  console.log('Token available:', !!process.env.SANITY_STUDIO_TOKEN);
  console.log('Next Public Token available:', !!process.env.NEXT_PUBLIC_SANITY_STUDIO_TOKEN);
  
  try {
    // Test 1: Try to create a test document
    console.log('\n1️⃣ Testing create permission...');
    const testDoc = await sanityClient.create({
      _type: 'blogPost',
      title: 'Test Post - ' + new Date().toISOString(),
      slug: {
        _type: 'slug',
        current: 'test-post-' + Date.now()
      },
      content: 'This is a test post to verify token permissions.',
      status: 'draft'
    });
    
    console.log('✅ Create permission works!');
    console.log('📋 Created document:', testDoc._id);
    
    // Test 2: Delete the test document
    console.log('\n2️⃣ Testing delete permission...');
    await sanityClient.delete(testDoc._id);
    console.log('✅ Delete permission works!');
    
    console.log('\n🎉 All permissions working correctly!');
    
  } catch (error) {
    console.error('❌ Error during token test:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
  }
}

testToken();
