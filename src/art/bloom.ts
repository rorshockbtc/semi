'use client';

import type React from 'react';

/**
 * Sets the pigment-bloom origin (`--bx`, `--by`) on `.wc-cta` elements so the
 * pink wash expands from where the pointer entered, or from center on keyboard focus.
 */
export function bloomHandlers<T extends HTMLElement>() {
  return {
    onPointerEnter: (e: React.PointerEvent<T>) => {
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--bx', `${e.clientX - r.left}px`);
      el.style.setProperty('--by', `${e.clientY - r.top}px`);
    },
    onFocus: (e: React.FocusEvent<T>) => {
      e.currentTarget.style.setProperty('--bx', '50%');
      e.currentTarget.style.setProperty('--by', '50%');
    },
  };
}
