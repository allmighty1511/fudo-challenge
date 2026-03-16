import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FeedPage } from '../FeedPage';
import { renderWithProviders } from '@/test-utils';

jest.mock('../../hooks', () => ({
  usePosts: jest.fn(),
  useCreatePost: jest.fn(),
  useUpdatePost: jest.fn(),
  useDeletePost: jest.fn(),
}));

const {
  usePosts,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
} = require('../../hooks');

describe('FeedPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (usePosts as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });
    (useCreatePost as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
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

  it('renders Feed heading', () => {
    renderWithProviders(<FeedPage />);
    expect(screen.getByText('Feed')).toBeInTheDocument();
  });

  it('renders Nuevo post button', () => {
    renderWithProviders(<FeedPage />);
    expect(screen.getByRole('button', { name: 'Nuevo post' })).toBeInTheDocument();
  });

  it('shows error when error', () => {
    (usePosts as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed'),
    });
    renderWithProviders(<FeedPage />);
    expect(screen.getByText('Error al cargar los posts.')).toBeInTheDocument();
  });

  it('shows empty message when no posts', () => {
    renderWithProviders(<FeedPage />);
    expect(screen.getByText(/No hay posts aún/)).toBeInTheDocument();
  });

  it('opens modal when Nuevo post clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<FeedPage />);
    await user.click(screen.getByRole('button', { name: 'Nuevo post' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('calls createPost and closes modal on success', async () => {
    const user = userEvent.setup();
    const mutate = jest.fn((_data: unknown, opts?: { onSuccess?: () => void }) => {
      opts?.onSuccess?.();
    });
    (useCreatePost as jest.Mock).mockReturnValue({
      mutate,
      isPending: false,
    });
    renderWithProviders(<FeedPage />);
    await user.click(screen.getByRole('button', { name: 'Nuevo post' }));
    await user.type(screen.getByLabelText('Título'), 'New Title');
    await user.type(screen.getByLabelText('Contenido'), 'New content');
    await user.type(screen.getByLabelText('Tu nombre'), 'Author');
    await user.click(screen.getByRole('button', { name: 'Publicar' }));
    expect(mutate).toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows loading skeletons', () => {
    (usePosts as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });
    renderWithProviders(<FeedPage />);
    expect(screen.getByText('Feed')).toBeInTheDocument();
  });

  it('opens edit modal and calls updatePost when editing', async () => {
    const user = userEvent.setup();
    const mutate = jest.fn((_data: unknown, opts?: { onSuccess?: () => void }) => {
      opts?.onSuccess?.();
    });
    (usePosts as jest.Mock).mockReturnValue({
      data: [
        {
          id: '1',
          title: 'Post 1',
          content: 'Content',
          name: 'Author',
          avatar: '',
          createdAt: '',
        },
      ],
      isLoading: false,
      error: null,
    });
    (useUpdatePost as jest.Mock).mockReturnValue({ mutate, isPending: false });
    renderWithProviders(<FeedPage />);
    await user.click(screen.getByLabelText('Opciones'));
    await user.click(screen.getByText('Editar'));
    await user.clear(screen.getByLabelText('Título'));
    await user.type(screen.getByLabelText('Título'), 'Updated');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1', post: expect.objectContaining({ title: 'Updated' }) }),
      expect.any(Object)
    );
  });

  it('does not delete when confirm cancelled', async () => {
    const user = userEvent.setup();
    window.confirm = jest.fn(() => false);
    const mutate = jest.fn();
    (usePosts as jest.Mock).mockReturnValue({
      data: [{ id: '1', title: 'P', content: 'C', name: 'N', avatar: '', createdAt: '' }],
      isLoading: false,
      error: null,
    });
    (useDeletePost as jest.Mock).mockReturnValue({ mutate, isPending: false });
    renderWithProviders(<FeedPage />);
    await user.click(screen.getByLabelText('Opciones'));
    await user.click(screen.getByText('Eliminar'));
    expect(mutate).not.toHaveBeenCalled();
  });

  it('calls deletePost when delete confirmed', async () => {
    const user = userEvent.setup();
    window.confirm = jest.fn(() => true);
    const mutate = jest.fn();
    (usePosts as jest.Mock).mockReturnValue({
      data: [
        {
          id: '1',
          title: 'Post 1',
          content: 'Content',
          name: 'Author',
          avatar: '',
          createdAt: '',
        },
      ],
      isLoading: false,
      error: null,
    });
    (useDeletePost as jest.Mock).mockReturnValue({ mutate, isPending: false });
    renderWithProviders(<FeedPage />);
    await user.click(screen.getByLabelText('Opciones'));
    await user.click(screen.getByText('Eliminar'));
    expect(mutate).toHaveBeenCalledWith('1');
  });

  it('closes modal on cancel', async () => {
    const user = userEvent.setup();
    renderWithProviders(<FeedPage />);
    await user.click(screen.getByRole('button', { name: 'Nuevo post' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders posts when data available', () => {
    (usePosts as jest.Mock).mockReturnValue({
      data: [
        {
          id: '1',
          title: 'Post 1',
          content: 'Content',
          name: 'Author',
          avatar: '',
          createdAt: '',
        },
      ],
      isLoading: false,
      error: null,
    });
    renderWithProviders(<FeedPage />);
    expect(screen.getByText('Post 1')).toBeInTheDocument();
  });
});
