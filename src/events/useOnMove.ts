import { useOnMouse } from '@/events/useOnMouse';
import { useOnTouch } from '@/events/useOnTouch';
import { throttle } from '@/helpers/throttle';

export const useOnMove = (trigger: HTMLElement, cb: (x: number, clickElement: HTMLElement) => void, root: HTMLElement) => {
  // relative to trigger center
  let offset = 0;
  let clickElement: HTMLElement | null = null;

  const throttledMove = throttle(cb, 1000 / 60); // that would give 60hz updates

  useOnMouse(trigger, {
    onMouseDown: (e: MouseEvent) => {
      clickElement = e.target as any as HTMLElement;

      const rect = clickElement.getBoundingClientRect();
      offset = e.clientX - rect.x - rect.width / 2;
    },
    onMouseMove: (e: MouseEvent) => {
      throttledMove(e.clientX - offset, clickElement!);
    },
    onMouseUp: () => {
      offset = 0;
      clickElement = null;
    },
  });

  useOnTouch(trigger, {
    onTouchDown: (touch: Touch) => {
      clickElement = touch.target as any as HTMLElement;

      const rect = clickElement.getBoundingClientRect();
      offset = touch.clientX - rect.x - rect.width / 2;
    },
    onTouchMove: (touch: Touch) => {
      throttledMove(touch.clientX - offset, clickElement!);
    },
    onTouchUp: () => {
      offset = 0;
      clickElement = null;
    },
    root,
  });
};