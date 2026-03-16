import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { MemoryRouter } from 'react-router-dom';
import { Header } from '../Header';

function renderHeader() {
  return render(
    <ThemeProvider>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </ThemeProvider>
  );
}

describe('Header', () => {
  it('renders DevThread link', () => {
    renderHeader();
    const link = screen.getByRole('link', { name: 'DevThread' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('has theme toggle button', async () => {
    const user = userEvent.setup();
    renderHeader();
    const btn = screen.getByRole('button', {
      name: /Cambiar a modo oscuro|Cambiar a modo claro/,
    });
    expect(btn).toBeInTheDocument();
    await user.click(btn);
    expect(btn).toHaveAttribute(
      'aria-label',
      expect.stringMatching(/Cambiar a modo/)
    );
  });
});
