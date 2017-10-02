# Mort&Mortis JS Range (M&M JSR)

**M&M JS Range** (*M&M JSR*) is library for JavaScript. It provides You with excellent solution for creating so-called *range-inputs*. Range input is form's field where one can choose a value from min-max *range*. Although HTML 5 comes with `input[type="range"]` its functionality lacks a lot of features. M&M JSR gives You anything You may need.

Newest version: **0.1.0beta**

Browser support: Firefox, Chrome, others not tested (yet).

## Table of content

<!-- TOC -->

- [Mort&Mortis JS Range (M&M JSR)](#mortmortis-js-range-mm-jsr)
    - [Table of content](#table-of-content)
    - [Features and advantages](#features-and-advantages)
        - [Features](#features)
        - [Advantages](#advantages)
    - [Installation](#installation)
        - [Manual](#manual)
        - [NPM & import](#npm--import)
    - [Usage](#usage)
        - [JSR instance](#jsr-instance)
        - [Configuration: setting options via JS](#configuration-setting-options-via-js)
        - [Setting values of range programmatically](#setting-values-of-range-programmatically)
        - [Keyboard](#keyboard)
    - [CSS configuration](#css-configuration)
        - [Merged labels in general, and their separator](#merged-labels-in-general-and-their-separator)
        - [Locking screen on touchevent](#locking-screen-on-touchevent)
    - [Demo](#demo)
    - [Modules information](#modules-information)
        - [HTML Label support](#html-label-support)

<!-- /TOC -->

## Features and advantages

### Features

- new technologies,
- custom minimum and maximum values (including negative numbers),
- custom step of values (literally custom, it can be 0.001, 2 or 100),
- any number of sliders,
- collapsing labels,
- fully and **easily** customizable through CSS and configuration,
- affixes for labels,
- support for touch devices (**not tested well yet**),
- support for keyboard,
- support for screen-readers (**not implemented yet**).

### Advantages

- lightweight,
- customizable,
- disabled people wise,
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
  
### NPM & import

1. Install via npm: 

    `npm install mm-jsr`

2. Include in your JS code:

    `import 'mm-jsr';`

    Due to pro-browser bundling, it's impossible to include JSR with `[name] from` directive.

3. Add CSS code in HTML `<head>` section:

    `<link rel="stylesheet" href="node_modules/mm-jsr/dist/assets/css/mm-jsr.css">`

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

    - Inputs **must** be provided as CSS selector rule, as string (if one slider) or as array of strings (if one or more sliders).
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
    affixes: {
      prefix: '', // Text before value in label (i.e. '$ ')
      suffix: '' // Text after value in label (i.e. ' $')
    },
    minMax: true // Boolean if minimum and maximum labels should be displayed (applies CSS display: none;)
  },
  log: 'error' // available values: 'debug', 'info', 'warn', 'error'
}
```

Custom options should go together with `sliders` and `values` options in JSR constructor (see example).

### Setting values of range programmatically

Values of sliders can be set programmatically via JS:

```js
const range = new JSR(['#jsr-1-1', '#jsr-1-2', '#jsr-1-3'], {
    sliders: 3,
    values: [25, 50, 75]
});
// Later in code:
range.setValue(0, 40); // where 0 is the 0-index number of slider, and 40 is the value
```

### Keyboard

JSR supports keyboard control. First of all one of sliders needs to be focused (by TAB or by click). 

- By clicking `left/right arrow` the value is changed by `options.step`. 
- If the `CTRL` is pressed along with arrow, the value is changed by `options.step x10`.
- If the `SHIFT` is pressed along with arrow, the value is changed by `range x5%` (by the 5% of whole range).

NOTE: In case of `SHIFT` and `CTRL` keys pressed simultaneously, `SHIFT` takes priority.

## CSS configuration

JSR relies on CSS as much as possible. JSR CSS selectors are written in BEM methodology, which means,
that the specificity is as flat as possible. You should have no problems with overwriting styles.

Everything (sliders, labels, bars) work in % positions, which means that the position of elements should be
window size-independent.

### Merged labels in general, and their separator

Because merging labels is created through inserting on DOM level following label into preceding label, the merged label can be accessed by `.jsr_label .jsr_label` selector. By default this style removes padding, fixes font-size, and such things.

The labels are separated by pseudo-element `.jsr_label .jsr_label::before`. It's `content` property is the separator. By default it is: `content: ' - ';`.

### Locking screen on touchevent

Touch event on mobile devices is supported by JSR. Because moving the finger around the screen to move slider caused the view to go up and down, I decided to lock the screen on touch start. This means, that to document root `.jsr_lockscreen` class is applied, which sets the size of document root to window size. If it causes any problems, You can set `overflow: visible; width: auto; height: auto;` on `.jsr_lockscreen` class, and report the issue through GitHub's issue system.

## Demo

https://mm-jsr.github.io/mm-jsr/#demo

## Modules information

### HTML Label support

HTML Label support module enables support for focusing sliders by clicking on appropriate label.
Since `<label>` is connected with its input by `[for]` attribute, it's necessary to [connect it properly](https://developer.mozilla.org/pl/docs/Web/HTML/Element/label#Using_the_for_attribute). Clicking on label focuses connected input (slider).
