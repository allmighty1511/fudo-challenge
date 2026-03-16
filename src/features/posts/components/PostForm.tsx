import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import type { PostFormFields } from '../types';

interface PostFormProps {
  initialData?: PostFormFields;
  onSubmit: (data: PostFormFields) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PostForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: PostFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [content, setContent] = useState(initialData?.content ?? '');
  const [name, setName] = useState(initialData?.name ?? '');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content, name });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        placeholder="Título del post"
      />
      <Textarea
        label="Contenido"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        placeholder="Escribe tu contenido..."
        rows={5}
      />
      <Input
        label="Tu nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="Nombre"
      />
      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Guardar' : 'Publicar'}
        </Button>
      </div>
    </form>
  );
}
