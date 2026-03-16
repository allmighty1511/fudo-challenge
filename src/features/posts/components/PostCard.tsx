import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { OptionsMenu } from '@/components/ui/Dropdown';
import { formatDate } from '@/lib/utils/formatDate';
import type { Post } from '@/types';

interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
}

export function PostCard({ post, onEdit, onDelete }: PostCardProps) {
  const preview = post.content.slice(0, 150) + (post.content.length > 150 ? '...' : '');

  return (
    <Card as="article" className="p-4 md:p-6">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <Link to={`/post/${post.id}`} className="block group">
            <h2 className="text-lg font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
              {post.title}
            </h2>
          </Link>
          <p className="mt-2 text-sm text-[var(--color-text-muted)] line-clamp-3">
            {preview}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Avatar src={post.avatar} alt={post.name} size="sm" />
            <span className="text-sm text-[var(--color-text-muted)]">
              {post.name} · {formatDate(post.createdAt)}
            </span>
          </div>
        </div>
        <OptionsMenu
          onEdit={() => onEdit(post)}
          onDelete={() => onDelete(post)}
          align="right"
        />
      </div>
    </Card>
  );
}
