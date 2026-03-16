import { renderHook, waitFor } from '@testing-library/react';
import { createTestWrapper } from '@/test-utils';
import { usePost } from '../usePost';

jest.mock('../../api/postsApi', () => ({
  getPost: jest.fn(),
}));

const { getPost } = require('../../api/postsApi');

describe('usePost', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches post when id provided', async () => {
    const data = { id: '1', title: 'T', content: 'C', name: 'N', avatar: '', createdAt: '' };
    (getPost as jest.Mock).mockResolvedValue(data);
    const { result } = renderHook(() => usePost('1'), {
      wrapper: createTestWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
  });

  it('does not fetch when id undefined', () => {
    renderHook(() => usePost(undefined), {
      wrapper: createTestWrapper(),
    });
    expect(getPost).not.toHaveBeenCalled();
  });
});
