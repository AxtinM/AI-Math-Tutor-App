/* eslint-disable import/no-named-as-default-member */
import Link from 'next/link';
import React, { memo, useEffect, useState } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './code-block';
import { cn } from '@/lib/utils';
import {
  containsRTL,
  containsLatin,
  isMixedContent,
  wrapMixedContent
} from '@/lib/utils/rtl-helpers';

interface MarkdownProps {
  children: string;
  dir?: 'rtl' | 'ltr' | 'auto';
  className?: string;
}

const components: Partial<Components> = {
  // @ts-expect-error
  code: CodeBlock,
  pre: ({ children }) => <>{children}</>,
  p: ({ node, children, ...props }) => {
    // Auto-detect paragraph direction based on content
    const text = React.Children.toArray(children)
      .filter(child => typeof child === 'string')
      .join('');

    const hasRTL = containsRTL(text);
    const hasLatin = containsLatin(text);
    const hasMixed = hasRTL && hasLatin;
    const paraDir = hasRTL ? 'rtl' : 'ltr';

    // Add appropriate classes based on content type
    const classes = cn(
      'my-2',
      hasRTL && !hasLatin && 'rtl-paragraph font-dubai',
      !hasRTL && hasLatin && 'font-geist',
      hasMixed && 'mixed-content'
    );

    if (hasMixed) {
      // For mixed content, we'll use a special rendering approach
      // that properly isolates the different script segments
      return (
        <p className={classes} dir={paraDir} {...props}
          dangerouslySetInnerHTML={{ __html: wrapMixedContent(text) }} />
      );
    }

    return (
      <p className={classes} dir={paraDir} {...props}>
        {children}
      </p>
    );
  },
  ol: ({ node, children, ...props }) => {
    // Determine if this list contains RTL content
    const text = React.Children.toArray(children)
      .filter(child => typeof child === 'string')
      .join('');

    const hasRTL = containsRTL(text);

    return (
      <ol className={cn(
        "list-decimal list-outside rtl:mr-4 ltr:ml-4",
        hasRTL && "rtl-list"
      )} dir={hasRTL ? 'rtl' : 'ltr'} {...props}>
        {children}
      </ol>
    );
  },
  li: ({ node, children, ...props }) => {
    // Determine if this list item contains RTL content
    const text = React.Children.toArray(children)
      .filter(child => typeof child === 'string')
      .join('');

    const hasRTL = containsRTL(text);
    const hasLatin = containsLatin(text);
    const hasMixed = hasRTL && hasLatin;

    return (
      <li
        className={cn(
          "py-1",
          hasRTL && !hasLatin && "rtl-force font-dubai",
          !hasRTL && hasLatin && "font-geist",
          hasMixed && "mixed-content"
        )}
        dir={hasRTL ? 'rtl' : 'ltr'}
        {...props}
      >
        {hasMixed
          ? <span dangerouslySetInnerHTML={{ __html: wrapMixedContent(text) }} />
          : children
        }
      </li>
    );
  },
  ul: ({ node, children, ...props }) => {
    // Determine if this list contains RTL content
    const text = React.Children.toArray(children)
      .filter(child => typeof child === 'string')
      .join('');

    const hasRTL = containsRTL(text);

    return (
      <ul className={cn(
        "list-disc list-outside rtl:mr-4 ltr:ml-4",
        hasRTL && "rtl-list"
      )} dir={hasRTL ? 'rtl' : 'ltr'} {...props}>
        {children}
      </ul>
    );
  },
  strong: ({ node, children, ...props }) => {
    // Check if strong text contains RTL content
    const text = React.Children.toArray(children)
      .filter(child => typeof child === 'string')
      .join('');

    const hasRTL = containsRTL(text);
    const hasLatin = containsLatin(text);
    const hasMixed = hasRTL && hasLatin;

    return (
      <span className={cn(
        "font-semibold",
        hasRTL && !hasLatin && "font-dubai",
        !hasRTL && hasLatin && "font-geist",
        hasMixed && "mixed-content"
      )} dir={hasRTL ? 'rtl' : 'ltr'} {...props}>
        {hasMixed
          ? <span dangerouslySetInnerHTML={{ __html: wrapMixedContent(text) }} />
          : children
        }
      </span>
    );
  },
  a: ({ node, children, ...props }) => {
    // Check if link text contains RTL content
    const text = React.Children.toArray(children)
      .filter(child => typeof child === 'string')
      .join('');

    const hasRTL = containsRTL(text);
    const hasLatin = containsLatin(text);
    const hasMixed = hasRTL && hasLatin;

    return (
      // @ts-expect-error
      <Link
        className={cn(
          "text-blue-500 hover:underline",
          hasRTL && !hasLatin && "font-dubai",
          !hasRTL && hasLatin && "font-geist",
          hasMixed && "mixed-content"
        )}
        dir={hasRTL ? 'rtl' : 'ltr'}
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {hasMixed
          ? <span dangerouslySetInnerHTML={{ __html: wrapMixedContent(text) }} />
          : children
        }
      </Link>
    );
  },
  h1: ({ node, children, ...props }) => {
    // Check if heading contains RTL content
    const text = React.Children.toArray(children)
      .filter(child => typeof child === 'string')
      .join('');

    const hasRTL = containsRTL(text);
    const hasLatin = containsLatin(text);
    const hasMixed = hasRTL && hasLatin;

    return (
      <h1
        className={cn(
          "text-3xl font-semibold mt-6 mb-2",
          hasRTL && !hasLatin && "font-dubai",
          !hasRTL && hasLatin && "font-geist",
          hasMixed && "mixed-content"
        )}
        dir={hasRTL ? 'rtl' : 'ltr'}
        {...props}
      >
        {hasMixed
          ? <span dangerouslySetInnerHTML={{ __html: wrapMixedContent(text) }} />
          : children
        }
      </h1>
    );
  },
  h2: ({ node, children, ...props }) => {
    const text = React.Children.toArray(children)
      .filter(child => typeof child === 'string')
      .join('');

    const hasRTL = containsRTL(text);
    const hasLatin = containsLatin(text);
    const hasMixed = hasRTL && hasLatin;

    return (
      <h2
        className={cn(
          "text-2xl font-semibold mt-6 mb-2",
          hasRTL && !hasLatin && "font-dubai",
          !hasRTL && hasLatin && "font-geist",
          hasMixed && "mixed-content"
        )}
        dir={hasRTL ? 'rtl' : 'ltr'}
        {...props}
      >
        {hasMixed
          ? <span dangerouslySetInnerHTML={{ __html: wrapMixedContent(text) }} />
          : children
        }
      </h2>
    );
  },
  h3: ({ node, children, ...props }) => {
    const text = React.Children.toArray(children)
      .filter(child => typeof child === 'string')
      .join('');

    const hasRTL = containsRTL(text);
    const hasLatin = containsLatin(text);
    const hasMixed = hasRTL && hasLatin;

    return (
      <h3
        className={cn(
          "text-xl font-semibold mt-6 mb-2",
          hasRTL && !hasLatin && "font-dubai",
          !hasRTL && hasLatin && "font-geist",
          hasMixed && "mixed-content"
        )}
        dir={hasRTL ? 'rtl' : 'ltr'}
        {...props}
      >
        {hasMixed
          ? <span dangerouslySetInnerHTML={{ __html: wrapMixedContent(text) }} />
          : children
        }
      </h3>
    );
  },
  h4: ({ node, children, ...props }) => {
    const text = React.Children.toArray(children)
      .filter(child => typeof child === 'string')
      .join('');

    const hasRTL = containsRTL(text);
    const hasLatin = containsLatin(text);
    const hasMixed = hasRTL && hasLatin;

    return (
      <h4
        className={cn(
          "text-lg font-semibold mt-6 mb-2",
          hasRTL && !hasLatin && "font-dubai",
          !hasRTL && hasLatin && "font-geist",
          hasMixed && "mixed-content"
        )}
        dir={hasRTL ? 'rtl' : 'ltr'}
        {...props}
      >
        {hasMixed
          ? <span dangerouslySetInnerHTML={{ __html: wrapMixedContent(text) }} />
          : children
        }
      </h4>
    );
  },
  h5: ({ node, children, ...props }) => {
    const text = React.Children.toArray(children)
      .filter(child => typeof child === 'string')
      .join('');

    const hasRTL = containsRTL(text);
    const hasLatin = containsLatin(text);
    const hasMixed = hasRTL && hasLatin;

    return (
      <h5
        className={cn(
          "text-base font-semibold mt-6 mb-2",
          hasRTL && !hasLatin && "font-dubai",
          !hasRTL && hasLatin && "font-geist",
          hasMixed && "mixed-content"
        )}
        dir={hasRTL ? 'rtl' : 'ltr'}
        {...props}
      >
        {hasMixed
          ? <span dangerouslySetInnerHTML={{ __html: wrapMixedContent(text) }} />
          : children
        }
      </h5>
    );
  },
  h6: ({ node, children, ...props }) => {
    const text = React.Children.toArray(children)
      .filter(child => typeof child === 'string')
      .join('');

    const hasRTL = containsRTL(text);
    const hasLatin = containsLatin(text);
    const hasMixed = hasRTL && hasLatin;

    return (
      <h6
        className={cn(
          "text-sm font-semibold mt-6 mb-2",
          hasRTL && !hasLatin && "font-dubai",
          !hasRTL && hasLatin && "font-geist",
          hasMixed && "mixed-content"
        )}
        dir={hasRTL ? 'rtl' : 'ltr'}
        {...props}
      >
        {hasMixed
          ? <span dangerouslySetInnerHTML={{ __html: wrapMixedContent(text) }} />
          : children
        }
      </h6>
    );
  },
};

const remarkPlugins = [remarkGfm];

const NonMemoizedMarkdown = ({ children, dir, className }: MarkdownProps) => {
  // Auto-detect RTL content if dir is not explicitly provided
  const [contentDir, setContentDir] = useState<'rtl' | 'ltr' | 'auto'>(dir || 'auto');
  const [hasMixed, setHasMixed] = useState<boolean>(false);

  useEffect(() => {
    if (!dir && children) {
      // Only auto-detect if dir prop wasn't explicitly provided
      const hasRTL = containsRTL(children);
      const mixed = isMixedContent(children);

      setContentDir(hasRTL ? 'rtl' : 'ltr');
      setHasMixed(mixed);
    }
  }, [children, dir]);

  return (
    <div className={cn(
      "overflow-hidden",
      hasMixed && "mixed-script-container",
      className
    )} dir={contentDir}>
      <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => {
    return prevProps.children === nextProps.children && prevProps.dir === nextProps.dir;
  }
);
