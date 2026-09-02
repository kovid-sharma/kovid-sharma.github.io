import { Link, type LinkProps } from '@tanstack/react-router';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

const SITE_URL = 'https://kovid-sharma.github.io';

type SharedProps = {
  children: ReactNode;
};

type InternalLinkProps = Omit<
  LinkProps,
  'children' | 'className' | 'rel' | 'target'
> &
  SharedProps;

type InternalAnchorProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'children' | 'className' | 'rel' | 'target'
> &
  SharedProps;

const internalLinkClassName =
  'text-secondary underline decoration-black/70 decoration-wavy decoration-2 underline-offset-4 transition-colors hover:decoration-black dark:decoration-white/70 dark:hover:decoration-white';

export function isSameSiteHref(href: string) {
  try {
    return new URL(href, SITE_URL).hostname === new URL(SITE_URL).hostname;
  } catch {
    return false;
  }
}

export function InternalAnchor({
  children,
  href = '',
  ...props
}: InternalAnchorProps) {
  if (!isSameSiteHref(href)) {
    throw new Error(`InternalAnchor requires a same-site URL: ${href}`);
  }

  return (
    <a
      {...props}
      className={internalLinkClassName}
      data-link-kind="internal"
      href={href}
      target="_self"
    >
      {children}
    </a>
  );
}

export default function InternalLink({
  children,
  ...props
}: InternalLinkProps) {
  return (
    <Link
      {...props}
      className={internalLinkClassName}
      data-link-kind="internal"
      target="_self"
    >
      {children}
    </Link>
  );
}
