import { truncateText } from '../truncateText';

describe('truncateText', () => {
  it('returns full text when shorter than maxLength', () => {
    expect(truncateText('hello', 10)).toBe('hello');
  });

  it('returns truncated text with ellipsis when longer than maxLength', () => {
    expect(truncateText('hello world', 5)).toBe('hello...');
  });

  it('returns full text when exactly maxLength', () => {
    expect(truncateText('hello', 5)).toBe('hello');
  });
});
