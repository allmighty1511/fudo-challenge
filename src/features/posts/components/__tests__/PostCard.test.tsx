import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { PostCard } from '../PostCard';

const mockPost = {
  id: '1',
  title: 'Test Post',
  content: 'Content of the post that is long enough',
  name: 'Author',
  avatar: '/avatars/avatar1.svg',
  createdAt: '2024-01-15T10:00:00Z',
};

describe('PostCard', () => {
  it('renders post title and content', () => {
    render(
      <MemoryRouter>
        <PostCard post={mockPost} onEdit={jest.fn()} onDelete={jest.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText(/Content of the post/)).toBeInTheDocument();
  });

  it('calls onEdit when Edit clicked', async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();
    render(
      <MemoryRouter>
        <PostCard post={mockPost} onEdit={onEdit} onDelete={jest.fn()} />
      </MemoryRouter>
    );
    await user.click(screen.getByLabelText('Opciones'));
    await user.click(screen.getByText('Editar'));
    expect(onEdit).toHaveBeenCalledWith(mockPost);
  });

  it('calls onDelete when Eliminar clicked', async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();
    window.confirm = jest.fn(() => true);
    render(
      <MemoryRouter>
        <PostCard post={mockPost} onEdit={jest.fn()} onDelete={onDelete} />
      </MemoryRouter>
    );
    await user.click(screen.getByLabelText('Opciones'));
    await user.click(screen.getByText('Eliminar'));
    expect(onDelete).toHaveBeenCalledWith(mockPost);
  });

  it('truncates long content with ellipsis', () => {
    const longPost = {
      ...mockPost,
      content: 'a'.repeat(200),
    };
    render(
      <MemoryRouter>
        <PostCard post={longPost} onEdit={jest.fn()} onDelete={jest.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByText(/\.\.\.$/)).toBeInTheDocument();
  });

  it('has link to post detail', () => {
    render(
      <MemoryRouter>
        <PostCard post={mockPost} onEdit={jest.fn()} onDelete={jest.fn()} />
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: /Test Post/ });
    expect(link).toHaveAttribute('href', '/post/1');
  });
});
