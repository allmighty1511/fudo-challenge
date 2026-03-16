import { renderHook, act } from '@testing-library/react';
import { createTestWrapper } from '@/test-utils';
import { useCommentTree } from '../useCommentTree';

jest.mock('@/lib/avatars', () => ({
  getAvatarForName: (name: string) => `http://avatar/${name}`,
}));

jest.mock('../useComments', () => ({
  useComments: jest.fn(),
}));

jest.mock('../useCreateComment', () => ({
  useCreateComment: jest.fn(),
}));

jest.mock('../useUpdateComment', () => ({
  useUpdateComment: jest.fn(),
}));

jest.mock('../useDeleteComment', () => ({
  useDeleteComment: jest.fn(),
}));

const useComments = require('../useComments').useComments as jest.Mock;
const useCreateComment = require('../useCreateComment').useCreateComment as jest.Mock;
const useUpdateComment = require('../useUpdateComment').useUpdateComment as jest.Mock;
const useDeleteComment = require('../useDeleteComment').useDeleteComment as jest.Mock;

describe('useCommentTree', () => {
  const mockMutate = jest.fn();
  const mockCreateMutate = jest.fn((_data: unknown, opts?: { onSuccess?: () => void }) => {
    opts?.onSuccess?.();
  });
  const mockUpdateMutate = jest.fn((_vars: unknown, opts?: { onSuccess?: () => void }) => {
    opts?.onSuccess?.();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    useComments.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });
    useCreateComment.mockReturnValue({
      mutate: mockCreateMutate,
      isPending: false,
    });
    useUpdateComment.mockReturnValue({
      mutate: mockUpdateMutate,
      isPending: false,
    });
    useDeleteComment.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it('returns tree and comment actions', () => {
    const { result } = renderHook(() => useCommentTree('post-1'), {
      wrapper: createTestWrapper(),
    });

    expect(result.current.tree).toEqual([]);
    expect(result.current.commentActions).toMatchObject({
      onReply: expect.any(Function),
      onEdit: expect.any(Function),
      onDelete: expect.any(Function),
      isReplying: false,
      isEditing: false,
    });
  });

  it('handleSubmitNew calls createComment.mutate when form has content', async () => {
    const { result } = renderHook(() => useCommentTree('post-1'), {
      wrapper: createTestWrapper(),
    });

    await act(async () => {
      result.current.setNewCommentName('John');
      result.current.setNewCommentContent('Hello');
    });

    await act(async () => {
      result.current.handleSubmitNew();
    });

    expect(mockCreateMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        content: 'Hello',
        name: 'John',
        avatar: 'http://avatar/John',
        parentId: null,
      }),
      expect.any(Object)
    );
  });

  it('handleSubmitNew clears form on success', async () => {
    const { result } = renderHook(() => useCommentTree('post-1'), {
      wrapper: createTestWrapper(),
    });

    await act(async () => {
      result.current.setNewCommentName('Jane');
      result.current.setNewCommentContent('Hi');
    });

    await act(async () => {
      result.current.handleSubmitNew();
    });

    expect(result.current.newCommentName).toBe('');
    expect(result.current.newCommentContent).toBe('');
  });

  it('handleSubmitNew does not call mutate when name empty', async () => {
    const { result } = renderHook(() => useCommentTree('post-1'), {
      wrapper: createTestWrapper(),
    });

    await act(async () => {
      result.current.setNewCommentContent('Hello');
    });

    await act(async () => {
      result.current.handleSubmitNew();
    });

    expect(mockCreateMutate).not.toHaveBeenCalled();
  });

  it('onDelete calls mutate when confirm returns true', () => {
    window.confirm = jest.fn(() => true);
    const { result } = renderHook(() => useCommentTree('post-1'), {
      wrapper: createTestWrapper(),
    });

    act(() => {
      result.current.commentActions.onDelete('comment-1', false);
    });

    expect(mockMutate).toHaveBeenCalledWith('comment-1');
  });

  it('onDelete does not call mutate when confirm returns false', () => {
    window.confirm = jest.fn(() => false);
    const { result } = renderHook(() => useCommentTree('post-1'), {
      wrapper: createTestWrapper(),
    });

    act(() => {
      result.current.commentActions.onDelete('comment-1', false);
    });

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('onReply calls createComment.mutate with parentId and invokes onSuccess', async () => {
    const onSuccess = jest.fn();
    const { result } = renderHook(() => useCommentTree('post-1'), {
      wrapper: createTestWrapper(),
    });

    await act(async () => {
      result.current.commentActions.onReply(
        'parent-1',
        { content: 'Reply', name: 'Jane' },
        { onSuccess }
      );
    });

    expect(mockCreateMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        content: 'Reply',
        name: 'Jane',
        parentId: 'parent-1',
      }),
      expect.any(Object)
    );
    expect(onSuccess).toHaveBeenCalled();
  });

  it('onEdit calls updateComment.mutate and invokes onSuccess', async () => {
    const onSuccess = jest.fn();
    const { result } = renderHook(() => useCommentTree('post-1'), {
      wrapper: createTestWrapper(),
    });

    await act(async () => {
      result.current.commentActions.onEdit('comment-1', 'Edited content', {
        onSuccess,
      });
    });

    expect(mockUpdateMutate).toHaveBeenCalledWith(
      { commentId: 'comment-1', comment: { content: 'Edited content' } },
      expect.any(Object)
    );
    expect(onSuccess).toHaveBeenCalled();
  });
});
