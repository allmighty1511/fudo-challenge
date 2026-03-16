import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUpdatePost } from '../useUpdatePost';

jest.mock('../../api/postsApi', () => ({
  updatePost: jest.fn(),
}));

const { updatePost } = require('../../api/postsApi');

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

describe('useUpdatePost', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('updates post', async () => {
    const updated = { id: '1', title: 'T', content: 'C', name: 'N', avatar: '', createdAt: '' };
    (updatePost as jest.Mock).mockResolvedValue(updated);
    const { result } = renderHook(() => useUpdatePost(), {
      wrapper: createWrapper(),
    });
    result.current.mutate({ id: '1', post: { title: 'T' } });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(updatePost).toHaveBeenCalledWith('1', { title: 'T' });
  });
});
