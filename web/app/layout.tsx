import type { Metadata } from 'next';
import { Geist_Mono, Geist, Newsreader } from 'next/font/google';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { ThemeScript } from '@/components/theme/ThemeScript';
import { QueryProvider } from '@/components/QueryProvider';
import { CommandPaletteMount } from '@/components/command/CommandPaletteMount';
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts';
import { Toaster } from 'sonner';
import './globals.css';

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});
const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});
const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'aurora', template: '%s · aurora' },
  description: 'personal portfolio & tech blog',
  alternates: {
    types: { 'application/rss+xml': '/feed.xml' },
  },
  openGraph: {
    type: 'website',
    siteName: 'aurora',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistMono.variable} ${geistSans.variable} ${newsreader.variable}`}
    >
      <head>
        <ThemeScript />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" title="aurora · blog" />
      </head>
      <body>
        <ThemeProvider>
          <QueryProvider>
            {children}
            <CommandPaletteMount />
            <KeyboardShortcuts />
            <Toaster
              richColors
              closeButton
              position="top-right"
              toastOptions={{
                style: { fontFamily: 'var(--font-mono)' },
              }}
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
