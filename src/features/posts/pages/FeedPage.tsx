import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { messages } from '@/lib/constants/messages';
import { PostCard, PostFormModal } from '../components';
import {
  usePosts,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
} from '../hooks';
import { getAvatarForName, resolveAvatar } from '@/lib/avatars';
import type { Post } from '@/types';
import type { PostFormData, PostFormFields } from '../types';

export function FeedPage() {
  const { data: posts, isLoading, error } = usePosts();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const handleCreate = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleDelete = (post: Post) => {
    if (window.confirm(messages.confirm.deletePost)) {
      deletePost.mutate(post.id);
    }
  };

  const handleSubmit = (fields: PostFormFields) => {
    const avatar = editingPost?.avatar
      ? resolveAvatar(editingPost.avatar)
      : getAvatarForName(fields.name.trim());
    const data: PostFormData = { ...fields, avatar };
    if (editingPost) {
      updatePost.mutate(
        { id: editingPost.id, post: data },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingPost(null);
          },
        }
      );
    } else {
      createPost.mutate(data, {
        onSuccess: () => {
          setIsModalOpen(false);
        },
      });
    }
  };

  if (error) {
    return (
      <MainLayout>
        <p className="text-[var(--color-error)]">{messages.errors.loadPosts}</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">
          Feed
        </h1>
        <Button onClick={handleCreate}>Nuevo post</Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton variant="card" count={3} />
        </div>
      ) : (
        <div className="space-y-4">
          {posts?.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
          {posts?.length === 0 && (
            <p className="text-center text-[var(--color-text-muted)] py-12">
              {messages.empty.noPosts}
            </p>
          )}
        </div>
      )}

      <PostFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPost(null);
        }}
        post={editingPost}
        onSubmit={handleSubmit}
        isLoading={createPost.isPending || updatePost.isPending}
      />
    </MainLayout>
  );
}
