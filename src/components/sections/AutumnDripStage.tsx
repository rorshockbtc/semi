'use client';

import React, { useRef } from 'react';
import AutumnDripCanvas from '@/art/AutumnDripCanvas';

export default function AutumnDripStage({
  children,
  className = '',
  id,
  ariaLabelledBy,
  as = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  ariaLabelledBy?: string;
  as?: 'div' | 'header' | 'section';
}) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as;

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={`relative overflow-x-clip touch-pan-y wc-paper-grain ${className}`}
    >
      <AutumnDripCanvas containerRef={ref} />
      <div className="relative z-10">{children}</div>
    </Tag>
  );
}
