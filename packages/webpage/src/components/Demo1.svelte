<script>
  import { onMount } from 'svelte';
  import Demo from './Demo.svelte';
  import { JSR, ModuleRail, ModuleSlider, ModuleBar, ModuleLabel } from 'mm-jsr';

  let container;

  const stringifiedConfig = `{
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
    container,
  }
}`;

  onMount(() => {
    new JSR({
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
        container: container,
      }
    })
  });
</script>

<Demo config={stringifiedConfig} description='Basic usage, multiple sliders, labels'>
  <div class="jsr" bind:this={container} />
</Demo>
