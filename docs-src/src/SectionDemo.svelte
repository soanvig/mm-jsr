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
        initialValues: [25,75],
    }
  }`;

</script>
<section class="page-section" id="demo">

  <h2 class="header">Demo</h2>
  <p class="paragraph">These demos represents usage of different JSR functions and settings. See <a href="https://github.com/soanvig/mm-jsr" class="link">README</a> for more details.</p>
  <p class="paragraph">Feel free to play with sliders, and try to find bugs :-) If you find any, let me know!</p>

  <Demo config={demo1} />
</section>

<style>

</style>