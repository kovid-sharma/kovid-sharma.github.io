import WorkProject from '../pages/WorkProject';
import { findWork } from '@data/work';
import { createFileRoute, notFound } from '@tanstack/react-router';

export const Route = createFileRoute('/highlights_/$slug')({
  beforeLoad: ({ params }) => {
    if (!findWork(params.slug)) throw notFound();
  },
  component: HighlightProjectRoute,
});

function HighlightProjectRoute() {
  const { slug } = Route.useParams();
  return <WorkProject slug={slug} />;
}
