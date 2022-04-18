<script>
  import { onMount } from 'svelte';
  import Demo from './Demo.svelte';
  import { JSR,  ModuleSlider, ModuleGrid } from 'mm-jsr';

  let container;

  const css = `.jsr.is-demo-4 .jsr_slider {
  top: calc(5px / 2 + 17px);
}
`;

  const stringifiedConfig = `{
  modules: [
    new ModuleSlider(),
    new ModuleGrid({ color: '#999' }),
  ],
  config: {
    min: 0,
    max: 100,
    step: 1,
    initialValues: [50],
    container,
  }
}`;

  onMount(() => {
    new JSR({
      modules: [
        new ModuleSlider(),
        new ModuleGrid({ color: '#999' }),
      ],
      config: {
        min: 0,
        max: 100,
        step: 1,
        initialValues: [50],
        container,
      }
    })
  });
</script>

<Demo config={stringifiedConfig} customCss={css} description='Only offset slider and grid'>
  <div class="jsr is-demo-4" bind:this={container} />
</Demo>
