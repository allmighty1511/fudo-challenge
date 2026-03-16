import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PostForm } from '../PostForm';

describe('PostForm', () => {
  it('renders form fields', () => {
    render(<PostForm onSubmit={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByLabelText('Título')).toBeInTheDocument();
    expect(screen.getByLabelText('Contenido')).toBeInTheDocument();
    expect(screen.getByLabelText('Tu nombre')).toBeInTheDocument();
  });

  it('calls onCancel when Cancelar clicked', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    render(<PostForm onSubmit={jest.fn()} onCancel={onCancel} />);
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onCancel).toHaveBeenCalled();
  });

  it('calls onSubmit with form fields without avatar', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<PostForm onSubmit={onSubmit} onCancel={jest.fn()} />);
    await user.type(screen.getByLabelText('Título'), 'My Title');
    await user.type(screen.getByLabelText('Contenido'), 'My content');
    await user.type(screen.getByLabelText('Tu nombre'), 'John');
    await user.click(screen.getByRole('button', { name: 'Publicar' }));
    expect(onSubmit).toHaveBeenCalledWith({
      title: 'My Title',
      content: 'My content',
      name: 'John',
    });
  });

  it('shows Guardar when editing', () => {
    render(
      <PostForm
        initialData={{ title: 'T', content: 'C', name: 'N' }}
        onSubmit={jest.fn()}
        onCancel={jest.fn()}
      />
    );
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument();
  });
});
