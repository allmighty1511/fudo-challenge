import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useComments } from '../useComments';

jest.mock('../../api/commentsApi', () => ({
  getComments: jest.fn(),
}));

const { getComments } = require('../../api/commentsApi');

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

describe('useComments', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches comments when postId provided', async () => {
    const data = [{ id: '1', content: 'Hi', name: 'A', avatar: '', parentId: null, createdAt: '' }];
    (getComments as jest.Mock).mockResolvedValue(data);
    const { result } = renderHook(() => useComments('post-1'), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
    expect(getComments).toHaveBeenCalledWith('post-1');
  });

  it('does not fetch when postId undefined', () => {
    renderHook(() => useComments(undefined), {
      wrapper: createWrapper(),
    });
    expect(getComments).not.toHaveBeenCalled();
  });
});
