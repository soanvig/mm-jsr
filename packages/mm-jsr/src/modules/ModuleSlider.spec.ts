import { InputHandler } from '../InputHandler';
import { Value } from '../models/Value';
import { ModuleSlider } from '../modules/ModuleSlider';
import { getInput } from '../testHelpers/getInput';
import { getRenderer } from '../testHelpers/getRenderer';
import { expect, test } from 'vitest';

test('keyboard arrows', async () => {
  await testKeyboard({ code: 'ArrowLeft' }, (index, value) => {
    expect(index).toBe(0);
    expect(value.asReal()).toBe(49);
  });

  await testKeyboard({ code: 'ArrowRight' }, (index, value) => {
    expect(index).toBe(0);
    expect(value.asReal()).toBe(51);
  });

  await testKeyboard({ code: 'ArrowDown' }, (index, value) => {
    expect(index).toBe(0);
    expect(value.asReal()).toBe(49);
  });

  await testKeyboard({ code: 'ArrowUp' }, (index, value) => {
    expect(index).toBe(0);
    expect(value.asReal()).toBe(51);
  });
});

test('keyboard shift - 5% move', async () => {
  // @NOTE
  // Math.round is legit here, because it would normally be rounded to step anyway
  // And we can get something like 55.0000000001

  await testKeyboard({ code: 'ArrowLeft', shiftKey: true }, (index, value) => {
    expect(index).toBe(0);
    expect(Math.round(value.asReal())).toBe(45);
  });

  await testKeyboard({ code: 'ArrowRight', shiftKey: true }, (index, value) => {
    expect(index).toBe(0);
    expect(Math.round(value.asReal())).toBe(55);
  });
});

test('keyboard ctrl - 10x step move', async () => {
  await testKeyboard({ code: 'ArrowLeft', ctrlKey: true }, (index, value) => {
    expect(index).toBe(0);
    expect(value.asReal()).toBe(40);
  });

  await testKeyboard({ code: 'ArrowRight', ctrlKey: true }, (index, value) => {
    expect(index).toBe(0);
    expect(value.asReal()).toBe(60);
  });
});

const testKeyboard = async (
  opts: KeyboardEventInit,
  test: (index: number, value: Value) => void,
) => {
  const renderer = getRenderer();
  const input = getInput({});

  await new Promise<void>((resolve) => {
    let sliderModule: ModuleSlider | null = null;

    const inputHandler = InputHandler.init({
      onChange: (index, value) => {
        test(index, value);

        sliderModule?.destroy();

        resolve();
      },
      config: input.config,
      getState: () => input.state,
    });

    sliderModule = new ModuleSlider().init({
      renderer,
      input: inputHandler,
      config: input.config,
      name: 'ModuleSlider',
    });

    sliderModule.initView();
    sliderModule.render(input.state);

    const slider = document.querySelector('.jsr_slider') as HTMLElement;
    slider.focus();

    slider.dispatchEvent(
      new window.KeyboardEvent('keydown', {
        ...opts,
        bubbles: true,
      }),
    );
  });
};
