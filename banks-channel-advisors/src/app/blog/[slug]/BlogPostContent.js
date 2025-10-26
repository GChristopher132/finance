"use client"; // This is now the Client Component

import { useState, useEffect } from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

// Configure how Rich Text elements are rendered (moved from page.js)
const richTextOptions = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
        if (node.data.target?.fields?.file?.contentType?.startsWith('image/')) {
            const { title, description, file } = node.data.target.fields;
            const { url } = file;
            const { height, width } = file.details.image;
            return (
                <div className="my-6">
                    <Image
                        src={`https:${url}`}
                        alt={description || title || 'Embedded blog image'}
                        width={width}
                        height={height}
                        className="rounded-lg shadow-md mx-auto max-w-full h-auto"
                    />
                </div>
            );
        }
        return null;
    },
    [BLOCKS.PARAGRAPH]: (node, children) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>,
    [BLOCKS.HEADING_1]: (node, children) => <h1 className="text-4xl font-bold mt-8 mb-4 text-[#0A2342]">{children}</h1>,
    [BLOCKS.HEADING_2]: (node, children) => <h2 className="text-3xl font-semibold mt-6 mb-3 text-[#0A2342]">{children}</h2>,
    [BLOCKS.HEADING_3]: (node, children) => <h3 className="text-2xl font-semibold mt-5 mb-2 text-[#0A2342]">{children}</h3>,
    [BLOCKS.UL_LIST]: (node, children) => <ul className="list-disc list-inside mb-4 pl-4 text-gray-700">{children}</ul>,
    [BLOCKS.OL_LIST]: (node, children) => <ol className="list-decimal list-inside mb-4 pl-4 text-gray-700">{children}</ol>,
    [BLOCKS.LIST_ITEM]: (node, children) => <li className="mb-1">{children}</li>,
    [BLOCKS.QUOTE]: (node, children) => <blockquote className="border-l-4 border-[#5097C9] pl-4 italic my-4 text-gray-600">{children}</blockquote>,
    [INLINES.HYPERLINK]: (node, children) => <a href={node.data.uri} target="_blank" rel="noopener noreferrer" className="text-[#007BFF] hover:underline">{children}</a>,
  },
};

export default function BlogPostContent({ post }) {
  const [isClient, setIsClient] = useState(false); // State to ensure iframe renders client-side

  // Effect to set isClient to true after mounting
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Destructure fields from the post prop
  const { title, featuredImage, body, pdfAttachment } = post.fields;
  const pdfUrl = pdfAttachment?.fields?.file?.url;

  return (
    <>
      {/* Featured Image */}
      {featuredImage && featuredImage.fields.file && (body || !pdfUrl) && (
        <div className="relative h-64 md:h-96 w-full max-w-3xl mx-auto mb-8 rounded-lg overflow-hidden shadow-md">
          <Image
            src={`https:${featuredImage.fields.file.url}`}
            alt={featuredImage.fields.description || title || 'Featured blog image'}
            fill
            style={{ objectFit: 'cover' }}
            quality={80}
            priority
          />
        </div>
      )}

      {/* Body Content */}
      {body && (
        <div className="prose prose-lg max-w-3xl mx-auto mt-8">
          {documentToReactComponents(body, richTextOptions)}
        </div>
      )}

      {/* Embedded PDF Viewer (Render only on client-side) */}
      {isClient && pdfUrl && !body && (
        <div className="mt-8 border rounded-lg overflow-hidden shadow-md w-full">
          <iframe
            src={`https:${pdfUrl}#toolbar=0`}
            width="100%"
            className="h-[90vh]"
            title={title || 'PDF Document'}
            style={{ border: 'none' }}
          >
            Your browser does not support PDFs. Please download the PDF to view it:
            <a href={`https:${pdfUrl}`} download>Download PDF</a>.
          </iframe>
        </div>
      )}
      {/* Placeholder for server render / before client mount */}
      {!isClient && pdfUrl && !body && (
           <div className="mt-8 border rounded-lg shadow-md w-full h-[90vh] flex items-center justify-center bg-gray-100">
              <Loader2 className="h-8 w-8 animate-spin text-[#5097C9]" />
              <p className="ml-2 text-gray-600">Loading PDF viewer...</p>
           </div>
      )}
    </>
  );
}
