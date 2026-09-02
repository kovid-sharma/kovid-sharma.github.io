import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/work_/$slug')({
  beforeLoad: ({ params }) => {
    throw redirect({
      params: { slug: params.slug },
      replace: true,
      to: '/highlights/$slug',
    });
  },
});
