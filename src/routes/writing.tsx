import Writing from '../pages/Writing';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/writing')({
  component: Writing,
  head: () => ({ meta: [{ title: 'Writing · Kovid Sharma' }] }),
});
