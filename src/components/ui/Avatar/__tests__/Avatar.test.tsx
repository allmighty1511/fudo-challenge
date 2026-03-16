import { render, screen } from '@testing-library/react';
import { Avatar } from '../Avatar';

jest.mock('@/lib/avatars', () => ({
  resolveAvatar: () => 'http://default/avatar.png',
}));

describe('Avatar', () => {
  it('renders img with resolved src', () => {
    render(<Avatar src="/avatars/avatar1.svg" alt="User" />);
    const img = screen.getByRole('img', { name: 'User' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'http://default/avatar.png');
  });

  it('uses md size by default', () => {
    render(<Avatar src="x" alt="User" />);
    const img = screen.getByRole('img');
    expect(img).toHaveClass('w-10', 'h-10');
  });

  it('uses sm size when specified', () => {
    render(<Avatar src="x" alt="User" size="sm" />);
    const img = screen.getByRole('img');
    expect(img).toHaveClass('w-8', 'h-8');
  });

  it('uses lg size when specified', () => {
    render(<Avatar src="x" alt="User" size="lg" />);
    const img = screen.getByRole('img');
    expect(img).toHaveClass('w-12', 'h-12');
  });

  it('applies custom className', () => {
    render(<Avatar src="x" alt="User" className="custom-class" />);
    const img = screen.getByRole('img');
    expect(img).toHaveClass('custom-class');
  });
});
