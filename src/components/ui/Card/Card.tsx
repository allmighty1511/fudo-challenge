import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'article' | 'section';
}

export function Card({ as: Component = 'div', className = '', ...props }: CardProps) {
  return (
    <Component
      className={`bg-[var(--color-surface)] rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] ${className}`}
      {...props}
    />
  );
}
