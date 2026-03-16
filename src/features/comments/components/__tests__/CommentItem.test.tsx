import React from 'react';
import { renderWithProviders } from '@/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { CommentActionsValue } from '../../contexts/CommentActionsContext';
import { CommentItem } from '../CommentItem';
import { CommentActionsProvider } from '../../contexts/CommentActionsContext';

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

function createMockActions(callOnSuccess = false): CommentActionsValue {
  return {
    onReply: jest.fn((_parentId, _data, opts) => {
      if (callOnSuccess) opts?.onSuccess?.();
    }),
    onEdit: jest.fn((_commentId, _content, opts) => {
      if (callOnSuccess) opts?.onSuccess?.();
    }),
    onDelete: jest.fn(),
    isReplying: false,
    isEditing: false,
  };
}

interface RenderOptions extends Partial<React.ComponentProps<typeof CommentItem>> {
  commentActions?: CommentActionsValue;
}

function renderCommentItem(options: RenderOptions = {}) {
  const { commentActions = createMockActions(), ...props } = options;
  const defaultProps = {
    comment: mockComment,
    postId: 'post-1',
    ...props,
  };
  return renderWithProviders(
    <CommentActionsProvider value={commentActions}>
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

  it('calls onDelete when Eliminar clicked', async () => {
    const user = userEvent.setup();
    window.confirm = jest.fn(() => true);
    const commentActions = createMockActions();
    renderCommentItem({ commentActions });
    await user.click(screen.getByLabelText('Opciones'));
    await user.click(screen.getByText('Eliminar'));
    expect(commentActions.onDelete).toHaveBeenCalledWith('1', false);
  });

  it('does not submit reply when name or content empty', async () => {
    const user = userEvent.setup();
    const commentActions = createMockActions();
    renderCommentItem({ commentActions });
    await user.click(screen.getByRole('button', { name: 'Responder' }));
    await user.click(screen.getByRole('button', { name: 'Responder' }));
    expect(commentActions.onReply).not.toHaveBeenCalled();
  });

  it('submits reply when form filled and clears form on success', async () => {
    const user = userEvent.setup();
    const commentActions = createMockActions(true);
    renderCommentItem({ commentActions });
    await user.click(screen.getByRole('button', { name: 'Responder' }));
    await user.type(screen.getByPlaceholderText('Tu nombre'), 'Jane');
    await user.type(screen.getByPlaceholderText('Escribe tu respuesta...'), 'Reply text');
    await user.click(screen.getByRole('button', { name: 'Responder' }));
    expect(commentActions.onReply).toHaveBeenCalledWith(
      '1',
      { content: 'Reply text', name: 'Jane' },
      expect.objectContaining({ onSuccess: expect.any(Function) })
    );
    expect(screen.queryByPlaceholderText('Escribe tu respuesta...')).not.toBeInTheDocument();
  });

  it('submits edit when content changed', async () => {
    const user = userEvent.setup();
    const commentActions = createMockActions(true);
    renderCommentItem({ commentActions });
    await user.click(screen.getByLabelText('Opciones'));
    await user.click(screen.getByText('Editar'));
    await user.clear(screen.getByDisplayValue('Test comment'));
    await user.type(screen.getByDisplayValue(''), 'Edited');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(commentActions.onEdit).toHaveBeenCalledWith(
      '1',
      'Edited',
      expect.objectContaining({ onSuccess: expect.any(Function) })
    );
  });

  it('exits edit mode without mutating when content unchanged', async () => {
    const user = userEvent.setup();
    const commentActions = createMockActions();
    renderCommentItem({ commentActions });
    await user.click(screen.getByLabelText('Opciones'));
    await user.click(screen.getByText('Editar'));
    await user.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(commentActions.onEdit).not.toHaveBeenCalled();
    expect(screen.getByText('Test comment')).toBeInTheDocument();
  });

  it('submits edit on Enter key in textarea', async () => {
    const user = userEvent.setup();
    const commentActions = createMockActions(true);
    renderCommentItem({ commentActions });
    await user.click(screen.getByLabelText('Opciones'));
    await user.click(screen.getByText('Editar'));
    await user.clear(screen.getByDisplayValue('Test comment'));
    await user.type(screen.getByDisplayValue(''), 'New{Enter}');
    expect(commentActions.onEdit).toHaveBeenCalled();
  });

  it('submits reply on Enter key in textarea', async () => {
    const user = userEvent.setup();
    const commentActions = createMockActions(true);
    renderCommentItem({ commentActions });
    await user.click(screen.getByRole('button', { name: 'Responder' }));
    await user.type(screen.getByPlaceholderText('Tu nombre'), 'X');
    await user.type(screen.getByPlaceholderText('Escribe tu respuesta...'), 'R{Enter}');
    expect(commentActions.onReply).toHaveBeenCalled();
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

  it('calls onDelete with hasReplies when comment has replies', async () => {
    const user = userEvent.setup();
    window.confirm = jest.fn(() => true);
    const commentActions = createMockActions();
    const commentWithReplies = {
      ...mockComment,
      replies: [{ ...mockComment, id: '2', parentId: '1', replies: [] }],
    };
    renderCommentItem({ comment: commentWithReplies, commentActions });
    await user.click(screen.getAllByLabelText('Opciones')[0]!);
    await user.click(screen.getByText('Eliminar'));
    expect(commentActions.onDelete).toHaveBeenCalledWith('1', true);
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

  it('calls onDelete when Eliminar clicked even when confirm would cancel', async () => {
    const user = userEvent.setup();
    window.confirm = jest.fn(() => false);
    const commentActions = createMockActions();
    renderCommentItem({ commentActions });
    await user.click(screen.getByLabelText('Opciones'));
    await user.click(screen.getByText('Eliminar'));
    expect(commentActions.onDelete).toHaveBeenCalledWith('1', false);
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
