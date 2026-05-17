'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          background: '#1a1d24',
          color: '#f0e9d5',
          fontFamily: 'ui-monospace, monospace',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 0,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <pre style={{ color: '#f87171' }}>
            $ aurora: error{'\n  → '}
            {error.message || 'unknown error'}
          </pre>
          <div
            style={{
              marginTop: 16,
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
            }}
          >
            <button
              onClick={reset}
              style={{
                padding: '4px 12px',
                border: '1px solid #3a3f4c',
                background: 'transparent',
                color: 'inherit',
                fontFamily: 'inherit',
                cursor: 'pointer',
                borderRadius: 4,
              }}
            >
              retry
            </button>
            <a
              href="/"
              style={{
                padding: '4px 12px',
                border: '1px solid #3a3f4c',
                color: 'inherit',
                textDecoration: 'none',
                borderRadius: 4,
              }}
            >
              cd ~
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
