import { AppProviders, AppShell } from '../App';
import appCss from '../assets/styles/globals.css?url';
import proseCss from '../assets/styles/prose.css?url';
import NotFound from '../pages/NotFound';
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootComponent,
  head: () => ({
    links: [
      { href: '/favicon.svg', rel: 'icon', type: 'image/svg+xml' },
      { href: '/favicon.ico', rel: 'icon', type: 'image/x-icon' },
      {
        href: '/static/favicons/apple-touch-icon-180x180.png',
        rel: 'apple-touch-icon',
      },
      {
        href: '/static/favicons/site.webmanifest',
        rel: 'manifest',
      },
      { href: 'https://fonts.googleapis.com', rel: 'preconnect' },
      {
        crossOrigin: 'anonymous',
        href: 'https://fonts.gstatic.com',
        rel: 'preconnect',
      },
      {
        crossOrigin: 'anonymous',
        href: 'https://cdn.openai.com',
        rel: 'preconnect',
      },
      {
        href: 'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap',
        rel: 'stylesheet',
      },
      { href: appCss, rel: 'stylesheet' },
      { href: proseCss, rel: 'stylesheet' },
    ],
    meta: [
      { charSet: 'utf-8' },
      {
        content: 'width=device-width, initial-scale=1.0, viewport-fit=cover',
        name: 'viewport',
      },
      { content: 'AI/ML Engineer.', name: 'description' },
      { content: '#ffffff', name: 'theme-color' },
      { content: 'Kovid Sharma', property: 'og:title' },
      { content: 'website', property: 'og:type' },
      { content: 'https://kovid-sharma.github.io', property: 'og:url' },
      {
        content: 'https://kovid-sharma.github.io/static/images/og-v2.png',
        property: 'og:image',
      },
      { content: '1200', property: 'og:image:width' },
      { content: '630', property: 'og:image:height' },
      { content: 'Kovid Sharma', property: 'og:image:alt' },
      { content: 'summary_large_image', name: 'twitter:card' },
      { content: 'Kovid Sharma', name: 'twitter:title' },
      {
        content: 'https://kovid-sharma.github.io/static/images/og-v2.png',
        name: 'twitter:image',
      },
      { content: 'Kovid Sharma', name: 'twitter:image:alt' },
      { title: 'Kovid Sharma' },
    ],
  }),
  notFoundComponent: RootNotFound,
  shellComponent: RootDocument,
});

function RootComponent() {
  return (
    <AppProviders>
      <AppShell>
        <Outlet />
      </AppShell>
    </AppProviders>
  );
}

function RootNotFound() {
  return (
    <AppProviders>
      <AppShell>
        <NotFound />
      </AppShell>
    </AppProviders>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
