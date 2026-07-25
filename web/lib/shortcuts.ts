export type Shortcut = {
  keys: string;
  label: string;
  href?: string;
  action?: 'theme' | 'search' | 'help' | 'palette' | 'terminal';
};

export const SHORTCUTS: Shortcut[] = [
  { keys: 'g h', label: 'go home', href: '/' },
  { keys: 'g b', label: 'go to blog', href: '/blog' },
  { keys: 'g n', label: 'go to notes', href: '/notes' },
  { keys: 'g c', label: 'go to career', href: '/career' },
  { keys: 'g i', label: 'go to interests', href: '/interests' },
  { keys: 'g m', label: 'go to bookmarks', href: '/bookmarks' },
  { keys: 'g u', label: 'go to /uses', href: '/uses' },
  { keys: 'g w', label: 'go to /now', href: '/now' },
  { keys: 'g a', label: 'go to admin', href: '/admin' },
  { keys: 't',   label: 'toggle theme', action: 'theme' },
  { keys: '/',   label: 'search', action: 'search' },
  { keys: '⌘ k', label: 'command palette', action: 'palette' },
  { keys: '`',   label: 'terminal', action: 'terminal' },
  { keys: '?',   label: 'show this help', action: 'help' },
];
