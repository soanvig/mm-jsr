# svelte-mm-jsr

Official Svelte adapter for [mm-jsr](https://github.com/soanvig/mm-jsr). Visit link for more information about library.

Well, not adapter, but official *implementation* guide. It would make no sense to create dedicated adapter in this case.

---

**mm-jsr** provides You with excellent solution for creating so-called range-inputs.

Range input is form's field where one can choose a value from min-max range.
Although HTML 5 comes with input[type="range"] its functionality lacks a lot of features.
**mm-jsr** gives You anything You may need.

## Installation

See [JSR.svelte](./src/JSR.svelte) component for yourself how easy this is!

1. Install mm-jsr (may want to refer to [mm-jsr README](../../README.md) for more information on that)

  ```
  npm install --save mm-jsr

  or

  yarn add mm-jsr
  ```

2. Add CSS (you can use basic styles from [here](../mm-jsr/styles.css))

3. Instantiate (see [docs](https://soanvig.github.io/mm-jsr/api/index.html) for more information about configuration and modules)

  ```html
  <script lang="ts">
  import { JSR, ModuleRail, ModuleSlider, ModuleBar, ModuleLabel } from "mm-jsr";
  import { onMount } from 'svelte';

  let jsrContainer;
  let jsr;

  onMount(() => {
    jsr = new JSR({
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
        initialValues: [25,75, 90],
        container: jsrContainer,
      }
    });

    jsr.onValueChange(console.log)
  });
  </script>

  <div class="jsr-container" bind:this={jsrContainer}>
    <style>
      /** CSS can go here */
    </style>
  </div>
  ```