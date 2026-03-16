import type { ButtonHTMLAttributes } from 'react';

interface DropdownItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'danger';
}

export function DropdownItem({
  variant = 'default',
  className = '',
  children,
  ...props
}: DropdownItemProps) {
  const variantClass =
    variant === 'danger'
      ? 'text-[var(--color-error)] hover:bg-red-50'
      : 'text-[var(--color-text)] hover:bg-gray-50';

  return (
    <button
      type="button"
      className={`w-full text-left px-4 py-2 text-sm ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
