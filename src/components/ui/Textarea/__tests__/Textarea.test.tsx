import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from '../Textarea';

describe('Textarea', () => {
  it('renders textarea without label', () => {
    render(<Textarea placeholder="Enter" />);
    expect(screen.getByPlaceholderText('Enter')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Textarea label="Content" id="content" />);
    expect(screen.getByLabelText('Content')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<Textarea error="Invalid" />);
    expect(screen.getByText('Invalid')).toBeInTheDocument();
  });

  it('calls onChange when typing', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<Textarea onChange={onChange} />);
    await user.type(screen.getByRole('textbox'), 'a');
    expect(onChange).toHaveBeenCalled();
  });
});
