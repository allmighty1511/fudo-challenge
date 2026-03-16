import { Modal } from '@/components/ui/Modal';
import { PostForm } from './PostForm';
import type { Post } from '@/types';
import type { PostFormData } from '../types';

interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  post?: Post | null;
  onSubmit: (data: PostFormData) => void;
  isLoading?: boolean;
}

export function PostFormModal({
  isOpen,
  onClose,
  post,
  onSubmit,
  isLoading = false,
}: PostFormModalProps) {
  const initialData = post
    ? {
        title: post.title,
        content: post.content,
        name: post.name,
        avatar: post.avatar,
      }
    : undefined;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={post ? 'Editar post' : 'Nuevo post'}
    >
      <PostForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onClose}
        isLoading={isLoading}
      />
    </Modal>
  );
}
