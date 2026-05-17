export function AsciiBanner({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');
  return (
    <pre
      aria-hidden="true"
      className="font-mono text-[10px] leading-tight text-[--color-accent] select-none whitespace-pre overflow-hidden"
    >
{`  ╭─────────────╮
  │ ${initials.padEnd(2)} · aurora · │
  ╰─────────────╯`}
    </pre>
  );
}
