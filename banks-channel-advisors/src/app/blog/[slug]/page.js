// No "use client" directive here - this is a Server Component

// Keep necessary imports
import { fetchBlogPostBySlug } from '@/lib/contentfulClient';
import Image from 'next/image'; // Keep if used for featured image directly here (though moved to client)
import Link from 'next/link';
import { FileDown } from 'lucide-react';
import BlogPostContent from './BlogPostContent'; // Import the new Client Component

// Helper to format date (optional - remains the same)
function formatDate(isoDate) {
    if (!isoDate) return '';
    return new Date(isoDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

// Fetch data for a specific post based on the slug parameter (remains the same)
async function getPostData(slug) {
    const post = await fetchBlogPostBySlug(slug);
    return post;
}

// Generate Metadata for the page (remains the same, works in Server Component)
export async function generateMetadata({ params: paramsPromise }) {
    const params = await paramsPromise;
    const post = await getPostData(params.slug);
    if (!post) {
        return { title: 'Post Not Found' };
    }
    return {
        title: `${post.fields.title || 'Blog Post'} | Banks Channel Advisors`,
        description: post.fields.excerpt || 'Blog post from Banks Channel Advisors',
    };
}


// The Page component is now a Server Component again
// Rename the received prop to paramsPromise
export default async function BlogPostPage({ params: paramsPromise }) {
  // Await the params promise before accessing slug
  const params = await paramsPromise;
  const { slug } = params;
  const post = await getPostData(slug); // Fetch data directly

  // Error/Not Found state (remains similar)
  if (!post) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-16 bg-gray-50 text-[#0A437B]">
        <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
        <p className="text-lg text-gray-700">Sorry, we couldn't find the blog post you were looking for.</p>
        <Link href="/blog" className="mt-6 text-[#007BFF] hover:underline">
          ← Back to Blog
        </Link>
      </main>
    );
  }

  // Destructure only the fields needed for the Server Component part
  const { title, publishedDate, author, pdfAttachment } = post.fields;
  const pdfUrl = pdfAttachment?.fields?.file?.url;

  return (
    <main className="flex min-h-screen flex-col items-center py-12 px-4 md:px-8 bg-white">
      <article className="max-w-5xl w-full">
        {/* Back Link */}
        <Link href="/blog" className="text-[#007BFF] hover:underline mb-6 inline-block">
          ← Back to Blog
        </Link>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#0A2342]">
          {title || 'Untitled Post'}
        </h1>

        {/* Meta Info */}
        <div className="text-sm text-gray-500 mb-6">
          <span>{formatDate(publishedDate)}</span>
          {author && <span className="mx-2">•</span>}
          {author && <span>By {author}</span>}
        </div>

        {/* PDF Download Button (if PDF exists) */}
        {pdfUrl && (
          <div className="my-8 text-center">
            <a
              href={`https:${pdfUrl}`}
              // Removed target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center px-6 py-3 bg-[#5097C9] text-white font-semibold rounded-lg shadow-md hover:bg-[#0A437B] transition duration-300 ease-in-out"
            >
              <FileDown className="mr-2 h-5 w-5" />
              {/* Changed button text below */}
              Download PDF Report
            </a>
          </div>
        )}

        {/* Use the Client Component for rendering content that needs client-side logic */}
        {/* Pass the full post data down as a prop */}
        <BlogPostContent post={post} />

      </article>
    </main>
  );
}

