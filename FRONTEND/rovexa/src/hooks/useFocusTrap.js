// src/hooks/useFocusTrap.js
import { useEffect, useRef } from 'react';

export default function useFocusTrap(active = true) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const el = containerRef.current;
    const focusable = Array.from(
      el.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input:not([type="hidden"]), select, [tabindex]:not([tabindex="-1"])'
      )
    );

    if (focusable.length === 0) {
      // nothing focusable
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function handleKey(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    // set initial focus
    first.focus?.();

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [active]);

  return containerRef;
}
