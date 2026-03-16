import { renderHook, waitFor } from '@testing-library/react';
import { createTestWrapper } from '@/test-utils';
import { useCreatePost } from '../useCreatePost';

jest.mock('../../api/postsApi', () => ({
  createPost: jest.fn(),
}));

const { createPost } = require('../../api/postsApi');

describe('useCreatePost', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates post', async () => {
    const post = { id: '1', title: 'T', content: 'C', name: 'N', avatar: '', createdAt: '' };
    (createPost as jest.Mock).mockResolvedValue(post);
    const { result } = renderHook(() => useCreatePost(), {
      wrapper: createTestWrapper(),
    });
    result.current.mutate({ title: 'T', content: 'C', name: 'N', avatar: '' });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(createPost).toHaveBeenCalled();
  });
});
