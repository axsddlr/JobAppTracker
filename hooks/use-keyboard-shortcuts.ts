'use client';

import { useEffect } from 'react';

type ShortcutHandler = () => void;

interface ShortcutMap {
  [key: string]: ShortcutHandler;
}

export function useKeyboardShortcuts(shortcuts: ShortcutMap) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Don't trigger shortcuts when typing in input fields
      if (['input', 'textarea'].includes((event.target as HTMLElement).tagName.toLowerCase())) {
        return;
      }

      const key = event.key.toLowerCase();
      
      // Handle shift combinations (e.g., 'shift+n')
      if (event.shiftKey) {
        const shortcutKey = `shift+${key}`;
        if (shortcuts[shortcutKey]) {
          event.preventDefault();
          shortcuts[shortcutKey]();
        }
      } else if (shortcuts[key]) {
        // Handle single key shortcuts
        event.preventDefault();
        shortcuts[key]();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}