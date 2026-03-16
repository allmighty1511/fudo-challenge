import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PostFormModal } from '../PostFormModal';

describe('PostFormModal', () => {
  it('renders Nuevo post title when no post', () => {
    render(
      <PostFormModal
        isOpen={true}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
      />
    );
    expect(screen.getByText('Nuevo post')).toBeInTheDocument();
  });

  it('renders Editar post title when editing', () => {
    const post = {
      id: '1',
      title: 'T',
      content: 'C',
      name: 'N',
      avatar: '',
      createdAt: '',
    };
    render(
      <PostFormModal
        isOpen={true}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
        post={post}
      />
    );
    expect(screen.getByText('Editar post')).toBeInTheDocument();
  });

  it('calls onSubmit when form submitted', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(
      <PostFormModal
        isOpen={true}
        onClose={jest.fn()}
        onSubmit={onSubmit}
      />
    );
    await user.type(screen.getByLabelText('Título'), 'Title');
    await user.type(screen.getByLabelText('Contenido'), 'Content');
    await user.type(screen.getByLabelText('Tu nombre'), 'Name');
    await user.click(screen.getByRole('button', { name: 'Publicar' }));
    expect(onSubmit).toHaveBeenCalled();
  });
});
