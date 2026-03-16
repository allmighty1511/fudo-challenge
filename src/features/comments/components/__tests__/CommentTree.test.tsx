import { renderWithProviders } from '@/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommentTree } from '../CommentTree';

jest.mock('@/lib/avatars', () => ({
  getAvatarForName: (name: string) => `http://avatar/${name}`,
  resolveAvatar: (src: string) => src || 'http://default/avatar.png',
}));

jest.mock('@/components/ui/Avatar', () => ({
  Avatar: ({ alt }: { alt: string }) => <img data-testid="avatar" alt={alt} />,
}));

jest.mock('../../hooks', () => ({
  useComments: jest.fn(),
  useCreateComment: jest.fn(),
  useUpdateComment: jest.fn(),
  useDeleteComment: jest.fn(),
}));

const {
  useComments,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
} = require('../../hooks');

describe('CommentTree', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useComments as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });
    (useCreateComment as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
    (useUpdateComment as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
    (useDeleteComment as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
  });

  it('renders Comentarios heading', () => {
    renderWithProviders(<CommentTree postId="post-1" />);
    expect(screen.getByText('Comentarios')).toBeInTheDocument();
  });

  it('shows error when error', () => {
    (useComments as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: new Error('Failed'),
    });
    renderWithProviders(<CommentTree postId="post-1" />);
    expect(screen.getByText('Error al cargar los comentarios.')).toBeInTheDocument();
  });

  it('shows loading skeletons when loading', () => {
    (useComments as jest.Mock).mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
    });
    renderWithProviders(<CommentTree postId="post-1" />);
    expect(screen.getByText('Comentarios')).toBeInTheDocument();
  });

  it('shows empty message when no comments', () => {
    renderWithProviders(<CommentTree postId="post-1" />);
    expect(screen.getByText(/No hay comentarios aún/)).toBeInTheDocument();
  });

  it('shows comment count when has comments', () => {
    (useComments as jest.Mock).mockReturnValue({
      data: [
        {
          id: '1',
          content: 'Hi',
          name: 'A',
          avatar: '',
          parentId: null,
          createdAt: '',
        },
      ],
      isLoading: false,
      error: null,
    });
    renderWithProviders(<CommentTree postId="post-1" />);
    expect(screen.getByText(/Comentarios \(1\)/)).toBeInTheDocument();
  });

  it('does not submit when name or content empty', async () => {
    const user = userEvent.setup();
    const mutate = jest.fn();
    (useCreateComment as jest.Mock).mockReturnValue({
      mutate,
      isPending: false,
    });
    renderWithProviders(<CommentTree postId="post-1" />);
    await user.click(screen.getByRole('button', { name: 'Comentar' }));
    expect(mutate).not.toHaveBeenCalled();
  });

  it('submits new comment when form filled', async () => {
    const user = userEvent.setup();
    const mutate = jest.fn((_data: unknown, opts?: { onSuccess?: () => void }) => {
      opts?.onSuccess?.();
    });
    (useCreateComment as jest.Mock).mockReturnValue({
      mutate,
      isPending: false,
    });
    renderWithProviders(<CommentTree postId="post-1" />);
    await user.type(screen.getByPlaceholderText('Tu nombre'), 'John');
    await user.type(screen.getByPlaceholderText('Escribe un comentario...'), 'Hello');
    await user.click(screen.getByRole('button', { name: 'Comentar' }));
    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        content: 'Hello',
        name: 'John',
        parentId: null,
      }),
      expect.any(Object)
    );
    expect(screen.getByPlaceholderText('Escribe un comentario...')).toHaveValue('');
  });

  it('submits new comment on Enter key', async () => {
    const user = userEvent.setup();
    const mutate = jest.fn((_data: unknown, opts?: { onSuccess?: () => void }) => {
      opts?.onSuccess?.();
    });
    (useCreateComment as jest.Mock).mockReturnValue({
      mutate,
      isPending: false,
    });
    renderWithProviders(<CommentTree postId="post-1" />);
    await user.type(screen.getByPlaceholderText('Tu nombre'), 'Jane');
    await user.type(screen.getByPlaceholderText('Escribe un comentario...'), 'Hi{Enter}');
    expect(mutate).toHaveBeenCalled();
  });
});
