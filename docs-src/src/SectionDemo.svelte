<script>
import Demo from './components/Demo.svelte';

const demo1 = `{
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
  }
}`;

const demo2 = `{
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
  }
}`;

const demo3 = `{
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
  }
}`;

const demo4 = `{
  modules: [
    new ModuleSlider(),
    new ModuleGrid({ color: '#999' }),
  ],
  config: {
    min: 0,
    max: 100,
    step: 1,
    initialValues: [50],
  }
}`;

const demo4css = `.demo4 .jsr_slider {
  top: calc(5px / 2 + 17px);
}
`;

const demo5 = `{
  modules: [
    new ModuleRail(),
    new ModuleBar(),
    new ModuleLabel(),
  ],
  config: {
    min: 0,
    max: 100,
    step: 1,
    initialValues: [30,70],
  }
}`;

const demo6 = `{
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
  }
}`;

const demo6css = `.demo6 .jsr_bar[data-key="0"] {
  background: linear-gradient(90deg, rgba(106,97,255,1) 0%, rgba(0,212,255,1) 100%);
}

.demo6 .jsr_bar[data-key="1"] {
  background: linear-gradient(90deg, rgba(0,212,255,1) 0%, rgba(215,0,255,1) 100%);
}

.demo6 .jsr_bar[data-key="2"] {
  background: linear-gradient(90deg, rgba(215,0,255,1) 0%, rgba(72,255,0,1) 100%);
}

.demo6 .jsr_slider[data-key="0"]::before {
  background: rgba(106,97,255,1);
  box-shadow: 0 0 8px rgba(106,97,255,1);
}

.demo6 .jsr_slider[data-key="1"]::before {
  background: rgba(0,212,255,1);
  box-shadow: 0 0 8px rgba(0,212,255,1);
}

.demo6 .jsr_slider[data-key="2"]::before {
  background: rgba(215,0,255,1);
  box-shadow: 0 0 8px rgba(215,0,255,1);
}

.demo6 .jsr_slider[data-key="3"]::before {
  background: rgba(72,255,0,1);
  box-shadow: 0 0 8px rgba(72,255,0,1);
}
`;

</script>
<section class="page-section" id="demo">

  <h2 class="header">Demo</h2>
  <p class="paragraph">These demos represents usage of different JSR functions and settings. See <a href="https://github.com/soanvig/mm-jsr" class="link">README</a> for more details.</p>
  <p class="paragraph">Feel free to play with sliders, and try to find bugs :-) If you find any, let me know!</p>

  <Demo config={demo1} description='Basic usage, multiple sliders, labels.' />
  <Demo config={demo2} description='Visible limit.' />
  <Demo config={demo3} description='Single value, formatter, grid.' />
  <Demo config={demo4} description='Only offset slider and grid.' customClass='demo4' customCss={demo4css} />
  <Demo config={demo5} description='Only rail and bar + labels' />
  <Demo config={demo6} description='Colorful bars' customClass='demo6' customCss={demo6css} />
</section>

<style>

</style>