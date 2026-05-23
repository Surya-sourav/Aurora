import Link from 'next/link';
import {
  Github,
  Globe,
  Linkedin,
  Mail,
  Rss,
  Twitter,
} from 'lucide-react';
import type { Socials } from '@/lib/types';

interface Props {
  email: string;
  socials?: Socials;
}

export function SocialBar({ email, socials }: Props) {
  const links: { href: string; label: string; icon: React.ReactNode; external?: boolean }[] = [];

  if (email) {
    links.push({
      href: `mailto:${email}`,
      label: 'email',
      icon: <Mail size={12} />,
      external: true,
    });
  }
  if (socials?.github) {
    links.push({
      href: normalizeUrl(socials.github, 'https://github.com/'),
      label: 'github',
      icon: <Github size={12} />,
      external: true,
    });
  }
  if (socials?.twitter) {
    links.push({
      href: normalizeUrl(socials.twitter, 'https://twitter.com/'),
      label: 'twitter',
      icon: <Twitter size={12} />,
      external: true,
    });
  }
  if (socials?.linkedin) {
    links.push({
      href: normalizeUrl(socials.linkedin, 'https://linkedin.com/in/'),
      label: 'linkedin',
      icon: <Linkedin size={12} />,
      external: true,
    });
  }
  if (socials?.website) {
    links.push({
      href: normalizeUrl(socials.website, 'https://'),
      label: 'site',
      icon: <Globe size={12} />,
      external: true,
    });
  }
  links.push({
    href: '/feed.xml',
    label: 'rss',
    icon: <Rss size={12} />,
  });

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {links.map((l) => {
        const cls =
          'inline-flex items-center gap-1.5 px-2.5 h-7 rounded-md border border-[--color-border] font-mono text-xs text-[--color-muted] hover:border-[--color-accent] hover:text-[--color-accent] transition-colors';
        return l.external ? (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer me"
            className={cls}
          >
            {l.icon}
            {l.label}
          </a>
        ) : (
          <Link key={l.label} href={l.href} className={cls}>
            {l.icon}
            {l.label}
          </Link>
        );
      })}
    </div>
  );
}

function normalizeUrl(value: string, prefix: string): string {
  const v = value.trim();
  if (!v) return '#';
  if (/^https?:\/\//i.test(v)) return v;
  if (v.startsWith('@')) return prefix + v.slice(1);
  return prefix + v;
}
