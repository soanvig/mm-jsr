<script>
  import Header from "./Header.svelte";
  import Menu from "./Menu.svelte";
  import SectionComparison from './SectionComparison.svelte';
  import SectionStart from "./SectionStart.svelte";
  import SectionDemo from "./SectionDemo.svelte";
  import SectionAbout from "./SectionAbout.svelte";
  import Footer from "./Footer.svelte";
</script>

<Header />
<Menu />

<SectionStart />
<SectionAbout />
<!-- <SectionComparison /> -->
<SectionDemo />

<Footer />

<style>
  @font-face {
    font-family: "PT Sans";
    src: url("./fonts/pt-sans-regular.woff");
  }

  @font-face {
    font-family: "PT Sans";
    font-style: italic;
    src: url("./fonts/pt-sans-italic.woff");
  }

  @font-face {
    font-family: "PT Sans";
    font-weight: bold;
    src: url("./fonts/pt-sans-bold.woff");
  }

  @font-face {
    font-family: "PT Sans";
    font-weight: bold;
    font-style: italic;
    src: url("./fonts/pt-sans-bold-italic.woff");
  }

  @font-face {
    font-family: "Elementary Gothic";
    src: url("./fonts/elementary-gothic.woff");
  }

  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(.page-body) {
    width: 100%;
    overflow-x: hidden;
  }

  :global(html) {
    scroll-behavior: smooth;
    background: #000 url("./images/page-background.jpg") fixed;
    background-size: 100% 100%;
    color: #fff;
    font-family: "PT Sans";
    width: 100vw;
    overflow-x: hidden;
  }

  :global(.page-section) {
    width: 100%;
    position: relative;
    padding: 5vh 5vw;
    font-size: 1.2rem;
    line-height: 2;
    margin: 0 auto;

    margin-bottom: 10vh;
    max-width: 1400px;
  }

  :global(.header) {
    margin-bottom: 1em;
    text-align: center;
  }

  :global(.link) {
    color: #f00;
    transition: all 0.2s ease-in-out
  }

  :global(.link:hover),
  :global(.link:focus) {
    background: #d00;
    color: #000
  }

  :global(.paragraph) {
	  margin-bottom: 1em;
	  text-align: justify
  }

  :global(.list) {
	  list-style: square;
	  margin-left: 2em
  }
</style>
