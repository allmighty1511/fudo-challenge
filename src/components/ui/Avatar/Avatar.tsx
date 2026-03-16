import { resolveAvatar } from '@/lib/avatars';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

export function Avatar({ src, alt, size = 'md', className = '' }: AvatarProps) {
  const resolvedSrc = resolveAvatar(src);
  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
    />
  );
}
