'use client';

import React, { useEffect, useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

const emptySubscribe = () => () => {};

interface SemiDialogPortalProps {
  open: boolean;
  onClose: () => void;
  ariaLabelledBy: string;
  testId: string;
  children: (close: () => void) => React.ReactNode;
}

/**
 * Shared top-layer <dialog closedby="any"> portal wrapper with mandatory
 * Safari backdrop-coordinate light-dismiss fallback and scroll containment.
 */
export default function SemiDialogPortal({
  open,
  onClose,
  ariaLabelledBy,
  testId,
  children,
}: SemiDialogPortalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Mandatory light-dismiss fallback for browsers without HTMLDialogElement.prototype.closedBy
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleNativeClose = () => onClose();
    dialog.addEventListener('close', handleNativeClose);

    let removeFallback: (() => void) | undefined;
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      const handleBackdropClick = (event: MouseEvent) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (isDialogContent) return;
        dialog.close();
      };
      dialog.addEventListener('click', handleBackdropClick);
      removeFallback = () => dialog.removeEventListener('click', handleBackdropClick);
    }

    return () => {
      dialog.removeEventListener('close', handleNativeClose);
      removeFallback?.();
    };
  }, [onClose, mounted]);

  if (!mounted) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      {...({ closedby: 'any' } as Record<string, string>)}
      aria-labelledby={ariaLabelledBy}
      data-testid={testId}
      className="semi-dialog shadow-2xl"
    >
      {open ? children(onClose) : null}
    </dialog>,
    document.body
  );
}
