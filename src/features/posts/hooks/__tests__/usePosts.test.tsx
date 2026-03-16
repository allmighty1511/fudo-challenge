import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePosts } from '../usePosts';

jest.mock('../../api/postsApi', () => ({
  getPosts: jest.fn(),
}));

const { getPosts } = require('../../api/postsApi');

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe('usePosts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches posts', async () => {
    const data = [
      { id: '1', title: 'T', content: 'C', name: 'N', avatar: '', createdAt: '' },
    ];
    (getPosts as jest.Mock).mockResolvedValue(data);
    const { result } = renderHook(() => usePosts(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
  });
});
