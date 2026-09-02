/**
 * Single project, read like a blog post: graphic on top, then a centred
 * column of prose. Nothing in the margins.
 */
import ExternalLink from '@components/ExternalLink';
import { findWork, kindLabels, workMeta } from '@data/work';

export default function WorkProject({ slug }: { slug: string }) {
  const work = findWork(slug);

  if (!work) return null;

  return (
    <article className="mx-auto max-w-2xl px-6">
      <header className="mb-10 text-center">
        <h1 className="text-primary text-4xl font-medium tracking-tight sm:text-5xl">
          {work.title}
        </h1>
        <p className="text-tertiary mt-3 font-mono text-xs">
          {workMeta(work) || kindLabels[work.kind]}
        </p>
      </header>

      <div className="text-secondary space-y-5 text-base leading-relaxed">
        <p className="text-primary text-lg leading-relaxed">{work.summary}</p>
        {work.body?.map((paragraph) => (
          <ProjectParagraph key={paragraph}>{paragraph}</ProjectParagraph>
        ))}
      </div>
    </article>
  );
}

const inlineLinkPattern = /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/g;

function ProjectParagraph({ children }: { children: string }) {
  const content = [];
  let textStart = 0;

  for (const match of children.matchAll(inlineLinkPattern)) {
    if (match.index === undefined) continue;

    const matchStart = match.index;

    if (matchStart > textStart) {
      content.push(children.slice(textStart, matchStart));
    }

    content.push(
      <ExternalLink href={match[2]} key={`${match[2]}-${matchStart}`}>
        {match[1]}
      </ExternalLink>,
    );

    textStart = matchStart + match[0].length;
  }

  content.push(children.slice(textStart));

  return <p>{content}</p>;
}
