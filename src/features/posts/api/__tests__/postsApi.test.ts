import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from '../postsApi';

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const { apiClient } = require('@/lib/api/client');

describe('postsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPosts', () => {
    it('returns posts', async () => {
      const data = [
        { id: '1', title: 'T', content: 'C', name: 'N', avatar: '', createdAt: '' },
      ];
      (apiClient.get as jest.Mock).mockResolvedValue({ data });
      const result = await getPosts();
      expect(result).toEqual(data);
    });
  });

  describe('getPost', () => {
    it('returns post', async () => {
      const data = { id: '1', title: 'T', content: 'C', name: 'N', avatar: '', createdAt: '' };
      (apiClient.get as jest.Mock).mockResolvedValue({ data });
      const result = await getPost('1');
      expect(result).toEqual(data);
    });
  });

  describe('createPost', () => {
    it('posts and returns data', async () => {
      const post = { title: 'T', content: 'C', name: 'N', avatar: '' };
      const created = { id: '1', ...post, createdAt: '' };
      (apiClient.post as jest.Mock).mockResolvedValue({ data: created });
      const result = await createPost(post);
      expect(result).toEqual(created);
    });
  });

  describe('updatePost', () => {
    it('puts and returns data', async () => {
      const updated = { id: '1', title: 'T', content: 'C', name: 'N', avatar: '', createdAt: '' };
      (apiClient.put as jest.Mock).mockResolvedValue({ data: updated });
      const result = await updatePost('1', { title: 'T' });
      expect(result).toEqual(updated);
    });
  });

  describe('deletePost', () => {
    it('deletes and returns data', async () => {
      const deleted = { id: '1', title: '', content: '', name: '', avatar: '', createdAt: '' };
      (apiClient.delete as jest.Mock).mockResolvedValue({ data: deleted });
      const result = await deletePost('1');
      expect(result).toEqual(deleted);
    });
  });
});
