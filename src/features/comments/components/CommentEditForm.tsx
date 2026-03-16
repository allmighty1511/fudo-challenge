import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';

interface CommentEditFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function CommentEditForm({
  value,
  onChange,
  onSubmit,
  onCancel,
  isLoading,
}: CommentEditFormProps) {
  return (
    <div className="mt-2 space-y-2">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
        rows={3}
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={onSubmit} isLoading={isLoading}>
          Guardar
        </Button>
        <Button size="sm" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
