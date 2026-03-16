import { renderHook, waitFor } from '@testing-library/react';
import { createTestWrapper } from '@/test-utils';
import { useDeletePost } from '../useDeletePost';

jest.mock('../../api/postsApi', () => ({
  deletePost: jest.fn(),
}));

const { deletePost } = require('../../api/postsApi');

describe('useDeletePost', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deletes post', async () => {
    (deletePost as jest.Mock).mockResolvedValue({});
    const { result } = renderHook(() => useDeletePost(), {
      wrapper: createTestWrapper(),
    });
    result.current.mutate('post-1');
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(deletePost).toHaveBeenCalledWith('post-1');
  });
});
