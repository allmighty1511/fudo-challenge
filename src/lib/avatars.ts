const AVATAR_PATHS = [
  '/avatars/avatar1.svg',
  '/avatars/avatar2.svg',
  '/avatars/avatar3.svg',
  '/avatars/avatar4.svg',
  '/avatars/avatar5.svg',
  '/avatars/avatar6.svg',
  '/avatars/avatar7.svg',
  '/avatars/avatar8.svg',
] as const;

export const AVATARS = AVATAR_PATHS;

export type AvatarId = (typeof AVATARS)[number];

export const DEFAULT_AVATAR: AvatarId = '/avatars/avatar1.svg';

function getBaseUrl(): string {
  if (typeof window !== 'undefined') return window.location.origin;
  const env = typeof process !== 'undefined' ? (process as { env?: Record<string, string> }).env : undefined;
  return env?.VITE_APP_URL ?? 'http://localhost:5173';
}

export function getAvatarUrl(avatar: AvatarId | string): string {
  if (avatar.startsWith('http')) return avatar;
  const base = getBaseUrl();
  const path = avatar.startsWith('/') ? avatar : `/${avatar}`;
  return `${base}${path}`;
}

export function getRandomAvatar(): AvatarId {
  const idx = Math.floor(Math.random() * AVATARS.length);
  return (AVATARS[idx] ?? DEFAULT_AVATAR) as AvatarId;
}

export function getRandomAvatarUrl(): string {
  return getAvatarUrl(getRandomAvatar());
}

/** Path del avatar (para guardar en API). Siempre usa path, nunca URL completa. */
export function getAvatarPathForName(name: string): AvatarId {
  if (!name?.trim()) return DEFAULT_AVATAR;
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % AVATARS.length;
  return (AVATARS[idx] ?? DEFAULT_AVATAR) as AvatarId;
}

/** URL completa del avatar (para display). Mantiene compatibilidad con getAvatarForName. */
export function getAvatarForName(name: string): string {
  return getAvatarUrl(getAvatarPathForName(name));
}

export function getDefaultAvatar(): AvatarId {
  return DEFAULT_AVATAR;
}

const AVATAR_PATH_REGEX = /(\/avatars\/avatar\d\.svg)/;

/** Paleta de colores para avatares con iniciales (legibles y contrastados). */
const INITIALS_COLORS = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f43f5e', // rose
  '#f97316', // orange
  '#eab308', // amber
  '#22c55e', // green
  '#14b8a6', // teal
  '#0ea5e9', // sky
  '#3b82f6', // blue
] as const;

/**
 * Extrae las iniciales del nombre (máx. 2 caracteres).
 * - "John Doe" → "JD"
 * - "Alice" → "A"
 * - "María García" → "MG"
 */
export function getInitials(name: string | undefined | null): string {
  if (!name?.trim()) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return (parts[0]![0] ?? '?').toUpperCase();
  }
  const first = parts[0]![0] ?? '';
  const last = parts[parts.length - 1]![0] ?? '';
  return (first + last).toUpperCase();
}

/**
 * Color determinista para el avatar según el nombre (mismo nombre = mismo color).
 */
export function getAvatarColorFromName(name: string | undefined | null): string {
  if (!name?.trim()) return INITIALS_COLORS[0]!;
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % INITIALS_COLORS.length;
  return INITIALS_COLORS[idx] ?? INITIALS_COLORS[0]!;
}

/** Extrae el path del avatar para guardar en API (path relativo, sin origin). */
export function toAvatarPath(avatar: string | undefined | null): AvatarId {
  if (!avatar || avatar.trim() === '') return DEFAULT_AVATAR;
  const pathMatch = avatar.match(AVATAR_PATH_REGEX);
  if (pathMatch) return pathMatch[1] as AvatarId;
  if (AVATARS.includes(avatar as AvatarId)) return avatar as AvatarId;
  return DEFAULT_AVATAR;
}

export function resolveAvatar(avatar: string | undefined | null): string {
  if (!avatar || avatar.trim() === '') return getAvatarUrl(DEFAULT_AVATAR);
  // URLs absolutas que apuntan a nuestros avatares: normalizar con origin actual (fix prod)
  if (avatar.startsWith('http')) {
    const pathMatch = avatar.match(AVATAR_PATH_REGEX);
    if (pathMatch) return getAvatarUrl(pathMatch[1] as AvatarId);
    return avatar;
  }
  if (AVATARS.includes(avatar as AvatarId)) return getAvatarUrl(avatar as AvatarId);
  return getAvatarUrl(DEFAULT_AVATAR);
}

