<script>
import Demo from './components/Demo.svelte';

const demo1 = `{
    modules: [
      new JSR.Rail(),
      new JSR.Slider(),
      new JSR.Bar(),
      new JSR.Label(),
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
    new JSR.Rail(),
    new JSR.Slider(),
    new JSR.Label(),
    new JSR.Limit()
  ],
  config: {
    min: 0,
    max: 100,
    step: 1,
    initialValues: [35, 65],
    limit: {
      min: 25,
      max: 75
    },
  }
}`;

const demo3 = `{
  modules: [
    new JSR.Rail(),
    new JSR.Slider(),
    new JSR.Label({ formatter: v => \`\${v}°C\` }),
    new JSR.Grid({ formatter: v => \`\${v}°C\`, color: '#999' }),
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
    new JSR.Slider(),
    new JSR.Grid({ color: '#999' }),
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
    new JSR.Rail(),
    new JSR.Bar(),
    new JSR.Label(),
  ],
  config: {
    min: 0,
    max: 100,
    step: 1,
    initialValues: [30,70],
  }
}`;
</script>
<section class="page-section" id="demo">

  <h2 class="header">Demo</h2>
  <p class="paragraph">These demos represents usage of different JSR functions and settings. See <a href="https://github.com/soanvig/mm-jsr" class="link">README</a> for more details.</p>
  <p class="paragraph">Feel free to play with sliders, and try to find bugs :-) If you find any, let me know!</p>

  <Demo config={demo1} description='Basic usage, multiple sliders, labels.' />
  <Demo config={demo2} description='Visible limit.' />
  <Demo config={demo3} description='Single value, formatter, grid.' />
  <Demo config={demo4} description='Only offset slider and grid.' customClass='demo4' customCss={demo4css} />
  <Demo config={demo5} description='Only rail and bar + labels' customClass='demo4' customCss={demo4css} />
</section>

<style>

</style>