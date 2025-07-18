import React from 'react';
import NextLink, { LinkProps } from 'next/link';

type LinkPropsExtended = LinkProps & {
  children: React.ReactNode;
  className?: string;
};

const NextLinkWrapper = React.forwardRef<HTMLAnchorElement, LinkPropsExtended>(
  ({ children, className, ...props }, ref) => (
    <NextLink {...props} passHref legacyBehavior>
      <a ref={ref} className={className}>
        {children}
      </a>
    </NextLink>
  )
);

NextLinkWrapper.displayName = 'NextLinkWrapper';
export default NextLinkWrapper