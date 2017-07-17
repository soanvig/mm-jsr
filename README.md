# Mort&Mortis JS Range (M&M JSR)

**M&M JS Range** (*M&M JSR*) is library for JavaScript. It provides You with excellent solution for creating so-called *range-inputs*. Range input is form's field where one can choose a value from min-max *range*. Although HTML 5 comes with `input[type="range"]` its functionality lacks a lot of features. M&M JSR gives You anything You may need.

Newest version: **0.0.2beta**

## Table of content
<!-- TOC -->

- [Mort&Mortis JS Range (M&M JSR)](#mortmortis-js-range-mm-jsr)
    - [Table of content](#table-of-content)
    - [Features and advantages](#features-and-advantages)
        - [Features](#features)
        - [Advantages](#advantages)
        - [Disadvantages](#disadvantages)
    - [Installation](#installation)
    - [Usage](#usage)
        - [Single slider](#single-slider)
        - [Double slider](#double-slider)
        - [Setting options via HTML](#setting-options-via-html)
        - [Setting options via JS](#setting-options-via-js)
        - [Setting values of range programmatically](#setting-values-of-range-programmatically)
        - [Prefixes and suffixes](#prefixes-and-suffixes)
        - [Keyboard](#keyboard)
        - [Grid](#grid)
    - [Demo](#demo)

<!-- /TOC -->

## Features and advantages

### Features

- new technologies,
- custom minimum and maximum values (including negative numbers),
- custom step of values (literally custom, it can be 0.001, 2 or 100),
- single slider (single value),
- double sliders (from-to values),
- collapsing labels,
- fully and **easily** customizable through CSS,
- prefixes, suffixes for labels,
- support for touch devices (**not tested well yet**),
- support for keyboard,
- support for screen-readers (**not implemented yet**),
- support for labels,
- grid/ruler representing values on slider.

### Advantages

- lightweight,
- performance wise,
- customizable,
- disabled people wise,
- no dependencies (pure JavaScript),
- multiple instances and zero conflicts,
- sends value to inputs, so they can be easily send via form,
- free.

### Disadvantages

- requires modern browser due to use of ES6

## Installation

1. Clone the repository:

    `git clone https://github.com/mm-jsr/jsr.git`

    Or download it manually through GitHub site.

2. Include in your code:

    In HTML `<head>` section:

    `<link rel="stylesheet" href="[path_to_jsr]/mm-jsr.css">`

    And in HTML scripts section (in example in the end of body:)

    `<script src="[path_to_jsr]/mm-jsr.min.js></script>`

## Usage

For simple implementation see `mm-jsr-example.html` in repository.

### Single slider

1. Create HTML:

    ```html
    <input id="jsrSingle" name="range" type="range" min="50" max="200" step="1" value="150">
    ```

2. Create instance of JSR, and point, that this is single slider:

    ```js
    new JSRange('#jsrSingle', '', {
        single: true
    });
    ```

    Note the second argument is empty string. It is in fact *fallback* for second input (see **Double slider**).

### Double slider

1. Create HTML:

    ```html
    <input id="jsrMin" name="range[min]" type="range" min="50" max="200" step="1" value="150">
    <input id="jsrMax" name="range[max]" type="range" value="175">
    ```
   
    Note we need two fields - one for passing selected minimum value, and second for maximum value.

2. Create instance of JSR:

    ```js
    new JSRange('#jsrMin', '#jsrMax', {});
    ```

### Setting options via HTML

JSR can be configured via HTML attributes on input:

- `min="x"` - set the minimum value of range
- `max="x"` - set the maximum value of range
- `step="x"` - the step between each value of range
- `value="x"` on `min input` - the preset value of `from` slider
- `value="x"` on `max input` - the preset value of `to` slider

All of those values are HTML-valid.

**Beware**: options (like `min`, `max` or `step`) for JSR are taken from `min input`. This means, that any options set on `max input` will be ignored (with the exception of `value` of course).

In case of not setting any `value`, the `from` will be equal to `min`, and `to` will be equal to `max`.

### Setting options via JS

JSR can be also configured by JS. In case of configuration in HTML, the JS options **overwrite** HTML options (HTML is left unchanged though).

- `min` - set the minimum value of range
- `max` - set the maximum value of range
- `step` - the step between each value of range

Sample usage:

```js
new JSRange('#jsrangeMin', '#jsrangeMax', {
    min: 0,
    max: 200
    step: 0.01
});
```

To set `from` and `to` values you may need to use HTML attributes or see next section.

### Setting values of range programmatically

The `from` and `to` values can be set programmatically via JS. The action `set()` needs to be called on JSR object:

```js
var range = new JSRange('#jsrangeMin', '#jsrangeMax', {
    min: 0,
    max: 200
    step: 0.01
});
// Later in code (or immediately after defining):
range.set({
    from: 50,
    to: 75
});
```

### Prefixes and suffixes

Prefixes and suffixes can be applied by CSS pseudoelements `::before` and `::after`, although it is possible to apply them through configuration.

If you want to set affixes in options, you need to add to options hash respectively: `prefixes: {}` and `suffixes: {}`. Then you shall to define where you want these affixes, and what should they be. You can use:

- `min` - minimum label
- `max` - maximum label
- `from` - from label
- `to` - to label
- `single` - single label (`from === to`)

Example:

```js
new JSRange('#jsrMin', '#jsrMax', {
    prefixes: {
        min: '$ ',
        from: '$ ',
        single: '$ '
    },
    suffixes: {
        max: ' $',
        to: ' $'
    }
})
```

### Keyboard

JSR supports keyboard control. First of all one of two sliders needs to be focused. 

- By clicking `left/right arrow` the value is changed by `options.step`. 
- If the `CTRL` is pressed along with arrow, the value is changed by `options.step x10`.
- If the `SHIFT` is pressed along with arrow, the values is changed by `range x5%` (by the 5% of whole range).

NOTE: In case of `SHIFT` and `CTRL` keys pressed simultaneously, `SHIFT` takes priority.

### Grid

Grid is a ruler placed beneath/over rail, which indicates values on the rail.

It is created through two gradients: `background-image: linear-gradient(...), linear-gradient(...);`. The first one gradient is the *primary* markers set, the second one: *secondary* markers set. This way you can style those gradients by styling `background`. In example, to make secondary markers smaller than primary ones set: `background-size: 100% 100%, 100% 50%;` - secondary markers are now 50% height of primary markers.

It has few options to set via `grid` parameter:

-  `enabled` - defaults to false. If you want grid to be displayed, set it to `true`.
-  `step` -  every which (percent) of value, the grid marker (vertical line) should be placed. `step: 0.05` means, that marker should be placed every 5% of range width, giving 20 markers.
-  `primaryStepNth` - describes, every which marker should be the 'primary' one. Setting it to `primaryStepNth: 5` means, that every 5th marker (starting from first) will be primary. It is advisible, that `100 / primaryStepNth` gives integer, not float number.
- `color` - this value contains two properties: `color.primary` (primary markers) and `color.secondary` (secondary markers). They can be set seperately. If one is not set, JSR tries to retrieve its color from `.jsr-grid` CSS `color` attribute. If it is not defined either, it uses default value, which is `#999`.

Example:

```js
new JSRange('#jsrMin', '#jsrMax', {
    grid: {
        step: 0.02,
        bigStepNth: 10,
        color: {
            primary: '#000',
            secondary: '#555'
        }
    }
})
```

## Demo

https://mm-jsr.github.io/mm-jsr/#demo