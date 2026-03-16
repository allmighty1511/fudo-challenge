import { render, screen, renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from '../ThemeContext';

function TestConsumer() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

interface WindowWithMatchMedia extends Window {
  matchMedia: (query: string) => MediaQueryList;
}

describe('ThemeContext', () => {
  it('provides dark theme when prefers-color-scheme dark', () => {
    const originalMatchMedia = window.matchMedia;
    (window as WindowWithMatchMedia).matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })) as unknown as (query: string) => MediaQueryList;
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });
    expect(result.current.theme).toBe('dark');
    (window as WindowWithMatchMedia).matchMedia = originalMatchMedia;
  });

  it('provides theme and toggleTheme', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme')).toHaveTextContent(/light|dark/);
    expect(screen.getByRole('button', { name: 'Toggle' })).toBeInTheDocument();
  });

  it('toggles from dark to light', async () => {
    const user = userEvent.setup();
    (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    await user.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  it('toggles theme when button clicked', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );
    const themeEl = screen.getByTestId('theme');
    const initial = themeEl.textContent;
    await user.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(themeEl.textContent).not.toBe(initial);
  });

  it('throws when useTheme used outside provider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(
      'useTheme must be used within ThemeProvider'
    );
    consoleSpy.mockRestore();
  });
});
