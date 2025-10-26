import { createClient } from 'contentful';

// Ensure environment variables are being read correctly
const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

// Basic validation
if (!spaceId || !accessToken) {
  throw new Error(
    'Contentful Space ID or Access Token is missing. Check your .env.local file.'
  );
}

// Initialize the Contentful client
const client = createClient({
  space: spaceId,
  accessToken: accessToken,
});

// --- Function to fetch a single blog post by its slug ---
export async function fetchBlogPostBySlug(slug) {
  try {
    const entries = await client.getEntries({
      content_type: 'blogPost', // Use the ID of your Contentful content type
      'fields.slug': slug,
      limit: 1, // We only expect one entry for a unique slug
    });
    if (entries.items.length > 0) {
      return entries.items[0]; // Return the first (and should be only) item
    }
    return null; // Return null if no post is found for that slug
  } catch (error) {
    console.error('Error fetching blog post by slug from Contentful:', error);
    return null; // Handle errors gracefully
  }
}

// --- NEW Function to fetch all blog posts ---
export async function fetchBlogPosts() {
    try {
      const entries = await client.getEntries({
        content_type: 'blogPost', // Use the ID of your Contentful content type
        order: ['-fields.publishedDate'], // Optional: Order by date descending
      });
      return entries.items || []; // Return the array of posts, or empty array if none
    } catch (error) {
      console.error('Error fetching blog posts from Contentful:', error);
      return []; // Handle errors gracefully by returning an empty array
    }
  }

