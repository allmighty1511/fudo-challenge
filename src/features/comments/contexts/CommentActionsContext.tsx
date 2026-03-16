import { createContext, useContext, type ReactNode } from 'react';

export interface CommentActionsValue {
  onReply: (
    parentId: string,
    data: { content: string; name: string },
    options?: { onSuccess?: () => void }
  ) => void;
  onEdit: (
    commentId: string,
    content: string,
    options?: { onSuccess?: () => void }
  ) => void;
  onDelete: (commentId: string, hasReplies: boolean) => void;
  isReplying: boolean;
  isEditing: boolean;
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
    throw new Error(
      'useCommentActions must be used within CommentActionsProvider'
    );
  }
  return context;
}
