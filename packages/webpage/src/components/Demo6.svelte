<script>
  import { onMount } from 'svelte';
  import Demo from './Demo.svelte';
  import { JSR, ModuleSlider, ModuleRail, ModuleBar, ModuleLabel } from 'mm-jsr';

  let container;

  const css = `.jsr.is-demo-6 .jsr_bar[data-key="0"] {
  background: linear-gradient(90deg, rgba(106,97,255,1) 0%, rgba(0,212,255,1) 100%);
}

.jsr.is-demo-6 .jsr_bar[data-key="1"] {
  background: linear-gradient(90deg, rgba(0,212,255,1) 0%, rgba(215,0,255,1) 100%);
}

.jsr.is-demo-6 .jsr_bar[data-key="2"] {
  background: linear-gradient(90deg, rgba(215,0,255,1) 0%, rgba(72,255,0,1) 100%);
}

.jsr.is-demo-6 .jsr_slider[data-key="0"]::before {
  background: rgba(106,97,255,1);
  box-shadow: 0 0 8px rgba(106,97,255,1);
}

.jsr.is-demo-6 .jsr_slider[data-key="1"]::before {
  background: rgba(0,212,255,1);
  box-shadow: 0 0 8px rgba(0,212,255,1);
}

.jsr.is-demo-6 .jsr_slider[data-key="2"]::before {
  background: rgba(215,0,255,1);
  box-shadow: 0 0 8px rgba(215,0,255,1);
}

.jsr.is-demo-6 .jsr_slider[data-key="3"]::before {
  background: rgba(72,255,0,1);
  box-shadow: 0 0 8px rgba(72,255,0,1);
}
`;

  const stringifiedConfig = `{
  modules: [
    new ModuleSlider(),
    new ModuleRail(),
    new ModuleBar(),
    new ModuleLabel(),
  ],
  config: {
    min: 0,
    max: 100,
    step: 1,
    initialValues: [15, 30, 45, 60],
    container
  }
}`;

  onMount(() => {
    new JSR({
      modules: [
        new ModuleSlider(),
        new ModuleRail(),
        new ModuleBar(),
        new ModuleLabel(),
      ],
      config: {
        min: 0,
        max: 100,
        step: 1,
        initialValues: [15, 30, 45, 60],
        container
      }
    })
  });
</script>

<Demo config={stringifiedConfig} customCss={css} description='Colorful bars'>
  <div class="jsr is-demo-6" bind:this={container} />
</Demo>
