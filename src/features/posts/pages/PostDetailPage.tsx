import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Avatar } from '@/components/ui/Avatar';
import { OptionsMenu } from '@/components/ui/Dropdown';
import { CommentTree } from '@/features/comments/components/CommentTree';
import { messages } from '@/lib/constants/messages';
import { formatDate } from '@/lib/utils/formatDate';
import { PostFormModal } from '../components';
import { usePost, useUpdatePost, useDeletePost } from '../hooks';
import type { PostFormData } from '../types';

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: post, isLoading, error } = usePost(id);
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = () => {
    if (!post || !window.confirm(messages.confirm.deletePost)) return;
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
            {error ? messages.errors.loadPost : messages.notFound.post}
          </p>
          <Link to="/" className="text-[var(--color-accent)] hover:underline">
            {messages.navigation.backToFeed}
          </Link>
        </div>
      </MainLayout>
    );
  }

  if (isLoading || !post) {
    return (
      <MainLayout>
        <div className="space-y-4">
          <Skeleton variant="title" />
          <Skeleton variant="text" />
          <Skeleton variant="text-short" />
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
          {messages.navigation.backToFeedWithArrow}
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
                  {formatDate(post.createdAt, 'long')}
                </span>
              </div>
            </div>
            <p className="mt-4 text-[var(--color-text)] whitespace-pre-wrap">
              {post.content}
            </p>
          </div>
          <OptionsMenu
            onEdit={() => setIsEditModalOpen(true)}
            onDelete={handleDelete}
            align="right"
          />
        </div>
      </Card>

      {id && <CommentTree postId={id} />}

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
