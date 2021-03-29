interface Options {
  root: HTMLElement;
  onTouchDown: (e: Touch) => void;
  onTouchMove: (e: Touch) => void;
  onTouchUp: (e: Touch) => void;
}

export const useOnTouch = (el: HTMLElement, { onTouchDown, onTouchMove, onTouchUp, root }: Options) => {
  let isTouchDown = false;

  const handleStart = (e: TouchEvent) => {
    // this is called multiple times upon press
    const touch = e.targetTouches.item(0);

    if (touch) {
      document.documentElement.classList.add('jsr_lockscreen');

      onTouchDown(touch);

      isTouchDown = true;
    }
  };

  const handleEnd = (e: TouchEvent) => {
    const touch = e.changedTouches.item(0);

    if (touch) {
      document.documentElement.classList.remove('jsr_lockscreen');

      onTouchUp(touch);

      isTouchDown = false;
    }
  };

  const handleMove = (e: TouchEvent) => {
    const touch = e.targetTouches.item(0);

    if (touch && isTouchDown) {
      onTouchMove(touch);
    }
  };

  el.addEventListener('touchstart', handleStart);
  document.addEventListener('touchmove', handleMove);
  document.addEventListener('touchend', handleEnd);

  // @TODO remove events
};
