import { endpoints } from '../endpoints';

describe('endpoints', () => {
  it('returns posts path', () => {
    expect(endpoints.posts()).toBe('/post');
  });

  it('returns post path with id', () => {
    expect(endpoints.post('123')).toBe('/post/123');
  });

  it('returns comments path for post', () => {
    expect(endpoints.comments('post-1')).toBe('/post/post-1/comment');
  });

  it('returns comment path for post and comment', () => {
    expect(endpoints.comment('post-1', 'comment-1')).toBe(
      '/post/post-1/comment/comment-1'
    );
  });
});
