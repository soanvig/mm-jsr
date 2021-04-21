<script>
  import { onMount } from "svelte";
  export let config;
  export let description;
  export let customClass;
  export let customCss;

  let jsrNode;

  let wrappedCss = customCss ? `<style>${customCss}</style>` : '';

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

<svelte:head>
  {#if wrappedCss}
    {@html wrappedCss}
  {/if}
</svelte:head>

<div class="demo {customClass ?? ''}">
  <p class="paragraph">{description}</p>
  <div class="jsr" bind:this={jsrNode} />
  <pre
    class="demo_code line-numbers">
    <code class="language-javascript">new JSR({config});
    </code>
  </pre>
  {#if customCss}
    <pre
      class="demo_code line-numbers">
      <code class="language-css">{customCss}
      </code>
    </pre>
  {/if}
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
