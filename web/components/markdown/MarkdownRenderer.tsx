'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import { CodeBlock } from './CodeBlock';

export function MarkdownRenderer({ children }: { children: string }) {
  return (
    <div className="prose-aurora">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
        components={{
          pre: ({ children, ...props }) => {
            const child = Array.isArray(children) ? children[0] : children;
            type CodeChildProps = {
              className?: string;
              children?: React.ReactNode;
            };
            const codeChild = child as { props?: CodeChildProps } | undefined;
            const className = codeChild?.props?.className ?? '';
            const codeContent = codeChild?.props?.children;
            const langMatch = /language-(\w+)/.exec(className);
            const code =
              typeof codeContent === 'string'
                ? codeContent
                : Array.isArray(codeContent)
                  ? codeContent.filter((c) => typeof c === 'string').join('')
                  : '';
            return (
              <CodeBlock language={langMatch?.[1]} code={code.replace(/\n$/, '')}>
                <pre {...props}>{children}</pre>
              </CodeBlock>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
