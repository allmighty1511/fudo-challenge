import { buildCommentTree, getDescendantIds } from '../buildCommentTree';
import type { Comment } from '@/types';

describe('getDescendantIds', () => {
  it('returns empty for no descendants', () => {
    const comments: Comment[] = [
      { id: '1', content: '', name: '', avatar: '', parentId: null, createdAt: '' },
      { id: '2', content: '', name: '', avatar: '', parentId: '1', createdAt: '' },
    ];
    expect(getDescendantIds(comments, '2')).toEqual([]);
  });

  it('returns direct children', () => {
    const comments: Comment[] = [
      { id: '1', content: '', name: '', avatar: '', parentId: null, createdAt: '' },
      { id: '2', content: '', name: '', avatar: '', parentId: '1', createdAt: '' },
      { id: '3', content: '', name: '', avatar: '', parentId: '1', createdAt: '' },
    ];
    expect(getDescendantIds(comments, '1')).toEqual(['2', '3']);
  });

  it('returns nested descendants', () => {
    const comments: Comment[] = [
      { id: '1', content: '', name: '', avatar: '', parentId: null, createdAt: '' },
      { id: '2', content: '', name: '', avatar: '', parentId: '1', createdAt: '' },
      { id: '3', content: '', name: '', avatar: '', parentId: '2', createdAt: '' },
    ];
    expect(getDescendantIds(comments, '1')).toEqual(['2', '3']);
  });
});

describe('buildCommentTree', () => {
  it('returns empty array for empty input', () => {
    expect(buildCommentTree([])).toEqual([]);
  });

  it('builds flat tree when all comments have parentId null', () => {
    const comments: Comment[] = [
      { id: '1', content: 'a', name: 'A', avatar: '', parentId: null, createdAt: '' },
      { id: '2', content: 'b', name: 'B', avatar: '', parentId: null, createdAt: '' },
    ];
    const tree = buildCommentTree(comments);
    expect(tree).toHaveLength(2);
    expect(tree[0]?.replies).toEqual([]);
    expect(tree[1]?.replies).toEqual([]);
  });

  it('nests replies under parent', () => {
    const comments: Comment[] = [
      { id: '1', content: 'root', name: 'A', avatar: '', parentId: null, createdAt: '' },
      { id: '2', content: 'reply', name: 'B', avatar: '', parentId: '1', createdAt: '' },
    ];
    const tree = buildCommentTree(comments);
    expect(tree).toHaveLength(1);
    expect(tree[0]?.replies).toHaveLength(1);
    expect(tree[0]?.replies[0]).toMatchObject({ content: 'reply' });
  });

  it('handles orphan comment when parent not found', () => {
    const comments: Comment[] = [
      { id: '1', content: 'orphan', name: 'X', avatar: '', parentId: 'missing', createdAt: '' },
    ];
    const tree = buildCommentTree(comments);
    expect(tree).toHaveLength(1);
    expect(tree[0]).toMatchObject({ content: 'orphan' });
  });

  it('handles nested replies', () => {
    const comments: Comment[] = [
      { id: '1', content: 'root', name: 'A', avatar: '', parentId: null, createdAt: '' },
      { id: '2', content: 'r1', name: 'B', avatar: '', parentId: '1', createdAt: '' },
      { id: '3', content: 'r2', name: 'C', avatar: '', parentId: '2', createdAt: '' },
    ];
    const tree = buildCommentTree(comments);
    expect(tree).toHaveLength(1);
    expect(tree[0]?.replies).toHaveLength(1);
    expect(tree[0]?.replies[0]?.replies).toHaveLength(1);
    expect(tree[0]?.replies[0]?.replies[0]).toMatchObject({ content: 'r2' });
  });
});
