import { InputHandler } from '@/InputHandler';
import { Value } from '@/models/Value';
import { ModuleSlider } from '@/modules/ModuleSlider';
import { getInput } from '@/testHelpers/getInput';
import { getRenderer } from '@/testHelpers/getRenderer';
import test from 'ava';

test('keyboard arrows', async t => {
  await testKeyboard({ code: 'ArrowLeft' }, (index, value) => {
    t.is(index, 0);
    t.is(value.asReal(), 49);
  });

  await testKeyboard({ code: 'ArrowRight' }, (index, value) => {
    t.is(index, 0);
    t.is(value.asReal(), 51);
  });

  await testKeyboard({ code: 'ArrowDown' }, (index, value) => {
    t.is(index, 0);
    t.is(value.asReal(), 49);
  });

  await testKeyboard({ code: 'ArrowUp' }, (index, value) => {
    t.is(index, 0);
    t.is(value.asReal(), 51);
  });
});

test('keyboard shift - 5% move', async t => {
  // @NOTE
  // Math.round is legit here, because it would normally be rounded to step anyway
  // And we can get something like 55.0000000001

  await testKeyboard({ code: 'ArrowLeft', shiftKey: true }, (index, value) => {
    t.is(index, 0);
    t.is(Math.round(value.asReal()), 45);
  });

  await testKeyboard({ code: 'ArrowRight', shiftKey: true }, (index, value) => {
    t.is(index, 0);
    t.is(Math.round(value.asReal()), 55);
  });
});

test('keyboard ctrl - 10x step move', async t => {
  await testKeyboard({ code: 'ArrowLeft', ctrlKey: true }, (index, value) => {
    t.is(index, 0);
    t.is(value.asReal(), 40);
  });

  await testKeyboard({ code: 'ArrowRight', ctrlKey: true }, (index, value) => {
    t.is(index, 0);
    t.is(value.asReal(), 60);
  });
});

const testKeyboard = async (opts: KeyboardEventInit, test: (index: number, value: Value) => void) => {
  const renderer = getRenderer();
  const input = getInput({});

  await new Promise<void>(resolve => {
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

    sliderModule = new ModuleSlider({
      renderer,
      input: inputHandler,
      config: input.config,
    });

    sliderModule.initView();
    sliderModule.render(input.state);

    const slider = document.querySelector('.jsr_slider') as HTMLElement;
    slider.focus();

    slider.dispatchEvent(new window.KeyboardEvent('keydown', {
      ...opts,
      bubbles: true,
    }));
  });
};