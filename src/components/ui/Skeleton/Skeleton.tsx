const variantClasses: Record<string, string> = {
  card: 'h-32',
  title: 'h-8 w-48',
  text: 'h-4 w-full',
  'text-short': 'h-4 w-3/4',
  comment: 'h-20',
};

interface SkeletonProps {
  variant?: 'card' | 'title' | 'text' | 'text-short' | 'comment';
  count?: number;
  className?: string;
}

export function Skeleton({
  variant = 'card',
  count = 1,
  className = '',
}: SkeletonProps) {
  const baseClasses =
    'bg-gray-200 animate-pulse rounded-[var(--radius-md)]';
  const variantClass = variantClasses[variant] ?? variantClasses.card;

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={`${baseClasses} ${variantClass} ${className}`.trim()}
        />
      ))}
    </>
  );
}
