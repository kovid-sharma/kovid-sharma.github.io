import Resources from '../pages/Resources';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/resources')({
  component: Resources,
  head: () => ({ meta: [{ title: 'Resources · Kovid Sharma' }] }),
});
