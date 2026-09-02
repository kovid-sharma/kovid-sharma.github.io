import Consulting from '../pages/Consulting';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/consulting')({
  component: Consulting,
  head: () => ({ meta: [{ title: 'Consulting · Kovid Sharma' }] }),
});
