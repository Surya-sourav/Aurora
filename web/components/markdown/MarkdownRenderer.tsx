'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { CodeBlock } from './CodeBlock';
import { Mermaid } from './Mermaid';
import { remarkCallouts } from '@/lib/remark-callouts';
import { remarkWikilinks } from '@/lib/remark-wikilinks';

export function MarkdownRenderer({ children }: { children: string }) {
  return (
    <div className="prose-aurora">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkCallouts, remarkWikilinks]}
        rehypePlugins={[rehypeRaw, rehypeSlug, rehypeKatex]}
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
            const language = langMatch?.[1];
            const code =
              typeof codeContent === 'string'
                ? codeContent
                : Array.isArray(codeContent)
                  ? codeContent.filter((c) => typeof c === 'string').join('')
                  : '';
            if (language === 'mermaid') {
              return <Mermaid code={code} />;
            }
            return (
              <CodeBlock language={language} code={code.replace(/\n$/, '')}>
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
