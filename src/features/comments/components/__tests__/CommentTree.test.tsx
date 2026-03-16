import { renderWithProviders } from '@/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommentTree } from '../CommentTree';
import { CommentActionsProvider } from '../../contexts/CommentActionsContext';

jest.mock('@/components/ui/Avatar', () => ({
  Avatar: ({ alt }: { alt: string }) => <img data-testid="avatar" alt={alt} />,
}));

const mockCommentActions = {
  onReply: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  isReplying: false,
  isEditing: false,
};

const defaultProps = {
  tree: [],
  commentCount: 0,
  isLoading: false,
  error: false,
  newCommentName: '',
  newCommentContent: '',
  onNewCommentNameChange: jest.fn(),
  onNewCommentContentChange: jest.fn(),
  onSubmitNew: jest.fn(),
  isSubmitting: false,
  postId: 'post-1',
};

function renderCommentTree(props = {}) {
  return renderWithProviders(
    <CommentActionsProvider value={mockCommentActions}>
      <CommentTree {...defaultProps} {...props} />
    </CommentActionsProvider>
  );
}

describe('CommentTree', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Comentarios heading', () => {
    renderCommentTree();
    expect(screen.getByText('Comentarios')).toBeInTheDocument();
  });

  it('shows error when error', () => {
    renderCommentTree({ error: true });
    expect(screen.getByText('Error al cargar los comentarios.')).toBeInTheDocument();
  });

  it('shows loading skeletons when loading', () => {
    renderCommentTree({ isLoading: true });
    expect(screen.getByText('Comentarios')).toBeInTheDocument();
  });

  it('shows empty message when no comments', () => {
    renderCommentTree();
    expect(screen.getByText(/No hay comentarios aún/)).toBeInTheDocument();
  });

  it('shows comment count when has comments', () => {
    renderCommentTree({
      tree: [
        {
          id: '1',
          content: 'Hi',
          name: 'A',
          avatar: '',
          parentId: null,
          createdAt: '',
          replies: [],
        },
      ],
      commentCount: 1,
    });
    expect(screen.getByText(/Comentarios \(1\)/)).toBeInTheDocument();
  });

  it('calls onSubmitNew when form filled and button clicked', async () => {
    const user = userEvent.setup();
    const onSubmitNew = jest.fn();
    const onNewCommentNameChange = jest.fn();
    const onNewCommentContentChange = jest.fn();
    renderCommentTree({
      onSubmitNew,
      onNewCommentNameChange,
      onNewCommentContentChange,
    });
    await user.type(screen.getByPlaceholderText('Tu nombre'), 'John');
    await user.type(screen.getByPlaceholderText('Escribe un comentario...'), 'Hello');
    await user.click(screen.getByRole('button', { name: 'Comentar' }));
    expect(onSubmitNew).toHaveBeenCalled();
  });

  it('calls onSubmitNew on Enter key', async () => {
    const user = userEvent.setup();
    const onSubmitNew = jest.fn();
    renderCommentTree({ onSubmitNew });
    await user.type(screen.getByPlaceholderText('Tu nombre'), 'Jane');
    await user.type(screen.getByPlaceholderText('Escribe un comentario...'), 'Hi{Enter}');
    expect(onSubmitNew).toHaveBeenCalled();
  });
});
