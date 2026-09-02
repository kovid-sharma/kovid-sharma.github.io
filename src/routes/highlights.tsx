import Highlights from '../pages/Highlights';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/highlights')({
  component: Highlights,
  head: () => ({ meta: [{ title: 'Highlights · Kovid Sharma' }] }),
});
