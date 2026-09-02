import Playground from '../pages/Playground';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/playground')({
  component: Playground,
  head: () => ({
    meta: [
      { title: 'Playground · Kovid Sharma' },
      {
        content: 'A playful spatial music sequencer by Kovid Sharma.',
        name: 'description',
      },
    ],
  }),
});
