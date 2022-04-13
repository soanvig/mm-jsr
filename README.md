<div align="center">
  <img src="./logo.png" width="140px" align="right">
  <div align="left" font="16px">
    <h1>mm-jsr</h1>
    <div>
      <b>mm-jsr</b> provides You with excellent solution for creating so-called range-inputs.
    </div>
    <br>
    <div>
      Homepage and <strong>demo</strong>: https://soanvig.github.io/mm-jsr/
    </div>
  </div>
</div>

## Information

Range input is form's field where one can choose a value from min-max range.
Although HTML 5 comes with input[type="range"] its functionality lacks a lot of features.
**mm-jsr** gives You anything You may need.

Browser support: Firefox, Chrome (and Chromium forks, like: Brave, Edge, Opera, Vivaldi)

LGPLv3 license doubts are [explained here](#license-explanation)

For **framework adapters** see: [adapters section](#adapters)

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

- [lightweight (~18kB of minified, ~5kB of gzipped code)](https://bundlephobia.com/result?p=mm-jsr),
- performant,
- customizable,
- no dependencies,
- easy to wrap with UI library (React, Vue, Angular, Svelte, etc.) - see [adapters section](#adapters)

## Quick-start

1. Install

  ```
  npm install --save mm-jsr

  or

  yarn add mm-jsr
  ```

2. Include

  ```
  import { JSR } from 'mm-jsr';
  
  or

  const { JSR } = require('mm-jsr');

  or

  <script src="https://unpkg.com/mm-jsr/build/index.js"></script>
  (which makes variable JSR available globally - REMEMBER to lock the version by suffixing address with @version e.g.
  https://unpkg.com/mm-jsr/build/index.js@2.1.0)
  ```

3. Add CSS (you can use basic styles from [here](https://github.com/soanvig/mm-jsr/blob/master/packages/mm-jsr/styles.css))

4. Instantiate JSR

  ```js
    // NOTE: for unpkg skip import, and use `window.JSR.JSR`/`window.JSR.ModuleXXX`
    import { JSR, ModuleRail, ModuleSlider, ModuleBar, ModuleLabel } from 'mm-jsr';

    const jsr = new JSR({
      modules: [
        new ModuleRail(),
        new ModuleSlider(),
        new ModuleBar(),
        new ModuleLabel(),
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
      }
    });
  ```

## Configuration and API

[See docs](https://soanvig.github.io/mm-jsr/api/index.html)

## Adapters

JSR supports official adapters/implementation guides:

- [React](https://github.com/soanvig/mm-jsr/tree/master/packages/react-mm-jsr)
- [Svelte](https://github.com/soanvig/mm-jsr/tree/master/packages/svelte-mm-jsr)

## Important notes

### Locking screen on touchevent

Touch event on mobile devices is supported by JSR. Because moving the finger around the screen to move slider caused the view to go up and down, I decided to lock the screen on touch start. This means, that to document root `.jsr_lockscreen` class is applied, which sets the size of document root to window size. If it causes any problems, You can set `overflow: visible; width: auto; height: auto;` on `.jsr_lockscreen` class (or just remove this class from code), and report the issue through GitHub's issue system.

**Known issues**:
1. it may cause screen jump on mobile screens, because after locking screen the top address bar may disappear.

### Keyboard support

JSR supports keyboard control. First of all one of sliders needs to be focused (by TAB or by click).

- By clicking `left/right arrow` the value is changed by `options.step`.
- If the `CTRL` is pressed along with arrow, the value is changed by `options.step x10`.
- If the `SHIFT` is pressed along with arrow, the value is changed by `range x5%` (by the 5% of whole range).

NOTE: In case of `SHIFT` and `CTRL` keys pressed simultaneously, `SHIFT` takes priority.

## Modules

Modules are HTML elements rendered into JSR container.
They provide HTML representation of JSR state or config, and allow to provide input back to JSR state.
Also, they can manipulate state values.
All modules are optional. The most basic slider is built of Slider and Rail modules.

name | description | invocation | options
--- | --- | --- | ---
slider | moveable dots/points | new JSR.Slider() | [docs](https://soanvig.github.io/mm-jsr/api/classes/moduleslider.html)
rail | horizontal clickable bar behind sliders | new JSR.Rail() | [docs](https://soanvig.github.io/mm-jsr/api/classes/modulerail.html)
bar | moveable bar between sliders (moving adjacent sliders) | new JSR.Bar() | [docs](https://soanvig.github.io/mm-jsr/api/classes/modulebar.html)
label | moveable labels beneath sliders  | new JSR.Label(options) | [docs](https://soanvig.github.io/mm-jsr/api/classes/modulelabel.html)
grid | vertical bar beneath sliders | new JSR.Grid(options) | [docs](https://soanvig.github.io/mm-jsr/api/classes/modulegrid.html)
limit | visual representation of limit configuration | new JSR.Limit() | [docs](https://soanvig.github.io/mm-jsr/api/classes/modulelabel.html)

If You don't see a module here, that suits your case, **You can create one by yourself**.
Modules created that way are applicable via configuration option, so You don't have to make changes to library code.

You may want to see [./CONTRIBUTING.md](./CONTRIBUTING.md#creating-new-modules) for more information about creating new modules.

## License explanation

`mm-jsr` uses LGPLv3 license. It means, that You can:

1. use library in closed-source projects
2. redistribute the code (preserving authorship)
3. make changes to the code

However, if you decide to make changes to the library code, You **has to** publish them under LGPLv3 license.
This way library legally always stays open source and free.

The best way to make changes is to create public fork of the library.

If You don't plan to add any malicious behaviour to the library, this license should not be harmful for You in any way.

It is also *expected*, that any plugins (extensions or modules) added to library via configuration, are respecting final user freedom,
and are not spying on his actions performed over such module without his knowledge and approval.

## Migration guide: v2 -> v3

Accidentally in v2.2.2 breaking change was introduced which changed exports from package.

Please use `import { JSR, ModuleRail, ModuleXXX } from 'mm-jsr` or `window.JSR.JSR`/`window.JSR.ModuleXXX` (for unpkg import).

## Migration guide: v1 -> v2

Basically You need to implement it from the ground up.

CSS are similar, but differ in details: basically because HTML is different (flat, not nested).

JSR instance API is completely different, although features are almost the same (v2 should contain most of the v1 features).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for information about how to contribute and current contributors.
