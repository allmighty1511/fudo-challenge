import { useRef, useState, type ReactNode } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right';
}

export function Dropdown({ trigger, children, align = 'right' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setIsOpen(false));

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setIsOpen((o) => !o)} role="button" tabIndex={0}>
        {trigger}
      </div>
      {isOpen && (
        <div
          className={`absolute top-full mt-1 min-w-[160px] py-1 bg-[var(--color-surface)] rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-[var(--shadow-md)] z-10 ${align === 'left' ? 'left-0' : 'right-0'}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
