import { createBrowserRouter, Navigate } from 'react-router-dom';
import { FeedPage } from '@/features/posts/pages/FeedPage';
import { PostDetailPage } from '@/features/posts/pages/PostDetailPage';

export const router = createBrowserRouter([
  { path: '/', element: <FeedPage /> },
  { path: '/post/:id', element: <PostDetailPage /> },
  { path: '*', element: <Navigate to="/" replace /> },
]);
