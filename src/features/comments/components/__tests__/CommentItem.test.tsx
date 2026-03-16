import React from 'react';
import { renderWithProviders } from '@/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UseMutationResult } from '@tanstack/react-query';
import { CommentItem } from '../CommentItem';
import { CommentActionsProvider } from '../../contexts/CommentActionsContext';

jest.mock('@/lib/avatars', () => ({
  getAvatarForName: (name: string) => `http://avatar/${name}`,
  resolveAvatar: (src: string) => src || 'http://default/avatar.png',
}));

jest.mock('@/components/ui/Avatar', () => ({
  Avatar: ({ alt }: { alt: string }) => <img data-testid="avatar" alt={alt} />,
}));

const mockComment = {
  id: '1',
  content: 'Test comment',
  name: 'Author',
  avatar: '/avatars/avatar1.svg',
  parentId: null,
  createdAt: '2024-01-15T10:00:00Z',
  replies: [],
};

function createMockMutation(callOnSuccess = false): Partial<
  UseMutationResult<unknown, Error, unknown, unknown>
> {
  return {
    mutate: jest.fn((...args: unknown[]) => {
      if (callOnSuccess && args[1] && typeof args[1] === 'object' && 'onSuccess' in args[1]) {
        (args[1] as { onSuccess?: () => void }).onSuccess?.();
      }
    }),
    isPending: false,
    data: undefined,
    error: null,
    isError: false,
    isSuccess: false,
    isIdle: true,
    status: 'idle',
    variables: undefined,
    context: undefined,
    failureCount: 0,
    isPaused: false,
    submittedAt: 0,
    reset: jest.fn(),
  };
}

interface RenderOptions extends Partial<React.ComponentProps<typeof CommentItem>> {
  createComment?: ReturnType<typeof createMockMutation>;
  updateComment?: ReturnType<typeof createMockMutation>;
  deleteComment?: ReturnType<typeof createMockMutation>;
}

function renderCommentItem(options: RenderOptions = {}) {
  const {
    createComment: createCommentOpt,
    updateComment: updateCommentOpt,
    deleteComment: deleteCommentOpt,
    ...props
  } = options;
  const createComment = createCommentOpt ?? createMockMutation();
  const updateComment = updateCommentOpt ?? createMockMutation();
  const deleteComment = deleteCommentOpt ?? createMockMutation();
  const defaultProps = {
    comment: mockComment,
    postId: 'post-1',
    ...props,
  };
  return renderWithProviders(
    <CommentActionsProvider
      value={{
        createComment: createComment as ReturnType<typeof import('../../hooks/useCreateComment').useCreateComment>,
        updateComment: updateComment as ReturnType<typeof import('../../hooks/useUpdateComment').useUpdateComment>,
        deleteComment: deleteComment as ReturnType<typeof import('../../hooks/useDeleteComment').useDeleteComment>,
      }}
    >
      <CommentItem {...defaultProps} />
    </CommentActionsProvider>
  );
}

describe('CommentItem', () => {
  it('renders comment content and author', () => {
    renderCommentItem();
    expect(screen.getByText('Test comment')).toBeInTheDocument();
    expect(screen.getByText('Author')).toBeInTheDocument();
  });

  it('shows Responder button', () => {
    renderCommentItem();
    expect(screen.getByRole('button', { name: 'Responder' })).toBeInTheDocument();
  });

  it('shows reply form when Responder clicked', async () => {
    const user = userEvent.setup();
    renderCommentItem();
    await user.click(screen.getByRole('button', { name: 'Responder' }));
    expect(screen.getByPlaceholderText('Escribe tu respuesta...')).toBeInTheDocument();
  });

  it('shows Cancelar when replying', async () => {
    const user = userEvent.setup();
    renderCommentItem();
    await user.click(screen.getByRole('button', { name: 'Responder' }));
    expect(screen.getAllByRole('button', { name: 'Cancelar' }).length).toBeGreaterThan(0);
  });

  it('shows Editar in dropdown', async () => {
    const user = userEvent.setup();
    renderCommentItem();
    await user.click(screen.getByLabelText('Opciones'));
    expect(screen.getByText('Editar')).toBeInTheDocument();
  });

  it('enters edit mode when Editar clicked', async () => {
    const user = userEvent.setup();
    renderCommentItem();
    await user.click(screen.getByLabelText('Opciones'));
    await user.click(screen.getByText('Editar'));
    expect(screen.getByDisplayValue('Test comment')).toBeInTheDocument();
  });

  it('calls deleteComment when Eliminar confirmed', async () => {
    const user = userEvent.setup();
    window.confirm = jest.fn(() => true);
    const deleteComment = createMockMutation();
    renderCommentItem({ deleteComment });
    await user.click(screen.getByLabelText('Opciones'));
    await user.click(screen.getByText('Eliminar'));
    expect(deleteComment.mutate).toHaveBeenCalledWith('1');
  });

  it('does not submit reply when name or content empty', async () => {
    const user = userEvent.setup();
    const createComment = createMockMutation();
    renderCommentItem({ createComment });
    await user.click(screen.getByRole('button', { name: 'Responder' }));
    await user.click(screen.getByRole('button', { name: 'Responder' }));
    expect(createComment.mutate).not.toHaveBeenCalled();
  });

  it('submits reply when form filled and clears form on success', async () => {
    const user = userEvent.setup();
    const createComment = createMockMutation(true);
    renderCommentItem({ createComment });
    await user.click(screen.getByRole('button', { name: 'Responder' }));
    await user.type(screen.getByPlaceholderText('Tu nombre'), 'Jane');
    await user.type(screen.getByPlaceholderText('Escribe tu respuesta...'), 'Reply text');
    await user.click(screen.getByRole('button', { name: 'Responder' }));
    expect(createComment.mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        content: 'Reply text',
        name: 'Jane',
        parentId: '1',
      }),
      expect.any(Object)
    );
    expect(screen.queryByPlaceholderText('Escribe tu respuesta...')).not.toBeInTheDocument();
  });

  it('submits edit when content changed', async () => {
    const user = userEvent.setup();
    const updateComment = createMockMutation(true);
    renderCommentItem({ updateComment });
    await user.click(screen.getByLabelText('Opciones'));
    await user.click(screen.getByText('Editar'));
    await user.clear(screen.getByDisplayValue('Test comment'));
    await user.type(screen.getByDisplayValue(''), 'Edited');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(updateComment.mutate).toHaveBeenCalledWith(
      { commentId: '1', comment: { content: 'Edited' } },
      expect.any(Object)
    );
  });

  it('exits edit mode without mutating when content unchanged', async () => {
    const user = userEvent.setup();
    const updateComment = createMockMutation();
    renderCommentItem({ updateComment });
    await user.click(screen.getByLabelText('Opciones'));
    await user.click(screen.getByText('Editar'));
    await user.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(updateComment.mutate).not.toHaveBeenCalled();
    expect(screen.getByText('Test comment')).toBeInTheDocument();
  });

  it('submits edit on Enter key in textarea', async () => {
    const user = userEvent.setup();
    const updateComment = createMockMutation(true);
    renderCommentItem({ updateComment });
    await user.click(screen.getByLabelText('Opciones'));
    await user.click(screen.getByText('Editar'));
    await user.clear(screen.getByDisplayValue('Test comment'));
    await user.type(screen.getByDisplayValue(''), 'New{Enter}');
    expect(updateComment.mutate).toHaveBeenCalled();
  });

  it('submits reply on Enter key in textarea', async () => {
    const user = userEvent.setup();
    const createComment = createMockMutation(true);
    renderCommentItem({ createComment });
    await user.click(screen.getByRole('button', { name: 'Responder' }));
    await user.type(screen.getByPlaceholderText('Tu nombre'), 'X');
    await user.type(screen.getByPlaceholderText('Escribe tu respuesta...'), 'R{Enter}');
    expect(createComment.mutate).toHaveBeenCalled();
  });

  it('cancels reply form', async () => {
    const user = userEvent.setup();
    renderCommentItem();
    await user.click(screen.getByRole('button', { name: 'Responder' }));
    await user.type(screen.getByPlaceholderText('Tu nombre'), 'X');
    await user.type(screen.getByPlaceholderText('Escribe tu respuesta...'), 'Y');
    const cancelBtns = screen.getAllByRole('button', { name: 'Cancelar' });
    await user.click(cancelBtns[cancelBtns.length - 1]!);
    expect(screen.queryByPlaceholderText('Escribe tu respuesta...')).not.toBeInTheDocument();
  });

  it('shows delete with replies message when comment has replies', async () => {
    const user = userEvent.setup();
    window.confirm = jest.fn(() => true);
    const deleteComment = createMockMutation();
    const commentWithReplies = {
      ...mockComment,
      replies: [{ ...mockComment, id: '2', parentId: '1', replies: [] }],
    };
    renderCommentItem({ comment: commentWithReplies, deleteComment });
    await user.click(screen.getAllByLabelText('Opciones')[0]!);
    await user.click(screen.getByText('Eliminar'));
    expect(window.confirm).toHaveBeenCalledWith(
      expect.stringContaining('Eliminar este comentario')
    );
    expect(deleteComment.mutate).toHaveBeenCalledWith('1');
  });

  it('applies indent for nested depth', () => {
    renderCommentItem({ depth: 2 });
    const container = document.querySelector('[style*="margin"]');
    expect(container).toBeTruthy();
    expect(container?.getAttribute('style')).toContain('40px');
  });

  it('cancels edit and restores content', async () => {
    const user = userEvent.setup();
    renderCommentItem();
    await user.click(screen.getByLabelText('Opciones'));
    await user.click(screen.getByText('Editar'));
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.getByText('Test comment')).toBeInTheDocument();
  });

  it('does not call delete when confirm cancelled', async () => {
    const user = userEvent.setup();
    window.confirm = jest.fn(() => false);
    const deleteComment = createMockMutation();
    renderCommentItem({ deleteComment });
    await user.click(screen.getByLabelText('Opciones'));
    await user.click(screen.getByText('Eliminar'));
    expect(deleteComment.mutate).not.toHaveBeenCalled();
  });

  it('renders replies', () => {
    const commentWithReplies = {
      ...mockComment,
      replies: [
        {
          ...mockComment,
          id: '2',
          content: 'Reply',
          parentId: '1',
          replies: [],
        },
      ],
    };
    renderCommentItem({ comment: commentWithReplies });
    expect(screen.getByText('Reply')).toBeInTheDocument();
  });
});
