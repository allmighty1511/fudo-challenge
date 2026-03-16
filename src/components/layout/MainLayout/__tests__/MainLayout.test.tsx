import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { MemoryRouter } from 'react-router-dom';
import { MainLayout } from '../MainLayout';

function renderMainLayout(children: React.ReactNode) {
  return render(
    <ThemeProvider>
      <MemoryRouter>
        <MainLayout>{children}</MainLayout>
      </MemoryRouter>
    </ThemeProvider>
  );
}

describe('MainLayout', () => {
  it('renders Header and children', () => {
    renderMainLayout(<div data-testid="child">Content</div>);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toHaveTextContent('Content');
  });
});
