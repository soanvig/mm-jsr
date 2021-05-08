import test from 'ava';
import React, { useState } from 'react';
import { render } from '@testing-library/react';

const Component = () => {
  const [] = useState();

  return React.createElement(
    'div',
    null,
    null,
  );
};

const Wrapper = () => React.createElement(
  'div',
  null,
  Component,
);

test('Renders', t => {
  const { container } = render(Wrapper());

  t.truthy(container.querySelector('.jsr_rail'));
});
