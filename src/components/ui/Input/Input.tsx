import type { InputHTMLAttributes } from 'react';
import { FormField } from '@/components/ui/FormField';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, className = '', ...props }: InputProps) {
  return (
    <FormField label={label} error={error} id={id}>
      {({ id: fieldId, className: fieldClassName }) => (
        <input
          id={fieldId}
          className={`${fieldClassName} ${className}`.trim()}
          {...props}
        />
      )}
    </FormField>
  );
}
