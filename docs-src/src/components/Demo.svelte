<script>
  import { onMount } from "svelte";
  export let config;

  let jsrNode;

  const parsedConfig = new Function(`return ${config}`)();

  onMount(() => {
    const configWithContainer = {
      ...parsedConfig,
      config: {
        ...parsedConfig.config,
        container: jsrNode,
      },
    };

    new window.JSR(configWithContainer);
  });
</script>

<div class="demo">
  <p class="paragraph">Basic usage, multiple sliders, labels.</p>
  <div class="jsr" bind:this={jsrNode} />
  <pre
    class="demo_code line-numbers">
    <code class="language-javascript">new JSR({config});
    </code>
  </pre>
</div>

<style>
  .demo {
    background: rgba(0, 0, 0, 0.3);
    padding: 5vh 5vw;
    margin-bottom: 2em;
  }

  .demo .jsr {
    line-height: 1;
    margin-bottom: 4em;
  }

  .demo_code {
    margin: 1em 0;
    font-size: 0.8em;
  }
</style>
