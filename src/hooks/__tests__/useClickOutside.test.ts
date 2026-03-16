import { renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { useClickOutside } from '../useClickOutside';

describe('useClickOutside', () => {
  it('calls handler when clicking outside', () => {
    const handler = jest.fn();
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, handler);
      return ref;
    });

    const div = document.createElement('div');
    document.body.appendChild(div);
    result.current.current = div;

    const outside = document.createElement('div');
    document.body.appendChild(outside);

    const mousedown = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(mousedown, 'target', { value: outside });
    document.dispatchEvent(mousedown);

    expect(handler).toHaveBeenCalledTimes(1);

    document.body.removeChild(div);
    document.body.removeChild(outside);
  });

  it('does not call handler when clicking inside', () => {
    const handler = jest.fn();
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, handler);
      return ref;
    });

    const div = document.createElement('div');
    const inner = document.createElement('span');
    div.appendChild(inner);
    document.body.appendChild(div);
    result.current.current = div;

    const mousedown = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(mousedown, 'target', { value: inner });
    document.dispatchEvent(mousedown);

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(div);
  });
});
