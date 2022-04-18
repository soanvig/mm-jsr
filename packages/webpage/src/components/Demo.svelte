<script>
  export let config;
  export let description;
  export let customCss;

  let wrappedCss = customCss ? `<style>${customCss}</style>` : '';
</script>

<svelte:head>
  {#if wrappedCss}
    {@html wrappedCss}
  {/if}
</svelte:head>

<div class="demo">
  <p class="paragraph">{description}</p>

  <slot></slot>

  <pre class="demo_code"><code class="language-javascript">
new JSR({config});
    </code>
  </pre>
  {#if customCss}
    <pre
      class="demo_code">
<code class="language-css">{customCss}
</code></pre>
  {/if}
</div>

<style>
  .demo {
    background: rgba(0, 0, 0, 0.3);
    padding: 5vh 5vw;
    margin-bottom: 2em;
  }

  .demo_code {
    margin: 4em 0 1em;
    font-size: 0.8em;
    padding: 0 2em;
  }
</style>
