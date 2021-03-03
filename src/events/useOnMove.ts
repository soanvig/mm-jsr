export const useOnMove = (trigger: HTMLElement, cb: (x: number) => void) => {
  // relative to trigger center
  let offset = 0;

  const onMouseDown = (e: MouseEvent) => {
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

    const rect = trigger.getBoundingClientRect();
    offset = e.clientX - rect.x - rect.width / 2;
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    offset = 0;
  };

  const onMouseMove = (e: MouseEvent) => {
    cb(e.clientX - offset);
  };

  trigger.addEventListener('mousedown', onMouseDown);
};