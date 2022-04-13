import test from 'ava';
import React, { useState } from 'react';
import { render, waitFor } from '@testing-library/react';
import { useJSR } from './index';
import { JSR, ModuleRail, ModuleSlider, ModuleBar, ModuleLabel } from 'mm-jsr';

const Component = () => {
  const { ref: jsrRef, instance } = useJSR({
    modules: [
      new ModuleRail(),
      new ModuleSlider(),
      new ModuleBar(),
      new ModuleLabel(),
    ],
    config: {
      min: 0,
      max: 100,
      step: 1,
      initialValues: [25, 75],
    },
  });

  return React.createElement(
    'div',
    { ref: jsrRef },
    null,
  );
};

const Wrapper = () => React.createElement(Component, null, null);

test('Renders', t => {
  const { container } = render(Wrapper());

  t.truthy(container.querySelector('.jsr_rail'));
});
