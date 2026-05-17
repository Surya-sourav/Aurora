import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 font-mono">
      <div className="text-center space-y-4">
        <pre className="text-sm text-[--color-fg]">
{`$ cd /404

  ╭──────────────────────────────╮
  │   not found                  │
  │   the path you sought         │
  │   does not exist here.        │
  ╰──────────────────────────────╯`}
        </pre>
        <Link href="/" className="text-sm text-[--color-accent] hover:underline">
          → cd ~
        </Link>
      </div>
    </main>
  );
}
