export const useOnMove = (trigger: HTMLElement, cb: (e: MouseEvent) => void) => {
  const onMouseDown = () => {
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    cb(e);
  };

  trigger.addEventListener('mousedown', onMouseDown);
};