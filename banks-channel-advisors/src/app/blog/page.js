import Link from 'next/link';
import Image from 'next/image'; // Make sure Image is imported
import { fetchBlogPosts } from '@/lib/contentfulClient'; // Assuming this fetches all posts

// Helper to format date (optional)
function formatDate(isoDate) {
    if (!isoDate) return '';
    return new Date(isoDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

// Fetch data on the server for the blog list page
async function getPosts() {
    const posts = await fetchBlogPosts();
    // Sort posts by publishedDate descending (newest first)
    posts.sort((a, b) => new Date(b.fields.publishedDate) - new Date(a.fields.publishedDate));
    return posts;
}

// Generate Metadata for the blog page
export const metadata = {
    title: 'Blog | Banks Channel Advisors',
    description: 'Latest insights, market commentary, and financial planning tips from Banks Channel Advisors.',
};

// The Blog Page component (Server Component)
export default async function BlogPage() {
  const posts = await getPosts();

  if (!posts || posts.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center p-16 md:p-24 bg-gray-50 text-[#0A437B]">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog</h1>
        <p className="mt-4 text-lg md:text-xl text-gray-700 max-w-3xl text-center">
          No blog posts found yet. Check back soon!
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center py-16 px-6 sm:px-10 bg-gray-50 text-[#0A437B]">
      <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center text-[#0A2342]">
        Our Insights
      </h1>

      {/* Grid for Blog Post Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full">
        {posts.map((post) => {
          // Destructure fields
          const { title, slug, publishedDate, featuredImage, excerpt } = post.fields; // Add excerpt if you have it in Contentful

          // Determine image URL and Alt text - WITH FALLBACK
          const imageUrl = featuredImage?.fields?.file?.url
            ? `https:${featuredImage.fields.file.url}`
            : '/images/banks-channel-logo.png'; // Fallback to logo

          const imageAlt = featuredImage?.fields?.description || title || 'Blog post image';

          // Determine aspect ratio class based on image source
          // Use object-contain for the logo to prevent squishing
          const imageFitClass = featuredImage?.fields?.file?.url ? 'object-cover' : 'object-contain p-4 bg-white'; // Add padding and white bg for logo

          return (
            <Link href={`/blog/${slug}`} key={post.sys.id} className="block group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Image Container */}
              <div className="relative h-48 w-full bg-gray-100"> {/* Added bg-gray-100 for loading/fallback */}
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill // Use fill and object-fit
                  style={{ objectFit: imageFitClass.includes('object-cover') ? 'cover' : 'contain' }} // Apply object-fit via style
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Example sizes, adjust as needed
                  className={`transition-transform duration-300 group-hover:scale-105 ${imageFitClass}`} // Apply padding/bg class if it's the logo
                />
              </div>

              {/* Text Content */}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-[#0A2342] group-hover:text-[#007BFF] transition-colors duration-200 line-clamp-2">
                  {title || 'Untitled Post'}
                </h2>
                {/* Optional: Add Excerpt */}
                {excerpt && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {excerpt}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  {formatDate(publishedDate)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}

