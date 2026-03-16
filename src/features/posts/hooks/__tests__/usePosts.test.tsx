import { renderHook, waitFor } from '@testing-library/react';
import { createTestWrapper } from '@/test-utils';
import { usePosts } from '../usePosts';

jest.mock('../../api/postsApi', () => ({
  getPosts: jest.fn(),
}));

const { getPosts } = require('../../api/postsApi');

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
      wrapper: createTestWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
  });
});
