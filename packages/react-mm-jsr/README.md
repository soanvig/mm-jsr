# react-mm-jsr

Official React adapter for [mm-jsr](https://github.com/soanvig/mm-jsr). Visit link for more information about library.

---

**mm-jsr** provides You with excellent solution for creating so-called range-inputs.

Range input is form's field where one can choose a value from min-max range.
Although HTML 5 comes with input[type="range"] its functionality lacks a lot of features.
**mm-jsr** gives You anything You may need.

## Installation

1. Install packages

  ```
  npm install --save mm-jsr react-mm-jsr

  or

  yarn add mm-jsr react-mm-jsr
  ```

  (it is also available in [unpkg](https://unpkg.com/react-mm-jsr/build/index.js) with variable name `ReactJSR`. Remember to include `mm-jsr` (JSR) as well, and lock version)

2. Add CSS (you can use basic styles from [here](../mm-jsr/styles.css))

3. Instantiate (see [docs](https://soanvig.github.io/mm-jsr/api/index.html) for more information about configuration and modules)

  ```jsx
  import { ModuleRail, ModuleSlider, ModuleBar, ModuleLabel } from 'mm-jsr';
  import { useJSR } from 'react-mm-jsr';

  function MyComponent () {
    const { ref: jsrRef, instance: jsrInstance } = useJSR({
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

    return (<div ref={jsrRef} />);
  }
  ```

## Important notes

`instance` returned from `useJSR` is not available immediately, because JSR mounts itself after component.
Underhood it uses `useState` for storing instance.

Therefore each usage must check for instance existence, and usage in hooks have to use instance as dependency.

## Handling onValueChange

To handle onValueChange you may use this code

```js
useEffect(() => {
  if (jsrInstance) {
    return jsrInstance.onValueChange(console.log);
  }
}, [jsrInstance]);
```

As `onValueChange` returns function, that will unsubscribe the handler, it can be used naturally with React's `useEffect`.

## Styling

Because you mount JSR by using `ref`, you have full control over JSR parent element.

So by applying class to that element, and then wrapping [default styles](../mm-jsr/styles.css) with applied class,
you can have styled and scoped JSR.

The same works for `styled-components`:

```js
const JsrContainer = styled.div`
    display: block;
    position: relative;
    padding-top: 10px;
    width: 100%;
    ...

    .jsr_rail {
      height: 5px;
      background: #444;
    }

    ...
`;
```

**NOTE**: `.jsr` class is the container element itself.

**NOTE**: `.jsr_lockscreen` is applied to body, so it should be global.
See [docs on locking screen on touchevent](https://github.com/soanvig/mm-jsr#locking-screen-on-touchevent) for more info.