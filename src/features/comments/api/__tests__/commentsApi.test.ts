import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from '../commentsApi';

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const { apiClient } = require('@/lib/api/client');

describe('commentsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getComments', () => {
    it('returns comments on 200', async () => {
      const data = [{ id: '1', content: 'Hi', name: 'A', avatar: '', parentId: null, createdAt: '' }];
      (apiClient.get as jest.Mock).mockResolvedValue({ status: 200, data });
      const result = await getComments('post-1');
      expect(result).toEqual(data);
      expect(apiClient.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          validateStatus: expect.any(Function),
        })
      );
      const validateStatus = (apiClient.get as jest.Mock).mock.calls[0]![1].validateStatus;
      expect(validateStatus(200)).toBe(true);
      expect(validateStatus(404)).toBe(true);
      expect(validateStatus(500)).toBe(false);
    });

    it('returns empty array on 404', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ status: 404, data: null });
      const result = await getComments('post-1');
      expect(result).toEqual([]);
    });

    it('returns empty array when data is not array', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ status: 200, data: null });
      const result = await getComments('post-1');
      expect(result).toEqual([]);
    });
  });

  describe('createComment', () => {
    it('posts and returns data', async () => {
      const comment = { content: 'Hi', name: 'A', avatar: '', parentId: null };
      const created = { id: '1', ...comment, createdAt: '' };
      (apiClient.post as jest.Mock).mockResolvedValue({ data: created });
      const result = await createComment('post-1', comment);
      expect(result).toEqual(created);
    });
  });

  describe('updateComment', () => {
    it('puts and returns data', async () => {
      const updated = { id: '1', content: 'Updated', name: 'A', avatar: '', parentId: null, createdAt: '' };
      (apiClient.put as jest.Mock).mockResolvedValue({ data: updated });
      const result = await updateComment('post-1', '1', { content: 'Updated' });
      expect(result).toEqual(updated);
    });
  });

  describe('deleteComment', () => {
    it('deletes and returns data', async () => {
      const deleted = { id: '1', content: '', name: '', avatar: '', parentId: null, createdAt: '' };
      (apiClient.delete as jest.Mock).mockResolvedValue({ data: deleted });
      const result = await deleteComment('post-1', '1');
      expect(result).toEqual(deleted);
    });
  });
});
