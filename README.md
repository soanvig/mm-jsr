# mm-jsr

M&M JS Range (M&M JSR v2) provides You with excellent solution for creating so-called range-inputs.

Range input is form's field where one can choose a value from min-max range.
Although HTML 5 comes with input[type="range"] its functionality lacks a lot of features.
M&M JSR gives You anything You may need.

Homepage: https://mm-jsr.github.io/

Browser support: Firefox, Chrome (and Chromium forks, like: Brave, Edge, Opera, Vivaldi)

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

  <script src="https://unpkg.com/browse/mm-jsr@1.1.6/build/main.js"></script>
  (which makes variable JSR available globally)
  ```

3. Add CSS

4. Instantiate

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

## Keyboard

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

## License explanation

`mm-jsr` uses LGPLv3 license. It means, that You can:

1. use library in closed-source projects
2. redistribute the code (preserving authorship)
3. make changes to the code

However, if you decide to make changes to the library code, You **has to** publish them under LGPLv3 license.
This way library legally always stays open source and free.

The best to make changes is to create public fork of the library.

If You don't plan to add any malicious behavior to the library, this license should not be harmful for You in any way.

## Migration guide: v1 -> v2

Basically You need to implement it from the ground up.

CSS are similar, but differ in details: basically because HTML is different (flat, not nested).

JSR instance API is completely different, although features are almost the same (v2 should contain most of the v1 features).

## v1 contributors

Thanks to all contributors, which made v1 better version:

- [johnnyflinn](https://github.com/johnnyflinn) - setValue hotfix, ES5 build
- [Nufeen](https://github.com/Nufeen) - README revision
- [plumthedev](https://github.com/plumthedev) - fixed rounding number in grid display
- [sahithyen](https://github.com/sahithyen) - support for HDPI (grid)
- [Soanvig](https://github.com/soanvig) - maintainer (in sake of consistency :-) )

Besides that thanks to all people who tried to contribute by opening issues and PRs!