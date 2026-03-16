import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PostDetailPage } from '../PostDetailPage';
import { renderWithProviders } from '@/test-utils';

jest.mock('../../hooks', () => ({
  usePost: jest.fn(),
  useUpdatePost: jest.fn(),
  useDeletePost: jest.fn(),
}));

jest.mock('@/features/comments/components/CommentTree', () => ({
  CommentTree: () => <div data-testid="comment-tree">CommentTree</div>,
}));

const { usePost, useUpdatePost, useDeletePost } = require('../../hooks');

const mockPost = {
  id: '1',
  title: 'Test Post',
  content: 'Content',
  name: 'Author',
  avatar: '',
  createdAt: '2024-01-15T10:00:00Z',
};

describe('PostDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (usePost as jest.Mock).mockReturnValue({
      data: mockPost,
      isLoading: false,
      error: null,
    });
    (useUpdatePost as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
    (useDeletePost as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
  });

  it('renders post title and content', () => {
    renderWithProviders(<PostDetailPage />, {
      initialEntries: ['/post/1'],
    });
    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    (usePost as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });
    renderWithProviders(<PostDetailPage />, {
      initialEntries: ['/post/1'],
    });
    expect(screen.getByText('DevThread')).toBeInTheDocument();
  });

  it('shows error when error', () => {
    (usePost as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed'),
    });
    renderWithProviders(<PostDetailPage />, {
      initialEntries: ['/post/1'],
    });
    expect(screen.getByText('Error al cargar el post.')).toBeInTheDocument();
  });

  it('shows not found when no post', () => {
    (usePost as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    });
    renderWithProviders(<PostDetailPage />, {
      initialEntries: ['/post/1'],
    });
    expect(screen.getByText('Post no encontrado.')).toBeInTheDocument();
  });

  it('opens edit modal when Editar clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PostDetailPage />, {
      initialEntries: ['/post/1'],
    });
    await user.click(screen.getByLabelText('Opciones'));
    await user.click(screen.getByText('Editar'));
    expect(screen.getByText('Editar post')).toBeInTheDocument();
  });

  it('does not delete when confirm cancelled', async () => {
    const user = userEvent.setup();
    window.confirm = jest.fn(() => false);
    const mutate = jest.fn();
    (useDeletePost as jest.Mock).mockReturnValue({ mutate, isPending: false });
    renderWithProviders(<PostDetailPage />, {
      initialEntries: ['/post/1'],
    });
    await user.click(screen.getByLabelText('Opciones'));
    await user.click(screen.getByText('Eliminar'));
    expect(mutate).not.toHaveBeenCalled();
  });

  it('calls deletePost with onSuccess callback', async () => {
    const user = userEvent.setup();
    window.confirm = jest.fn(() => true);
    const mutate = jest.fn((_id: string, opts?: { onSuccess?: () => void }) => {
      opts?.onSuccess?.();
    });
    (useDeletePost as jest.Mock).mockReturnValue({ mutate, isPending: false });
    renderWithProviders(<PostDetailPage />, {
      initialEntries: ['/post/1'],
    });
    await user.click(screen.getByLabelText('Opciones'));
    await user.click(screen.getByText('Eliminar'));
    expect(mutate).toHaveBeenCalledWith('1', expect.objectContaining({
      onSuccess: expect.any(Function),
    }));
  });

  it('closes edit modal on cancel', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PostDetailPage />, {
      initialEntries: ['/post/1'],
    });
    await user.click(screen.getByLabelText('Opciones'));
    await user.click(screen.getByText('Editar'));
    expect(screen.getByText('Editar post')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByText('Editar post')).not.toBeInTheDocument();
  });

  it('submits edit and closes modal', async () => {
    const user = userEvent.setup();
    const mutate = jest.fn((_data: unknown, opts?: { onSuccess?: () => void }) => {
      opts?.onSuccess?.();
    });
    (useUpdatePost as jest.Mock).mockReturnValue({ mutate, isPending: false });
    renderWithProviders(<PostDetailPage />, {
      initialEntries: ['/post/1'],
    });
    await user.click(screen.getByLabelText('Opciones'));
    await user.click(screen.getByText('Editar'));
    await user.clear(screen.getByLabelText('Título'));
    await user.type(screen.getByLabelText('Título'), 'Updated');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(mutate).toHaveBeenCalled();
    expect(screen.queryByText('Editar post')).not.toBeInTheDocument();
  });

  it('renders CommentTree', () => {
    renderWithProviders(<PostDetailPage />, {
      initialEntries: ['/post/1'],
    });
    expect(screen.getByTestId('comment-tree')).toBeInTheDocument();
  });
});
