import type { AnchorHTMLAttributes, ReactNode } from 'react';

interface Props extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'children' | 'className' | 'href' | 'rel' | 'target'
> {
  children: ReactNode;
  href: `mailto:${string}`;
}

export default function EmailLink({ children, href, ...props }: Props) {
  return (
    <a
      {...props}
      className="text-secondary -mx-2 inline-flex w-fit rounded-sm bg-black/[0.04] px-2 py-0.5 text-base no-underline transition-colors hover:bg-black/[0.08] dark:bg-white/[0.06] dark:hover:bg-white/[0.1]"
      data-link-kind="email"
      href={href}
      target="_self"
    >
      {children}
    </a>
  );
}
