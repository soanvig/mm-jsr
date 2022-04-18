<script>
  import { onMount } from 'svelte';
  import Demo from './Demo.svelte';
  import { JSR, ModuleRail, ModuleBar, ModuleLabel } from 'mm-jsr';

  let container;

  const stringifiedConfig = `{
  modules: [
    new ModuleRail(),
    new ModuleBar(),
    new ModuleLabel(),
  ],
  config: {
    min: 0,
    max: 100,
    step: 1,
    initialValues: [30, 70],
    container
  }
}`;

  onMount(() => {
    new JSR({
      modules: [
        new ModuleRail(),
        new ModuleBar(),
        new ModuleLabel(),
      ],
      config: {
        min: 0,
        max: 100,
        step: 1,
        initialValues: [30, 70],
        container,
      }
    })
  });
</script>

<Demo config={stringifiedConfig} description='Only rail and bar + labels'>
  <div class="jsr" bind:this={container} />
</Demo>
