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
  return import.meta.env?.VITE_APP_URL ?? 'http://localhost:5173';
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

/** Asigna un avatar del enum de forma determinista según el nombre. */
export function getAvatarForName(name: string): string {
  if (!name?.trim()) return getAvatarUrl(DEFAULT_AVATAR);
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % AVATARS.length;
  return getAvatarUrl(AVATARS[idx] ?? DEFAULT_AVATAR);
}

export function getDefaultAvatar(): AvatarId {
  return DEFAULT_AVATAR;
}

export function resolveAvatar(avatar: string | undefined | null): string {
  if (!avatar || avatar.trim() === '') return getAvatarUrl(DEFAULT_AVATAR);
  if (avatar.startsWith('http')) return avatar;
  if (AVATARS.includes(avatar as AvatarId)) return getAvatarUrl(avatar as AvatarId);
  return getAvatarUrl(DEFAULT_AVATAR);
}

