export const useOnMove = (trigger: HTMLElement, cb: (x: number, clickElement: HTMLElement) => void) => {
  // relative to trigger center
  let offset = 0;
  let clickElement: HTMLElement | null = null;

  const onMouseDown = (e: MouseEvent) => {
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

    clickElement = e.target as any as HTMLElement;

    const rect = clickElement.getBoundingClientRect();
    offset = e.clientX - rect.x - rect.width / 2;
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    offset = 0;
    clickElement = null;
  };

  const onMouseMove = (e: MouseEvent) => {
    cb(e.clientX - offset, clickElement!);
  };

  trigger.addEventListener('mousedown', onMouseDown);
};