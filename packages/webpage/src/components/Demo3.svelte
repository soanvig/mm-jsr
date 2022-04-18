<script>
  import { onMount } from 'svelte';
  import Demo from './Demo.svelte';
  import { JSR, ModuleRail, ModuleSlider, ModuleLabel, ModuleGrid } from 'mm-jsr';

  let container;

  const stringifiedConfig = `{
  modules: [
    new ModuleRail(),
    new ModuleSlider(),
    new ModuleLabel({ formatter: v => \`\${v}°C\` }),
    new ModuleGrid({ formatter: v => \`\${v}°C\`, color: '#999' }),
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
        new ModuleRail(),
        new ModuleSlider(),
        new ModuleLabel({ formatter: v => `${v}°C` }),
        new ModuleGrid({ formatter: v => `${v}°C`, color: '#999' }),
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

<Demo config={stringifiedConfig} description='Single value, formatter, grid'>
  <div class="jsr" bind:this={container} />
</Demo>
