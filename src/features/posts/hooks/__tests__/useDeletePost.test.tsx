import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDeletePost } from '../useDeletePost';

jest.mock('../../api/postsApi', () => ({
  deletePost: jest.fn(),
}));

const { deletePost } = require('../../api/postsApi');

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe('useDeletePost', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deletes post', async () => {
    (deletePost as jest.Mock).mockResolvedValue({});
    const { result } = renderHook(() => useDeletePost(), {
      wrapper: createWrapper(),
    });
    result.current.mutate('post-1');
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(deletePost).toHaveBeenCalledWith('post-1');
  });
});
