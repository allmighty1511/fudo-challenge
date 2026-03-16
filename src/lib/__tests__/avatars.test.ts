import {
  getAvatarUrl,
  getRandomAvatar,
  getRandomAvatarUrl,
  getAvatarForName,
  getDefaultAvatar,
  resolveAvatar,
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
  });
});
