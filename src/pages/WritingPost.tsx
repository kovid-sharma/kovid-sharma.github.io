import DateViewer from '@components/DateView';
import ExternalLink from '@components/ExternalLink';
import components from '@components/MDXComponents';
import { allWritings } from 'content-collections';
import { lazy, Suspense, useMemo } from 'react';

const editUrl = (slug: string) =>
  `https://github.com/kovid-sharma/kovid-sharma.github.io/edit/main/data/writing/${slug}.mdx`;

// Import all MDX files using Vite's glob import
const mdxModules = import.meta.glob<{ default: React.ComponentType<any> }>(
  '../../data/writing/*.mdx',
);

export default function WritingPost({ slug }: { slug: string }) {
  const post = allWritings.find((post) => post.slug === slug);

  if (!post) {
    return null;
  }

  // Get the MDX component loader for this slug
  const mdxPath = `../../data/writing/${slug}.mdx`;
  const mdxLoader = mdxModules[mdxPath];

  // Create a lazy component from the loader, memoized by slug
  const MDXContent = useMemo(() => {
    if (!mdxLoader) {
      return null;
    }
    return lazy(() => mdxLoader().then((mod) => ({ default: mod.default })));
  }, [slug, mdxLoader]);

  if (!mdxLoader || !MDXContent) {
    return null;
  }

  return (
    <div className="text-secondary mx-auto max-w-2xl">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(post.structuredData),
        }}
        suppressHydrationWarning
        type="application/ld+json"
      ></script>
      <p className="text-tertiary mb-2 -ml-1 w-fit rounded-md bg-gray-200 px-1.5 py-0.5 font-mono text-sm dark:bg-gray-800">
        <DateViewer date={post.publishedAt} />
      </p>
      <h1 className="text-primary text-4xl font-medium sm:text-5xl">
        {post.title}
      </h1>
      {post.image && (
        <div className="relative mt-8 h-[400px]">
          <img
            alt={post.title}
            className="h-full w-full rounded-lg object-cover"
            src={post.image}
          />
        </div>
      )}
      <article className="prose-quoteless prose prose-neutral dark:prose-invert">
        <Suspense fallback={<div>Loading...</div>}>
          <MDXContent components={components} />
        </Suspense>
      </article>
      <div className="mt-8">
        <ExternalLink href={editUrl(post.slug)}>
          Edit source on GitHub
        </ExternalLink>
      </div>
    </div>
  );
}
