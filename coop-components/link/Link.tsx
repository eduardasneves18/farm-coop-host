// // src/components/Link.tsx
// import React from 'react';

// // Try to import 'next/link' dynamically
// let NextLink: React.FC<any> | null = null;
// if (typeof window !== "undefined") {
//   try {
//     NextLink = require('next/link').default; // Dynamically import next/link if it exists
//   } catch (error) {
//     console.error('next/link not found, falling back to standard anchor tags.');
//   }
// }

// // Define the types for the props of the Link component
// interface LinkProps {
//   href: string; // Destination URL
//   children: React.ReactNode; // Content inside the link
//   [key: string]: any; // Allows other props (style, className, etc.)
// }

// const Link: React.FC<LinkProps> = ({ href, children, ...props }) => {
//   // If Next.js is available (i.e., 'next/link' is found), use next/link
//   if (NextLink) {
//     return (
//       <NextLink href={href} {...props}>
//         {children}
//       </NextLink>
//     );
//   }

//   // Otherwise, fallback to a standard anchor link for non-Next.js apps
//   return (
//     <a href={href} {...props}>
//       {children}
//     </a>
//   );
// };

// export default Link;
