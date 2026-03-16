import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { CommentTree } from '@/features/comments/components/CommentTree';
import { PostFormModal } from '../components';
import { usePost, useUpdatePost, useDeletePost } from '../hooks';
import type { PostFormData } from '../types';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: post, isLoading, error } = usePost(id);
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = () => {
    if (!post || !window.confirm('¿Eliminar este post?')) return;
    deletePost.mutate(post.id, {
      onSuccess: () => navigate('/'),
    });
  };

  const handleSubmitEdit = (data: PostFormData) => {
    if (!post) return;
    updatePost.mutate(
      { id: post.id, post: data },
      {
        onSuccess: () => setIsEditModalOpen(false),
      }
    );
  };

  if (error || (!isLoading && !post)) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-[var(--color-error)] mb-4">
            {error ? 'Error al cargar el post.' : 'Post no encontrado.'}
          </p>
          <Link to="/" className="text-[var(--color-accent)] hover:underline">
            Volver al feed
          </Link>
        </div>
      </MainLayout>
    );
  }

  if (isLoading || !post) {
    return (
      <MainLayout>
        <div className="space-y-4">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />
          <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
          <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-4">
        <Link
          to="/"
          className="text-sm text-[var(--color-accent)] hover:underline"
        >
          ← Volver al feed
        </Link>
      </div>

      <Card className="p-4 md:p-6 mb-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold text-[var(--color-text)]">
              {post.title}
            </h1>
            <div className="mt-4 flex items-center gap-3">
              <Avatar src={post.avatar} alt={post.name} size="md" />
              <div>
                <span className="font-medium text-[var(--color-text)]">
                  {post.name}
                </span>
                <span className="block text-sm text-[var(--color-text-muted)]">
                  {formatDate(post.createdAt)}
                </span>
              </div>
            </div>
            <p className="mt-4 text-[var(--color-text)] whitespace-pre-wrap">
              {post.content}
            </p>
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
            <DropdownItem onClick={() => setIsEditModalOpen(true)}>
              Editar
            </DropdownItem>
            <DropdownItem variant="danger" onClick={handleDelete}>
              Eliminar
            </DropdownItem>
          </Dropdown>
        </div>
      </Card>

      <CommentTree postId={post.id} />

      <PostFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        post={post}
        onSubmit={handleSubmitEdit}
        isLoading={updatePost.isPending}
      />
    </MainLayout>
  );
}
