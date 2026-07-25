'use client';
import { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';

interface MastodonAccount {
  display_name: string;
  username: string;
  acct: string;
  avatar: string;
  url: string;
}

interface MastodonStatus {
  id: string;
  url: string;
  content: string;
  created_at: string;
  favourites_count: number;
  reblogs_count: number;
  replies_count: number;
  account: MastodonAccount;
}

interface MastodonContext {
  descendants: MastodonStatus[];
}

function parseMastodonUrl(url: string): { host: string; id: string } | null {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    const id = parts[parts.length - 1];
    if (!id || !/^\d+$/.test(id)) return null;
    return { host: u.host, id };
  } catch {
    return null;
  }
}

export function MastodonComments({ postUrl }: { postUrl: string }) {
  const [status, setStatus] = useState<MastodonStatus | null>(null);
  const [replies, setReplies] = useState<MastodonStatus[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const parsed = parseMastodonUrl(postUrl);
    if (!parsed) {
      setErr('invalid mastodon url');
      return;
    }
    const base = `https://${parsed.host}/api/v1/statuses/${parsed.id}`;
    Promise.all([
      fetch(base).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
      fetch(`${base}/context`).then((r) =>
        r.ok ? r.json() : Promise.reject(r.status),
      ),
    ])
      .then(([s, ctx]: [MastodonStatus, MastodonContext]) => {
        setStatus(s);
        setReplies(ctx.descendants ?? []);
      })
      .catch(() => setErr('could not load mastodon thread'));
  }, [postUrl]);

  if (err) return null;
  if (!status) {
    return (
      <div className="font-mono text-xs text-[--color-faint] py-4 text-center">
        loading discussion…
      </div>
    );
  }

  return (
    <section className="mt-12 pt-6 border-t border-[--color-border] space-y-3">
      <div className="flex items-center gap-2 font-mono text-sm">
        <MessageSquare size={13} className="text-[--color-accent]" />
        <span className="text-[--color-fg]">
          <span className="text-[--color-faint]">## </span>discussion
        </span>
        <span className="text-[--color-faint]">
          · {status.replies_count} replies · {status.favourites_count} likes
        </span>
        <a
          href={status.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-[--color-muted] hover:text-[--color-accent] text-xs"
        >
          reply on mastodon →
        </a>
      </div>
      {replies.length === 0 ? (
        <p className="font-mono text-xs text-[--color-faint]">
          no replies yet · be the first
        </p>
      ) : (
        <ul className="space-y-3">
          {replies.map((r) => (
            <li
              key={r.id}
              className="border border-[--color-border] rounded-md p-3"
            >
              <div className="flex items-center gap-2 mb-2 font-mono text-xs">
                <a
                  href={r.account.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[--color-accent] hover:underline"
                >
                  @{r.account.acct}
                </a>
                <time className="text-[--color-faint]">
                  {new Date(r.created_at).toLocaleDateString()}
                </time>
              </div>
              <div
                className="text-sm text-[--color-fg] mastodon-content prose-aurora"
                dangerouslySetInnerHTML={{ __html: r.content }}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
