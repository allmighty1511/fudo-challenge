import { render, screen } from '@testing-library/react';
import { Card } from '../Card';

describe('Card', () => {
  it('renders as div by default', () => {
    render(<Card>Content</Card>);
    const el = screen.getByText('Content');
    expect(el.tagName).toBe('DIV');
  });

  it('renders as article when as="article"', () => {
    render(<Card as="article">Content</Card>);
    const el = screen.getByText('Content');
    expect(el.tagName).toBe('ARTICLE');
  });

  it('renders as section when as="section"', () => {
    render(<Card as="section">Content</Card>);
    const el = screen.getByText('Content');
    expect(el.tagName).toBe('SECTION');
  });

  it('applies custom className', () => {
    render(<Card className="custom-class">Content</Card>);
    const el = screen.getByText('Content');
    expect(el).toHaveClass('custom-class');
  });
});
