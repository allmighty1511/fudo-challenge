import { render, screen } from '@testing-library/react';
import App from '../App';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  RouterProvider: () => <div data-testid="router">Router</div>,
}));

describe('App', () => {
  it('renders router', () => {
    render(<App />);
    expect(screen.getByTestId('router')).toBeInTheDocument();
  });
});
