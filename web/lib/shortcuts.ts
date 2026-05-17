export type Shortcut = {
  keys: string;
  label: string;
  href?: string;
  action?: 'theme' | 'search' | 'help' | 'palette';
};

export const SHORTCUTS: Shortcut[] = [
  { keys: 'g h', label: 'go home', href: '/' },
  { keys: 'g b', label: 'go to blog', href: '/blog' },
  { keys: 'g i', label: 'go to interests', href: '/interests' },
  { keys: 'g a', label: 'go to admin', href: '/admin' },
  { keys: 't',   label: 'toggle theme', action: 'theme' },
  { keys: '/',   label: 'search blog', action: 'search' },
  { keys: '⌘ k', label: 'command palette', action: 'palette' },
  { keys: '?',   label: 'show this help', action: 'help' },
];
