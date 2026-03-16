import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

interface CommentReplyFormProps {
  name: string;
  content: string;
  onNameChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function CommentReplyForm({
  name,
  content,
  onNameChange,
  onContentChange,
  onSubmit,
  onCancel,
  isLoading,
}: CommentReplyFormProps) {
  return (
    <div className="mt-3 space-y-2 p-3 bg-gray-50 rounded-[var(--radius-md)]">
      <Input
        placeholder="Tu nombre"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <Textarea
        placeholder="Escribe tu respuesta..."
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
        rows={2}
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={onSubmit} isLoading={isLoading}>
          Responder
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
