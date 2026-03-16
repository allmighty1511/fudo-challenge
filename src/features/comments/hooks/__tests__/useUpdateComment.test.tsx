import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUpdateComment } from '../useUpdateComment';

jest.mock('../../api/commentsApi', () => ({
  updateComment: jest.fn(),
}));

const { updateComment } = require('../../api/commentsApi');

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

describe('useUpdateComment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('updates comment', async () => {
    const updated = {
      id: '1',
      content: 'Updated',
      name: 'A',
      avatar: '',
      parentId: null,
      createdAt: '',
    };
    (updateComment as jest.Mock).mockResolvedValue(updated);
    const { result } = renderHook(() => useUpdateComment('post-1'), {
      wrapper: createWrapper(),
    });
    result.current.mutate({
      commentId: '1',
      comment: { content: 'Updated' },
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(updateComment).toHaveBeenCalledWith('post-1', '1', {
      content: 'Updated',
    });
  });
});
