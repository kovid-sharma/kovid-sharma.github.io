/** Where a project came from. Drives the Filter dropdown on /highlights. */
export type WorkKind = 'employment' | 'freelance' | 'personal' | 'research';

export type WorkCardType = {
  /** Project name as you would say it out loud. Also becomes the /highlights/:slug URL. */
  title: string;
  /** One plain-English line, no jargon. Cards use it; the page opens with it. */
  summary: string;
  /** Employment, freelance, personal, or research. Required — it is the filter. */
  kind: WorkKind;
  /** Real org name: employer, client, or lab. Omit for personal projects. */
  company?: string;
  /** What you actually did, e.g. "Full-stack engineer". */
  role?: string;
  /** 'YYYY-MM'. Drives the Sort dropdown. Undated projects sort last. */
  start?: string;
  /** 'YYYY-MM'. Omit while it is still ongoing. */
  end?: string;
  /** Tailwind height class for the grid card, e.g. "h-72". */
  h?: string;
  /** The write-up. One string per paragraph; Markdown-style links are highlighted inline. */
  body?: string[];
};

export const works: WorkCardType[] = [
  {
    title: 'MLdrills',
    summary:
      'A practice platform where you solve machine-learning problems in the browser and see progress over time.',
    kind: 'personal',
    start: '2026-06',
    h: 'h-96',
    body: [
      'People learning machine learning had LeetCode for algorithms and little else for coding drills, math problems, and interview-style questions with real feedback. Course sites leaned on video; scratch notebooks never tracked what you could actually do.',
      'I built MLdrills as a full practice product: coding, math, and conceptual drills, ordered tracks, interview sets, and larger projects. Learners work in the browser, get graded immediately, and keep a record of submissions, streaks, and solved work. The learner app and project IDE use React, TypeScript, and TanStack Start; a FastAPI API handles Supabase auth and data alongside isolated Python grading on Modal.',
      'The hard split was keeping hidden tests and grading off the client while still feeling instant. Submissions go through the API into sandboxed runs; the browser only polls results. That cost extra orchestration and a second deploy surface, but it meant I could ship real graders without leaking solutions.',
      'I later pulled the in-browser editor and Python trace tooling into separate packages so the IDE could stay lean. [Try MLdrills](https://mldrills.com); it is still under active development.',
    ],
  },
  {
    title: 'Pettoo',
    summary:
      'A care platform that connects pet owners with the services they need.',
    kind: 'freelance',
    company: 'Pettoo UG',
    role: 'Software engineer',
    start: '2025-06',
    end: '2025-09',
    h: 'h-72',
    body: [
      'Pettoo needed a backend that could list services, take bookings, sell products, and connect pet owners without turning into an unmaintainable pile of endpoints.',
      'I designed the schema and core business logic on FastAPI and PostgreSQL, added Elasticsearch for search, and set up CI/CD and container deploys on GCP. I also coordinated a team of three so API shape and quality stayed consistent.',
      'Search and booking shared one data model carefully enough that product and services did not fork into separate worlds. Elasticsearch added ops surface area, but owner-facing discovery needed it more than SQL ILIKE could give.',
      'You can [visit Pettoo](https://pettoo.de) to see the public site; the engagement ran through September 2025.',
    ],
  },
  {
    title: 'Ra-Connect',
    summary: 'Project description coming soon.',
    kind: 'personal',
    h: 'h-72',
    body: [
      'Details and links for Ra-Connect will be added here shortly once available.',
    ],
  },
  {
    title: 'Algo trade Order Block Detector',
    summary: 'Project description coming soon.',
    kind: 'personal',
    h: 'h-72',
    body: [
      'Details and links for the Algo trade Order Block Detector will be added here shortly once available.',
    ],
  },
];

export const kindLabels: Record<WorkKind, string> = {
  employment: 'Employment',
  freelance: 'Freelance',
  personal: 'Personal',
  research: 'Research',
};

/** "SynTwin GmbH · Full-stack engineer · 2024 — Present" */
export const workMeta = (work: WorkCardType): string =>
  [work.company, work.role, workPeriod(work)].filter(Boolean).join(' · ');

export const workPeriod = (work: WorkCardType): string => {
  if (!work.start) return '';
  const year = (date: string) => date.slice(0, 4);
  const end = work.end ? year(work.end) : 'Present';
  return year(work.start) === end ? end : `${year(work.start)} — ${end}`;
};

// ponytail: slug derived from the title — no second source of truth to keep in sync.
export const workSlug = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const findWork = (slug: string): WorkCardType | undefined =>
  works.find((work) => workSlug(work.title) === slug);
