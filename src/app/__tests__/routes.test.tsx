import { render, screen } from '@testing-library/react';
import { createMemoryRouter, Navigate, RouterProvider } from 'react-router-dom';
import { FeedPage } from '@/features/posts/pages/FeedPage';
import { PostDetailPage } from '@/features/posts/pages/PostDetailPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';

jest.mock('@/features/posts/hooks', () => ({
  usePosts: () => ({ data: [], isLoading: false, error: null }),
  usePost: () => ({
    data: { id: '1', title: 'T', content: 'C', name: 'N', avatar: '', createdAt: '' },
    isLoading: false,
    error: null,
  }),
  useCreatePost: () => ({ mutate: jest.fn(), isPending: false }),
  useUpdatePost: () => ({ mutate: jest.fn(), isPending: false }),
  useDeletePost: () => ({ mutate: jest.fn(), isPending: false }),
}));

jest.mock('@/features/comments/hooks', () => ({
  useComments: () => ({ data: [], isLoading: false, error: null }),
  useCreateComment: () => ({ mutate: jest.fn(), isPending: false }),
  useUpdateComment: () => ({ mutate: jest.fn(), isPending: false }),
  useDeleteComment: () => ({ mutate: jest.fn(), isPending: false }),
}));

const routes = [
  { path: '/', element: <FeedPage /> },
  { path: '/post/:id', element: <PostDetailPage /> },
  { path: '*', element: <Navigate to="/" replace /> },
];

function Wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

describe('routes', () => {
  it('renders FeedPage at /', () => {
    const memoryRouter = createMemoryRouter(routes, {
      initialEntries: ['/'],
    });
    render(
      <Wrapper>
        <RouterProvider router={memoryRouter} />
      </Wrapper>
    );
    expect(screen.getByText('Feed')).toBeInTheDocument();
  });

  it('renders PostDetailPage at /post/:id', () => {
    const memoryRouter = createMemoryRouter(routes, {
      initialEntries: ['/post/1'],
    });
    render(
      <Wrapper>
        <RouterProvider router={memoryRouter} />
      </Wrapper>
    );
    expect(memoryRouter.state.location.pathname).toBe('/post/1');
  });
});
