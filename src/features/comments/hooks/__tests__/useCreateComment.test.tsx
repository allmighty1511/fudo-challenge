import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateComment } from '../useCreateComment';

jest.mock('../../api/commentsApi', () => ({
  createComment: jest.fn(),
}));

const { createComment } = require('../../api/commentsApi');

describe('useCreateComment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates comment and appends to existing cache', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    queryClient.setQueryData(['comments', 'post-1'], [
      { id: '1', content: 'A', name: 'X', avatar: '', parentId: null, createdAt: '' },
    ]);
    const newComment = {
      id: '2',
      content: 'Hi',
      name: 'A',
      avatar: '',
      parentId: null,
      createdAt: '',
    };
    (createComment as jest.Mock).mockResolvedValue(newComment);
    const { result } = renderHook(() => useCreateComment('post-1'), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });
    result.current.mutate({
      content: 'Hi',
      name: 'A',
      avatar: '',
      parentId: null,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(queryClient.getQueryData(['comments', 'post-1'])).toHaveLength(2);
  });

  it('creates comment and initializes cache when empty', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    const newComment = {
      id: '1',
      content: 'Hi',
      name: 'A',
      avatar: '',
      parentId: null,
      createdAt: '',
    };
    (createComment as jest.Mock).mockResolvedValue(newComment);
    const { result } = renderHook(() => useCreateComment('post-1'), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });
    result.current.mutate({
      content: 'Hi',
      name: 'A',
      avatar: '',
      parentId: null,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(createComment).toHaveBeenCalledWith('post-1', expect.any(Object));
    expect(queryClient.getQueryData(['comments', 'post-1'])).toEqual([newComment]);
  });
});
