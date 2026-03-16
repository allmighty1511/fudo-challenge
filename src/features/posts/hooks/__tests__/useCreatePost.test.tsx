import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreatePost } from '../useCreatePost';

jest.mock('../../api/postsApi', () => ({
  createPost: jest.fn(),
}));

const { createPost } = require('../../api/postsApi');

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

describe('useCreatePost', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates post', async () => {
    const post = { id: '1', title: 'T', content: 'C', name: 'N', avatar: '', createdAt: '' };
    (createPost as jest.Mock).mockResolvedValue(post);
    const { result } = renderHook(() => useCreatePost(), {
      wrapper: createWrapper(),
    });
    result.current.mutate({ title: 'T', content: 'C', name: 'N', avatar: '' });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(createPost).toHaveBeenCalled();
  });
});
