import { render, screen } from '@testing-library/react';
import { Avatar } from '../Avatar';

jest.mock('@/lib/avatars', () => ({
  getInitials: (name: string) => (name === 'John Doe' ? 'JD' : name[0] ?? '?'),
  getAvatarColorFromName: () => '#6366f1',
}));

describe('Avatar', () => {
  it('renders initials from name', () => {
    render(<Avatar alt="John Doe" />);
    const el = screen.getByRole('img', { name: 'John Doe' });
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('JD');
  });

  it('uses md size by default', () => {
    render(<Avatar alt="User" />);
    const el = screen.getByRole('img', { name: 'User' });
    expect(el).toHaveClass('w-10', 'h-10');
  });

  it('uses sm size when specified', () => {
    render(<Avatar alt="User" size="sm" />);
    const el = screen.getByRole('img', { name: 'User' });
    expect(el).toHaveClass('w-8', 'h-8');
  });

  it('uses lg size when specified', () => {
    render(<Avatar alt="User" size="lg" />);
    const el = screen.getByRole('img', { name: 'User' });
    expect(el).toHaveClass('w-12', 'h-12');
  });

  it('applies custom className', () => {
    render(<Avatar alt="User" className="custom-class" />);
    const el = screen.getByRole('img', { name: 'User' });
    expect(el).toHaveClass('custom-class');
  });

  it('renders img for external URL', () => {
    render(<Avatar src="https://example.com/photo.jpg" alt="User" />);
    const img = screen.getByRole('img', { name: 'User' });
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });
});
