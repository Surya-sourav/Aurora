'use client';
import { Twitter, Linkedin, Rss, Link as LinkIcon, Check } from 'lucide-react';
import { useState } from 'react';

interface Props {
  url: string;
  title: string;
}

export function SocialShare({ url, title }: Props) {
  const [copied, setCopied] = useState(false);
  const encTitle = encodeURIComponent(title);
  const encUrl = encodeURIComponent(url);
  const copyUrl = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => undefined);
  };
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <a
        href={`https://twitter.com/intent/tweet?text=${encTitle}&url=${encUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on X"
        className="inline-flex items-center gap-1.5 h-7 px-2 rounded-md border border-[--color-border] text-[--color-muted] hover:text-[--color-accent] hover:border-[--color-accent] transition-colors font-mono text-xs"
      >
        <Twitter size={11} /> x
      </a>
      <a
        href={`https://bsky.app/intent/compose?text=${encTitle}%20${encUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on Bluesky"
        className="inline-flex items-center gap-1.5 h-7 px-2 rounded-md border border-[--color-border] text-[--color-muted] hover:text-[--color-accent] hover:border-[--color-accent] transition-colors font-mono text-xs"
      >
        <Rss size={11} /> bsky
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on LinkedIn"
        className="inline-flex items-center gap-1.5 h-7 px-2 rounded-md border border-[--color-border] text-[--color-muted] hover:text-[--color-accent] hover:border-[--color-accent] transition-colors font-mono text-xs"
      >
        <Linkedin size={11} /> in
      </a>
      <a
        href={`https://news.ycombinator.com/submitlink?u=${encUrl}&t=${encTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Submit to Hacker News"
        className="inline-flex items-center gap-1.5 h-7 px-2 rounded-md border border-[--color-border] text-[--color-muted] hover:text-[--color-accent] hover:border-[--color-accent] transition-colors font-mono text-xs"
      >
        hn
      </a>
      <button
        type="button"
        onClick={copyUrl}
        className="inline-flex items-center gap-1.5 h-7 px-2 rounded-md border border-[--color-border] text-[--color-muted] hover:text-[--color-accent] hover:border-[--color-accent] transition-colors font-mono text-xs"
        title="Copy link"
      >
        {copied ? <Check size={11} /> : <LinkIcon size={11} />}
        {copied ? 'copied' : 'link'}
      </button>
    </div>
  );
}
