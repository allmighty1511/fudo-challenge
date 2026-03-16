export type DateFormat = 'short' | 'long';

export function formatDate(dateStr: string, format: DateFormat = 'short'): string {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: format === 'short' ? 'short' : 'long',
    year: 'numeric',
  };
  if (format === 'long') {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  return date.toLocaleDateString('es-ES', options);
}
