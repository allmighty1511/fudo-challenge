import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import type { Post } from '@/types';

interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function PostCard({ post, onEdit, onDelete }: PostCardProps) {
  const preview = post.content.slice(0, 150) + (post.content.length > 150 ? '...' : '');

  return (
    <Card as="article" className="p-4 md:p-6">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <Link to={`/post/${post.id}`} className="block group">
            <h2 className="text-lg font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
              {post.title}
            </h2>
          </Link>
          <p className="mt-2 text-sm text-[var(--color-text-muted)] line-clamp-3">
            {preview}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Avatar src={post.avatar} alt={post.name} size="sm" />
            <span className="text-sm text-[var(--color-text-muted)]">
              {post.name} · {formatDate(post.createdAt)}
            </span>
          </div>
        </div>
        <Dropdown
          trigger={
            <button
              type="button"
              className="p-2 rounded hover:bg-gray-100 text-[var(--color-text-muted)]"
              aria-label="Opciones"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          }
          align="right"
        >
          <DropdownItem onClick={() => onEdit(post)}>Editar</DropdownItem>
          <DropdownItem variant="danger" onClick={() => onDelete(post)}>
            Eliminar
          </DropdownItem>
        </Dropdown>
      </div>
    </Card>
  );
}
