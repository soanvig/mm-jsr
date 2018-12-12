# Mort&Mortis JS Range (M&M JSR)

**M&M JS Range** (*M&M JSR*) is library for JavaScript. It provides You with excellent solution for creating so-called *range-inputs*. Range input is form's field where one can choose a value from min-max *range*. Although HTML 5 comes with `input[type="range"]` its functionality lacks a lot of features. M&M JSR gives You anything You may need.

Homepage: [https://mm-jsr.github.io/](https://mm-jsr.github.io/)

Newest version: **1.1.3**

Tested browser support: Firefox (57+), Chrome (63+), Edge (41+), Safari (11.1+)

## What's new?

v1.1.0 adds `.refresh()` method, and rebuilds whole project structure resulting in easier code maintaining.

v1.1.1 hotfix.
v1.1.2 hotfix.
~~v1.1.3~~
v1.1.4 #37


## Contributing

[CONTRIBUTING.md](CONTRIBUTING.md)

## Table of content

<!-- TOC -->

- [Mort&Mortis JS Range (M&M JSR)](#mortmortis-js-range-mm-jsr)
    - [What's new?](#whats-new)
    - [Contributing](#contributing)
    - [Table of content](#table-of-content)
    - [Features and advantages](#features-and-advantages)
        - [Features](#features)
        - [Advantages](#advantages)
    - [Installation](#installation)
        - [Manual](#manual)
        - [NPM & modules](#npm-modules)
    - [Usage](#usage)
        - [JSR instance](#jsr-instance)
        - [Configuration: setting options via JS](#configuration--setting-options-via-js)
        - [Keyboard](#keyboard)
    - [API](#api)
        - [Setting values](#setting-values)
        - [Listening on internal events](#listening-on-internal-events)
        - [Disabling/enabling slider](#disabling-enabling-slider)
        - [Limit values](#limit-values)
        - [Refresh](#refresh)
    - [CSS configuration](#css-configuration)
        - [Slider dot](#slider-dot)
        - [Active slider](#active-slider)
        - [Focus slider](#focus-slider)
        - [Merged labels in general, and their separator](#merged-labels-in-general--and-their-separator)
        - [Locking screen on touchevent](#locking-screen-on-touchevent)
    - [Demo](#demo)
    - [Modules information](#modules-information)
        - [Grid](#grid)
        - [Labels formatter](#labels-formatter)
        - [Disabling modules](#disabling-modules)
        - [HTML Label support](#html-label-support)
    - [Contributors](#contributors)

<!-- /TOC -->

## Features and advantages

### Features

- resolution responsivity, due to use of percentage values,
- custom minimum and maximum values (including negative numbers),
- custom step of values (literally custom, it can be 0.001, 2 or 100),
- any number of sliders,
- collapsing labels,
- fully and **easily** customizable through CSS and configuration,
- formatter for labels,
- support for touch devices,
- support for keyboard,
- support for screen-readers (**not implemented yet**).

### Advantages

- lightweight,
- customizable,
- disabled people wise (**not implemented yet**),
- no dependencies (pure JavaScript),
- multiple instances and zero conflicts,
- sends value to inputs, so they can be easily send via form,
- free.

## Installation

### Manual

1. Clone the repository:

    `git clone https://github.com/mm-jsr/jsr.git`

    Or download it manually through GitHub site.

2. Include in your code:

    In HTML `<head>` section:

    `<link rel="stylesheet" href="[path_to_jsr_directory]/dist/assets/css/mm-jsr.css">`

    And in HTML scripts section (in example in the end of body:)

    `<script src="[path_to_jsr_directory]/dist/main.js"></script>`

### NPM & modules

1. Install via npm:

    `npm install mm-jsr`

2. Include in your JS code:

    `import JSR from 'mm-jsr';`

    **or**, depending on your module system:

    `const JSR = require('mm-jsr')`;

    Since JSR is packed as UMD bundle, You can include also directly as JSR:

    `import 'mm-jsr';`

3. Add CSS:

    In your `<head>` section:

    `<link rel="stylesheet" href="node_modules/mm-jsr/dist/assets/css/main.css">`

    **or** to the imports section of your css file (considering your bundling tool resolves your `node_modules` folder):

    `@import 'mm-jsr/dist/assets/css/main.css'`

    **or** (in your JS code) if your bundling tool resolves `node_modules` and allows to load all assets from JS (Webpack does):

    `import 'mm-jsr/dist/assets/css/main.scss'`

## Usage

For simple implementation see [dist/index.html](https://github.com/mm-jsr/jsr/blob/master/dist/index.html) in repository.

### JSR instance

The example below will create range with 3 sliders of values: 25, 50, 75 from 0-100 range (which is default).

1. Create HTML:

    - HTML **must** be builded of n-inputs, where `n` is the number of sliders You want to use.
    - Each input **should** have it's unique `[id]` (though it's not necessary).
    - Input's validation rules (that includes `[min|max]` attributes if `[type="range"]`) **must** allow *numbers* from *range* min-max (which is 0-100 by default, other if set via configuration) with optional decimals.

    ```html
    <input id="jsr-1-1" name="range1" type="range" min="0" max="100" step="1" value="25">
    <input id="jsr-1-2" name="range2" type="range" min="0" max="100" step="1" value="50">
    <input id="jsr-1-3" name="range3" type="text" value="75">
    ```

2. Create instance of JSR on inputs, and set it's starting values, and number of sliders You want to use:

    - Inputs **must** be provided as CSS selector rule, as string (if one slider) or as array of strings (if one or more sliders) **or must** be provided as DOM objects or array of DOM objects.
    - Number of sliders **must** match the number of inputs.
    - Number of values **must** match the number of sliders.
    - Values **should** match min-max range.

    ```js
    new JSR(['#jsr-1-1', '#jsr-1-2', '#jsr-1-3'], {
        sliders: 3,
        values: [25, 50, 75]
    });
    ```

### Configuration: setting options via JS

Options object with defaults looks like follows:

```js
{
  min: 0, // Minimal value
  max: 100, // Maximum value
  step: 1, // Step of values. It can be any value (10, 1, 0.1, 0.01 and so on)
  values: [25, 75], // Values from smallest to biggest
  labels: { // Configuration for labels
    minMax: true, // Boolean if minimum and maximum labels should be displayed (applies CSS display: none;)
    formatter: null
  },
  limit: {
      show: false // Determines, if the limit should be visible on bar or not.
  },
  grid: {
    color: 'rgba(0, 0, 0, 0.3)', // Color of bars and text of grid. Can by any CSS color.
    height: 10, // Height of bars of grid.
    fontSize: 10, // Font size of text (in pixels).
    fontFamily: 'sans-serif', // Font family of text (any CSS font-family value).
    textPadding: 5 // Vertical distance between text and bars (in pixels).
  }
  log: 'error' // available values: 'debug', 'info', 'warn', 'error'
}
```

Custom options should go together with `sliders` and `values` options in JSR constructor (see example).

### Keyboard

JSR supports keyboard control. First of all one of sliders needs to be focused (by TAB or by click).

- By clicking `left/right arrow` the value is changed by `options.step`.
- If the `CTRL` is pressed along with arrow, the value is changed by `options.step x10`.
- If the `SHIFT` is pressed along with arrow, the value is changed by `range x5%` (by the 5% of whole range).

NOTE: In case of `SHIFT` and `CTRL` keys pressed simultaneously, `SHIFT` takes priority.

## API

Most of the API methods return `this`, so methods can be chained one by one.

### Setting values

Values of sliders can be set programmatically via JS:

```js
const range = new JSR(['#jsr-1-1', '#jsr-1-2', '#jsr-1-3'], {
    sliders: 3,
    values: [25, 50, 75]
});
// Later in code:
range.setValue(0, 40); // where 0 is the 0-index number of slider, and 40 is the value
```

### Listening on internal events

You can listen on certain events, by executing `.addEventListener(event, callback)` method on JSR instance.

```js
const range = new JSR(['#jsr-1-1', '#jsr-1-2', '#jsr-1-3'], {
    sliders: 3,
    values: [25, 50, 75]
});
range.addEventListener('update', (input, value) => {
    console.log(input, value);
});
```

Available event names and their callback arguments:

- `update` - `([NodeElement] input, [Integer/Float] value)` - called by InputUpdate module after updating input's value.

### Disabling/enabling slider

At any time methods `.enable()` and `.disable()` can be called to enable/disable slider.

Slider, while disabled, will have `.jsr--disabled` class.

### Limit values

It is possible to programmaticaly change minimum and maximum values the sliders can achieve. It is called *limit*.

It can be done via config or `.setLimit(limit, value)` API option.

```js
    new JSR('...', {
        ...
        limit: {
            show: [boolean], // Defaults to false. Limit works even if `show` is false!
            min: [value],
            max: [value]
        }
        ...
    });
```

```js
    jsr.setLimit('min', 25).setLimit('max', 70);
```

Limit cannot be set to value bigger than min/max.

**BEWARE**: setting new limit (via API) refreshes all values to ensure noone exceeds the limit.
This cause *n* refresh events to be called.

If you change the `show` property after initializing JSR, some limit need to be set to update visibility state.

To disable limit set it to `null`.

### Refresh

If you want to change configuration (in example `min/max` values) you may want to refresh state of application.

```js
    jsr.refresh(config = {}, moduleName = null);
```

It is possible to refresh state of any of the module listed below, or all at once (by calling `.refresh() without moduleName)`:
- core
- grid
- labels

**Example:**

```js
    jsr.refresh(config = {
        min: -50,
        max: 100,
        limit: {
            min: 25
        }
    });
```

**BEWARE**: this function is very bug-vulnerable. If you encounter any bug using this function to update config, report it immediately to [issues](https://github.com/mm-jsr/jsr/issues), please!

## CSS configuration

JSR relies on CSS as much as possible. JSR CSS selectors are written in BEM methodology, which means,
that the specificity is as flat as possible. You should have no problems with overwriting styles.

Everything (sliders, labels, bars) work in % positions, which means that the position of elements should be
window size-independent.

See default styles in [style file](src/assets/scss/main.scss).

### Slider dot

Since slider is bigger than the dot itself to make targetting easier, the dot is painted on `::before` pseudoelement.

### Active slider

When moving slider by mouse (or finger) slider receives `.jsr_slider--active` class which indicates, that this slider is moving. It is removed after releasing mouse button (finger). It is not styled by default. It doesn't work if bars are dragged.

### Focus slider

Every slider can be focused by keyboard or by clicking. Style with `.jsr_slider:focus`.

### Merged labels in general, and their separator

Because merging labels is created through inserting on DOM level following label into preceding label, the merged label can be accessed by `.jsr_label .jsr_label` selector. By default this style removes padding, fixes font-size, and such things.

The labels are separated by pseudo-element `.jsr_label .jsr_label::before`. It's `content` property is the separator. By default it is: `content: ' - ';`.

### Locking screen on touchevent

Touch event on mobile devices is supported by JSR. Because moving the finger around the screen to move slider caused the view to go up and down, I decided to lock the screen on touch start. This means, that to document root `.jsr_lockscreen` class is applied, which sets the size of document root to window size. If it causes any problems, You can set `overflow: visible; width: auto; height: auto;` on `.jsr_lockscreen` class, and report the issue through GitHub's issue system.

**Issue**: it may cause screen jump on mobile screens, because after locking screen the top address bar may disappear.

## Demo

https://mm-jsr.github.io/#demo

## Modules information

### Grid

A grid displays vertical bars, by default beneath the bar, which help to target values on bar. The grid is clickable, just like bar.

Some of the range solutions use multiple divs to draw bars. JSR uses canvas, because it's far faster solution, and it doesn't pollute DOM.

Since the canvas has JS-only side, bars' color can be set only via JS by `grid.color` option. It tolerates any [CSS color values](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors). If you want to have grid displayed and text hidden, just set text color to `rgba(0, 0, 0, 0)` (transparent).

Grid uses `config.labels.formatter` to format text.

### Labels formatter

By default labels shows the actual value of input, but the `config.labels.formatter` can be set to any function, which returned value will be displayed to the user as label. The function is provided with a current slider value as first argument.

This is an example of JSR configuration which enables to choose between dates (DD-MM-YYYY) 01-01-2017 and 30-12-2017:

```js
new JSR(['#range-7-1'], {
    sliders: 1, // Only one date
    values: [1], // Whatever, will be set to minimum anyway, can be current date timestamp
    min: 1483228801000, // timestamp of minimum value (01-01-2017)
    max: 1514678399000, // timestamp of maximum value (30-12-2017)
    step: 1000 * 60 * 60 * 24, // full day (mili * seconds * minutes * hours)
    labels: {
        formatter: function (value) {
            const date = new Date(value); // Get date from value
            const day = date.getUTCDate(); // Get day
            const month = date.getMonth() + 1; // Get month
            const year = date.getUTCFullYear(); // Get year
            return `${day}-${month}-${year}`; // Display
        }
    }
});
```

### Disabling modules

Some of the modules can be safely disabled:

- `labels`
- `htmlLabels`
- `touchSupport`
- `inputUpdater`
- `grid`

by setting `modules[moduleName]` to false in JSR configuration.

### HTML Label support

HTML Label support module enables support for focusing sliders by clicking on appropriate label.
Since `<label>` is connected with its input by `[for]` attribute, it's necessary to [connect it properly](https://developer.mozilla.org/pl/docs/Web/HTML/Element/label#Using_the_for_attribute). Clicking on label focuses connected input (slider).

## Contributors

Thanks to all contributors whose PR's have been merged:

- [johnnyflinn](https://github.com/johnnyflinn) - setValue hotfix, ES5 build
- [Nufeen](https://github.com/Nufeen) - README revision
- [sahithyen](https://github.com/sahithyen) - support for HDPI (grid)
- [Soanvig](https://github.com/soanvig) - maintainer (in sake of consistency :-) )

Besides that thanks to all people who tried to contribute by opening issues and PRs!
