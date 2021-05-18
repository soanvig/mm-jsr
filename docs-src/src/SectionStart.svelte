<script>
  import { onMount } from "svelte";

  let jsrNode;

  onMount(() => {
    new window.JSR({
      modules: [
          new JSR.Rail(),
          new JSR.Slider(),
          new JSR.Bar(),
          new JSR.Label(),
          new JSR.Grid({
              color: '#777'
          }),
      ],
      config: {
          min: 0,
          max: 100,
          step: 1,
          initialValues: [25,75],
          container: jsrNode,
      }
    });
  })
</script>

<div class="page-section page-section--start" id="start">
        
  <div class="page-section--start_content">
      <span class="page-section--start_name">Mort&amp;Mortis</span>
      <span class="page-section--start_subname">presents</span>
      <span class="page-section--start_app">JS Range</span>
  </div>
  
  <div class="page-section--start_demo">
      <div class="jsr" bind:this={jsrNode} />
  </div>
  
  <a class="button button--download" href="https://github.com/soanvig/mm-jsr">Get started</a>
</div>

<style>
  .page-section--start {
    margin-bottom: 0;
    max-width: auto;
  }

  .page-section--start {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    padding-top: 10vh;
    line-height: 1;
    min-height: 100vh
  }

  .page-section--start_content {
    text-align: center;
    font-size: 4em;
    padding: 1em;
    background: rgba(0, 0, 0, 0.25);
    border: 1px solid #222;
    box-shadow: 0 0 5px #000;
    margin-bottom: 10vh
  }

  .page-section--start_demo {
    min-width: 300px;
    width: 30vw
  }

  .page-section--start_name {
    display: block;
    font-size: 0.75em
  }

  .page-section--start_app {
    margin-top: 0.5em;
    display: block
  }

  .page-section--start_subname {
    display: block;
    font-style: italic;
    font-size: 0.5em
  }

  .button {
    background: linear-gradient(30deg, #600, #d00);
    border: 1px solid #a00;
    box-shadow: 0 0 4px #000;
    color: #fff;
    padding: 0.5em 1em;
    border-radius: 5%;
    display: inline-block;
    cursor: pointer;
    font-weight: bold;
    text-shadow: 0 0 3px #000;
    transition: all 0.2s ease-in-out;
    text-decoration: none
  }

  .button--download {
    margin-top: 1em;
    padding: 1em 2em
  }
</style>