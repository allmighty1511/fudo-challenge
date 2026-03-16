export const endpoints = {
  posts: () => '/post',
  post: (id: string) => `/post/${id}`,
  comments: (postId: string) => `/post/${postId}/comment`,
  comment: (postId: string, commentId: string) =>
    `/post/${postId}/comment/${commentId}`,
} as const;
