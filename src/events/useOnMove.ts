import { useOnMouse } from '@/events/useOnMouse';

export const useOnMove = (trigger: HTMLElement, cb: (x: number, clickElement: HTMLElement) => void) => {
  // relative to trigger center
  let offset = 0;
  let clickElement: HTMLElement | null = null;

  useOnMouse(trigger, {
    onMouseDown: (e: MouseEvent) => {
      clickElement = e.target as any as HTMLElement;

      const rect = clickElement.getBoundingClientRect();
      offset = e.clientX - rect.x - rect.width / 2;
    },
    onMouseMove: (e: MouseEvent) => {
      cb(e.clientX - offset, clickElement!);
    },
    onMouseUp: () => {
      offset = 0;
      clickElement = null;
    },
  });
};