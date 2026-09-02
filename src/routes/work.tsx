import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/work')({
  beforeLoad: () => {
    throw redirect({ replace: true, to: '/highlights' });
  },
});
