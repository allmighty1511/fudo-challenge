import { getInitials, getAvatarColorFromName } from '@/lib/avatars';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

const imgSizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

export function Avatar({ src, alt, size = 'md', className = '' }: AvatarProps) {
  const initials = getInitials(alt);
  const bgColor = getAvatarColorFromName(alt);

  const baseClasses = `rounded-full flex items-center justify-center font-semibold text-white shrink-0 ${sizeClasses[size]} ${className}`;

  if (src?.startsWith('http') && !src.includes('/avatars/avatar')) {
    return (
      <img
        src={src}
        alt={alt}
        className={`rounded-full object-cover ${imgSizeClasses[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={baseClasses}
      style={{ backgroundColor: bgColor }}
      role="img"
      aria-label={alt}
    >
      {initials}
    </div>
  );
}
