import { renderHook, waitFor } from '@testing-library/react';
import { createTestWrapper } from '@/test-utils';
import { useComments } from '../useComments';

jest.mock('../../api/commentsApi', () => ({
  getComments: jest.fn(),
}));

const { getComments } = require('../../api/commentsApi');

describe('useComments', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches comments when postId provided', async () => {
    const data = [{ id: '1', content: 'Hi', name: 'A', avatar: '', parentId: null, createdAt: '' }];
    (getComments as jest.Mock).mockResolvedValue(data);
    const { result } = renderHook(() => useComments('post-1'), {
      wrapper: createTestWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
    expect(getComments).toHaveBeenCalledWith('post-1');
  });

  it('does not fetch when postId undefined', () => {
    renderHook(() => useComments(undefined), {
      wrapper: createTestWrapper(),
    });
    expect(getComments).not.toHaveBeenCalled();
  });
});
