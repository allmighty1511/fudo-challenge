import { createContext, useContext, type ReactNode } from 'react';
import type { useCreateComment } from '../hooks/useCreateComment';
import type { useUpdateComment } from '../hooks/useUpdateComment';
import type { useDeleteComment } from '../hooks/useDeleteComment';

export interface CommentActionsValue {
  createComment: ReturnType<typeof useCreateComment>;
  updateComment: ReturnType<typeof useUpdateComment>;
  deleteComment: ReturnType<typeof useDeleteComment>;
}

const CommentActionsContext = createContext<CommentActionsValue | null>(null);

export function CommentActionsProvider({
  value,
  children,
}: {
  value: CommentActionsValue;
  children: ReactNode;
}) {
  return (
    <CommentActionsContext.Provider value={value}>
      {children}
    </CommentActionsContext.Provider>
  );
}

export function useCommentActions(): CommentActionsValue {
  const context = useContext(CommentActionsContext);
  if (!context) {
    throw new Error('useCommentActions must be used within CommentActionsProvider');
  }
  return context;
}
