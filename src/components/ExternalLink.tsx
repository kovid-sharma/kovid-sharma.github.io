import type { AnchorHTMLAttributes, ReactNode } from 'react';

interface Props extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'children' | 'className' | 'href' | 'rel' | 'target'
> {
  children: ReactNode;
  href: string;
}

const SITE_HOSTNAME = 'kovid-sharma.github.io';

export function isExternalHttpHref(href: string) {
  try {
    const url = new URL(href);
    return (
      (url.protocol === 'http:' || url.protocol === 'https:') &&
      url.hostname !== SITE_HOSTNAME
    );
  } catch {
    return false;
  }
}

export default function ExternalLink({ children, href, ...props }: Props) {
  if (!isExternalHttpHref(href)) {
    console.warn(`ExternalLink is rendering an internal or non-HTTP URL: ${href}`);
  }

  return (
    <a
      {...props}
      className="group text-secondary relative isolate -mx-2 inline-flex w-fit items-center bg-black/[0.04] px-2 text-base no-underline before:pointer-events-none before:absolute before:inset-0 before:z-0 before:origin-left before:scale-x-0 before:bg-[#1EFFB8] before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)] before:content-[''] hover:text-black hover:before:scale-x-100 focus-visible:text-black focus-visible:before:scale-x-100 motion-reduce:before:transition-none dark:bg-white/[0.06]"
      data-link-kind="external"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden="true"
        className="relative z-10 ml-[0.6em] size-[0.55em] -translate-x-1 opacity-40 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none"
        fill="none"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.25"
        />
      </svg>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
