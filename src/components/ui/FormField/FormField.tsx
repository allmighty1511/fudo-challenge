import type { ReactNode } from 'react';

const inputBaseClasses =
  'w-full px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent';

export interface FormFieldRenderProps {
  id: string;
  className: string;
}

interface FormFieldProps {
  label?: string;
  error?: string;
  id?: string;
  children: (props: FormFieldRenderProps) => ReactNode;
}

export function FormField({ label, error, id, children }: FormFieldProps) {
  const fieldId = id ?? `field-${Math.random().toString(36).slice(2)}`;
  const inputClassName = `${inputBaseClasses} ${error ? 'border-[var(--color-error)]' : ''}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={fieldId}
          className="block text-sm font-medium text-[var(--color-text)] mb-1"
        >
          {label}
        </label>
      )}
      {children({ id: fieldId, className: inputClassName })}
      {error && (
        <p className="mt-1 text-sm text-[var(--color-error)]">{error}</p>
      )}
    </div>
  );
}
