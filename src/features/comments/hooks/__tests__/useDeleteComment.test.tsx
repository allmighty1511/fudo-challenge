import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDeleteComment } from '../useDeleteComment';

const mockGetComments = jest.fn();
const mockGetDescendantIds = jest.fn((_comments: unknown[], _parentId: string) => []);

jest.mock('../../api/commentsApi', () => ({
  deleteComment: jest.fn(),
  getComments: (postId: string) => mockGetComments(postId),
}));

jest.mock('@/lib/utils/buildCommentTree', () => ({
  getDescendantIds: (comments: unknown[], parentId: string) =>
    mockGetDescendantIds(comments, parentId),
}));

const { deleteComment } = require('../../api/commentsApi');

describe('useDeleteComment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deletes comment when cache has data', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    queryClient.setQueryData(['comments', 'post-1'], []);
    (deleteComment as jest.Mock).mockResolvedValue({});
    const { result } = renderHook(() => useDeleteComment('post-1'), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });
    result.current.mutate('comment-1');
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(deleteComment).toHaveBeenCalledWith('post-1', 'comment-1');
  });

  it('fetches comments when cache empty then deletes', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    mockGetComments.mockResolvedValue([]);
    (deleteComment as jest.Mock).mockResolvedValue({});
    const { result } = renderHook(() => useDeleteComment('post-1'), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });
    result.current.mutate('comment-1');
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockGetComments).toHaveBeenCalledWith('post-1');
  });
});
