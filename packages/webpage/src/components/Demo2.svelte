<script>
  import { onMount } from 'svelte';
  import Demo from './Demo.svelte';
  import { JSR, ModuleRail, ModuleSlider, ModuleLabel, ModuleLimit } from 'mm-jsr';

  let container;

  const stringifiedConfig = `{
  modules: [
    new ModuleLimit({
      min: 25,
      max: 75
    }),
    new ModuleRail(),
    new ModuleSlider(),
    new ModuleLabel(),
  ],
  config: {
    min: 0,
    max: 100,
    step: 1,
    initialValues: [35, 65],
    container,
  }
}`;

  onMount(() => {
    new JSR({
      modules: [
        new ModuleLimit({
          min: 25,
          max: 75
        }),
        new ModuleRail(),
        new ModuleSlider(),
        new ModuleLabel(),
      ],
      config: {
        min: 0,
        max: 100,
        step: 1,
        initialValues: [35, 65],
        container,
      }
    })
  });
</script>

<Demo config={stringifiedConfig} description='Limit'>
  <div class="jsr" bind:this={container} />
</Demo>
