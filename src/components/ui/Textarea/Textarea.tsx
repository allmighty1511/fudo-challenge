import type { TextareaHTMLAttributes } from 'react';
import { FormField } from '@/components/ui/FormField';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, id, className = '', ...props }: TextareaProps) {
  return (
    <FormField label={label} error={error} id={id}>
      {({ id: fieldId, className: fieldClassName }) => (
        <textarea
          id={fieldId}
          className={`${fieldClassName} ${className}`.trim()}
          {...props}
        />
      )}
    </FormField>
  );
}
