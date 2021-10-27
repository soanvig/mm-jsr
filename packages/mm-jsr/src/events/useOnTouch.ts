interface Options {
  root: HTMLElement;
  onTouchDown: (e: Touch) => void;
  onTouchMove: (e: Touch) => void;
  onTouchUp: (e: Touch) => void;
}

type EventCb = (e: Event) => void;

/**
 * Helper for handling touch events (down, move, up, just like mouse)
 */
export const useOnTouch = (el: HTMLElement, { onTouchDown, onTouchMove, onTouchUp, root }: Options) => {
  let touchTarget: EventTarget | null = null;

  const handleStart = (e: TouchEvent) => {
    // this is called multiple times upon press
    const touch = e.targetTouches.item(0);

    if (touch && !touchTarget) {
      touchTarget = touch.target;

      // https://stackoverflow.com/questions/33298828/touch-move-event-dont-fire-after-touch-start-target-is-removed
      // html elements of label are rendered inside, and that breaks touch event
      touchTarget.addEventListener('touchmove', handleMove as EventCb);
      touchTarget.addEventListener('touchend', handleEnd as EventCb);

      document.documentElement.classList.add('jsr_lockscreen');

      onTouchDown(touch);
    }
  };

  const handleEnd = (e: TouchEvent) => {
    const changedTouch = e.changedTouches[0];

    document.documentElement.classList.remove('jsr_lockscreen');

    if (touchTarget && changedTouch) {
      touchTarget.removeEventListener('touchmove', handleMove as EventCb);
      touchTarget.removeEventListener('touchend', handleEnd as EventCb);
      touchTarget = null;

      onTouchUp(changedTouch);
    }
  };

  const handleMove = (e: TouchEvent) => {
    const changedTouch = e.changedTouches[0];

    if (touchTarget && changedTouch) {
      onTouchMove(changedTouch);
    }
  };

  el.addEventListener('touchstart', handleStart);
};
