import { expect, test } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { useJSR } from './index';
import { ModuleRail, ModuleSlider, ModuleBar, ModuleLabel } from 'mm-jsr';

const Component = () => {
  const { ref: jsrRef } = useJSR({
    modules: [new ModuleRail(), new ModuleSlider(), new ModuleBar(), new ModuleLabel()],
    config: {
      min: 0,
      max: 100,
      step: 1,
      initialValues: [25, 75],
    },
  });

  return React.createElement('div', { ref: jsrRef }, null);
};

const Wrapper = () => React.createElement(Component, null, null);

test('Renders', () => {
  const { container } = render(Wrapper());

  expect(container.querySelector('.jsr_rail')).toBeTruthy();
});
