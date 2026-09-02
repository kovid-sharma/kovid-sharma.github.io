import EmailLink from './EmailLink';
import ExternalLink from './ExternalLink';
import Flashcard from './Flashcard';
import InternalLink, { InternalAnchor, isSameSiteHref } from './InternalLink';
import type { LinkProps } from '@tanstack/react-router';
import type { ComponentPropsWithoutRef } from 'react';

const CustomLink = ({
  children,
  href = '',
  ...props
}: ComponentPropsWithoutRef<'a'>) => {
  const isRouterLink = href.startsWith('/');

  if (isRouterLink) {
    return (
      <InternalLink to={href as LinkProps['to']} {...props}>
        {children}
      </InternalLink>
    );
  }

  if (href.startsWith('mailto:')) {
    return (
      <EmailLink href={href as `mailto:${string}`} {...props}>
        {children}
      </EmailLink>
    );
  }

  if (isSameSiteHref(href)) {
    return (
      <InternalAnchor href={href} {...props}>
        {children}
      </InternalAnchor>
    );
  }

  return (
    <ExternalLink href={href} {...props}>
      {children}
    </ExternalLink>
  );
};

function RoundedImage(props: any) {
  return <img alt={props.alt} className="rounded-lg" {...props} />;
}

const components = {
  Flashcard,
  Image: RoundedImage,
  a: CustomLink,
};

export default components;
