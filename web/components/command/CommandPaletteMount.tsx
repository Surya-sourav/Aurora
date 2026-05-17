'use client';
import { useEffect, useState } from 'react';
import { CommandPalette } from './CommandPalette';

export function CommandPaletteMount() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <CommandPalette />;
}
