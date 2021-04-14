interface Options {
  onMouseDown: (e: MouseEvent) => void;
  onMouseMove: (e: MouseEvent) => void;
  onMouseUp: (e: MouseEvent) => void;
}

export const useOnMouse = (el: HTMLElement, { onMouseDown, onMouseMove, onMouseUp }: Options) => {
  const handleDown = (e: MouseEvent) => {
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('mousemove', handleMove);

    onMouseDown(e);
  };

  const handleUp = (e: MouseEvent) => {
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('mouseup', handleUp);

    onMouseUp(e);
  };

  const handleMove = (e: MouseEvent) => {
    onMouseMove(e);
  };

  el.addEventListener('mousedown', handleDown);
};
