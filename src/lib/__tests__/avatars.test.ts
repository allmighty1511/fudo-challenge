import {
  getAvatarUrl,
  getRandomAvatar,
  getRandomAvatarUrl,
  getAvatarForName,
  getAvatarPathForName,
  getDefaultAvatar,
  resolveAvatar,
  toAvatarPath,
  getInitials,
  getAvatarColorFromName,
  AVATARS,
} from '../avatars';

describe('avatars', () => {
  describe('getAvatarUrl', () => {
    it('returns full URL for path avatar', () => {
      const url = getAvatarUrl('/avatars/avatar1.svg');
      expect(url).toMatch(/^https?:\/\/.+\/avatars\/avatar1\.svg$/);
    });

    it('returns path with leading slash when avatar has no slash', () => {
      const url = getAvatarUrl('avatars/avatar1.svg');
      expect(url).toMatch(/^https?:\/\/.+\/avatars\/avatar1\.svg$/);
    });

    it('returns http URL as-is', () => {
      expect(getAvatarUrl('http://example.com/avatar.png')).toBe(
        'http://example.com/avatar.png'
      );
    });

    it('returns https URL as-is', () => {
      expect(getAvatarUrl('https://example.com/avatar.png')).toBe(
        'https://example.com/avatar.png'
      );
    });
  });

  describe('getRandomAvatar', () => {
    it('returns one of the AVATARS', () => {
      const avatar = getRandomAvatar();
      expect(AVATARS).toContain(avatar);
    });
  });

  describe('getRandomAvatarUrl', () => {
    it('returns a full URL', () => {
      const url = getRandomAvatarUrl();
      expect(url).toMatch(/^http/);
      expect(url).toContain('/avatars/');
    });
  });

  describe('getAvatarForName', () => {
    it('returns default avatar for empty name', () => {
      const url = getAvatarForName('');
      expect(url).toContain('/avatars/');
    });

    it('returns default avatar for whitespace-only name', () => {
      const url = getAvatarForName('   ');
      expect(url).toContain('/avatars/');
    });

    it('returns deterministic avatar for same name', () => {
      const url1 = getAvatarForName('Alice');
      const url2 = getAvatarForName('Alice');
      expect(url1).toBe(url2);
    });

    it('returns different avatars for different names', () => {
      const url1 = getAvatarForName('Alice');
      const url2 = getAvatarForName('Bob');
      expect(url1).not.toBe(url2);
    });
  });



  describe('getDefaultAvatar', () => {
    it('returns default avatar path', () => {
      expect(getDefaultAvatar()).toBe('/avatars/avatar1.svg');
    });
  });

  describe('resolveAvatar', () => {
    it('returns default for undefined', () => {
      const url = resolveAvatar(undefined);
      expect(url).toContain('/avatars/');
    });

    it('returns default for null', () => {
      const url = resolveAvatar(null);
      expect(url).toContain('/avatars/');
    });

    it('returns default for empty string', () => {
      const url = resolveAvatar('');
      expect(url).toContain('/avatars/');
    });

    it('returns default for whitespace-only', () => {
      const url = resolveAvatar('   ');
      expect(url).toContain('/avatars/');
    });

    it('returns http URL as-is', () => {
      expect(resolveAvatar('http://example.com/a.png')).toBe(
        'http://example.com/a.png'
      );
    });

    it('returns known avatar path as full URL', () => {
      const url = resolveAvatar('/avatars/avatar2.svg');
      expect(url).toMatch(/^http.*\/avatars\/avatar2\.svg$/);
    });

    it('returns default for unknown path', () => {
      const url = resolveAvatar('/unknown/path.svg');
      expect(url).toContain('/avatars/');
    });

    it('normalizes our avatar URLs to current origin (fix prod)', () => {
      const url = resolveAvatar('http://localhost:5173/avatars/avatar1.svg');
      expect(url).toMatch(/^https?:\/\/.+\/avatars\/avatar1\.svg$/);
      expect(url).toContain('/avatars/avatar1.svg');
    });
  });

  describe('getAvatarPathForName', () => {
    it('returns path only, not full URL', () => {
      const path = getAvatarPathForName('Alice');
      expect(path).toMatch(/^\/avatars\/avatar\d\.svg$/);
      expect(path).not.toMatch(/^https?:\/\//);
    });
  });

  describe('toAvatarPath', () => {
    it('extracts path from full URL', () => {
      expect(toAvatarPath('http://localhost:5173/avatars/avatar3.svg')).toBe('/avatars/avatar3.svg');
    });
    it('returns path as-is when already path', () => {
      expect(toAvatarPath('/avatars/avatar2.svg')).toBe('/avatars/avatar2.svg');
    });
  });

  describe('getInitials', () => {
    it('returns first letter for single name', () => {
      expect(getInitials('Alice')).toBe('A');
    });
    it('returns first and last initial for full name', () => {
      expect(getInitials('John Doe')).toBe('JD');
    });
    it('returns first and last initial for three names', () => {
      expect(getInitials('María García López')).toBe('ML');
    });
    it('returns ? for empty or null', () => {
      expect(getInitials('')).toBe('?');
      expect(getInitials(null)).toBe('?');
      expect(getInitials(undefined)).toBe('?');
    });
    it('trims whitespace', () => {
      expect(getInitials('  John Doe  ')).toBe('JD');
    });
  });

  describe('getAvatarColorFromName', () => {
    it('returns same color for same name', () => {
      const c1 = getAvatarColorFromName('Alice');
      const c2 = getAvatarColorFromName('Alice');
      expect(c1).toBe(c2);
    });
    it('returns hex color', () => {
      const color = getAvatarColorFromName('Bob');
      expect(color).toMatch(/^#[0-9a-f]{6}$/);
    });
  });
});
