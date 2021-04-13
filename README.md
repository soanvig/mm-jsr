# mm-jsr

**This is development branch**

For v1 (old version) documentation see [v1 branch](https://github.com/soanvig/jsr/tree/v1)

---

M&M JS Range (M&M JSR v2) provides You with excellent solution for creating so-called range-inputs.

Range input is form's field where one can choose a value from min-max range.
Although HTML 5 comes with input[type="range"] its functionality lacks a lot of features.
M&M JSR gives You anything You may need.

Homepage and demo: https://mm-jsr.github.io/

Browser support: Firefox, Chrome (and Chromium forks, like: Brave, Edge, Opera, Vivaldi)

LGPLv3 license doubts are [explained here](#license-explanation)

## Features

- screen responsivity,
- custom minimum and maximum values (including negative numbers),
- custom step of values (literally custom, it can be 0.001, 2 or 100),
- any number of sliders,
- collapsing labels,
- fully and **easily** customizable through CSS and configuration,
- support for touch devices,
- support for keyboard,
- and other!

## Advantages

- lightweight,
- performant,
- customizable,
- no dependencies.

## Quick-start

1. Install

  ```
  npm install --save mm-jsr

  or

  yarn add mm-jsr
  ```

2. Include

  ```
  import JSR from 'mm-jsr';
  
  or

  const JSR = require('mm-jsr');

  or

  <script src="https://unpkg.com/browse/mm-jsr/build/index.js"></script>
  (which makes variable JSR available globally)
  ```

3. Add CSS (you can use basic styles from [here](./styles.css))

4. Instantiate JSR

  ```js
    const jsr = new JSR({
      modules: [
        new JSR.Rail(),
        new JSR.Slider(),
        new JSR.Bar(),
        new JSR.Label(),
        new JSR.Grid(),
        new JSR.Limit(),
      ],
      config: {
        min: 0,
        max: 100,
        step: 0.01,
        limit: {
          min: 15,
          max: 90,
        },
        initialValues: [25, 50, 75],
        container: document.getElementById('jsr'),
        formatter: String,
      }
    });
  ```

## Configuration and API

See docs (@TODO)

## Keyboard support

JSR supports keyboard control. First of all one of sliders needs to be focused (by TAB or by click).

- By clicking `left/right arrow` the value is changed by `options.step`.
- If the `CTRL` is pressed along with arrow, the value is changed by `options.step x10`.
- If the `SHIFT` is pressed along with arrow, the value is changed by `range x5%` (by the 5% of whole range).

NOTE: In case of `SHIFT` and `CTRL` keys pressed simultaneously, `SHIFT` takes priority.

## Modules

Modules are HTML elements rendered into JSR container.
All modules are optional. The most basic slider is built of Slider and Rail modules.

name | description | invocation | options
--- | --- | --- | ---
slider | moveable dots/points | new JSR.Slider() | -
rail | horizontal clickable bar behind sliders | new JSR.Rail() | -
bar | moveable bar between sliders (moving adjacent sliders) | new JSR.Bar() | -
label | moveable labels beneath sliders  | new JSR.Label() | -
grid | vertical bar beneath sliders | new JSR.Grid(options) | @TODO
limit | visual representation of limit configuration | new JSR.Limit() | -

If You don't see a module here, that suits your case, **You can create one by yourself**.
Modules created that way are applicable via configuration option, so You don't have to make changes to library code.

You may want to see [./CONTRIBUTING.md](./CONTRIBUTING.md#creating-new-modules) for more information.

## License explanation

`mm-jsr` uses LGPLv3 license. It means, that You can:

1. use library in closed-source projects
2. redistribute the code (preserving authorship)
3. make changes to the code

However, if you decide to make changes to the library code, You **has to** publish them under LGPLv3 license.
This way library legally always stays open source and free.

The best way to make changes is to create public fork of the library.

If You don't plan to add any malicious behavior to the library, this license should not be harmful for You in any way.

It is also *expected*, that any plugins (extensions or modules) added to library via configuration, are respecting final user freedom,
and are not spying on his actions perfomed over such module without his knowledge and approval.

## Migration guide: v1 -> v2

Basically You need to implement it from the ground up.

CSS are similar, but differ in details: basically because HTML is different (flat, not nested).

JSR instance API is completely different, although features are almost the same (v2 should contain most of the v1 features).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for information about how to contribute and current contributors.
