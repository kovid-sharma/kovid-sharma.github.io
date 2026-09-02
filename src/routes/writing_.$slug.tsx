import WritingPost from '../pages/WritingPost';
import { createFileRoute, notFound } from '@tanstack/react-router';
import { allWritings } from 'content-collections';

export const Route = createFileRoute('/writing_/$slug')({
  beforeLoad: ({ params }) => {
    if (!allWritings.some((post) => post.slug === params.slug)) {
      throw notFound();
    }
  },
  component: WritingPostRoute,
});

function WritingPostRoute() {
  const { slug } = Route.useParams();
  return <WritingPost slug={slug} />;
}
