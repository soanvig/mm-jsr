<nav class="nav" id="menu">
  <button class="menu-close" aria-hidden="true">X</button>
  <ul class="menu">
      <li class="menu_item"><a href="#start">Start</a></li>
      <li class="menu_item"><a href="#about">About</a></li>
      <!-- <li class="menu_item"><a href="#comparison">Comparison</a></li> -->
      <li class="menu_item"><a href="#demo">Demo</a></li>
      <li class="menu_item"><a href="https://github.com/soanvig/mm-jsr">Github Repo</a></li>
  </ul>
</nav>

<a class="menu-open" href="#menu" aria-hidden="true">Menu</a>

<style>
  .nav {
    position: absolute;
    top: 0;
    right: 2vh;
    padding: 2vh 0 0 10vw;
    font-size: 1.3rem;
    border-bottom: 1px solid #eee
  }

  .menu-close {
    position: absolute;
    top: 5vh;
    right: 5vw;
    color: #fff;
    font-weight: bold;
    text-decoration: none;
    display: none;
    text-shadow: 0 0 2px #000;
  }

  .menu-open {
    position: fixed;
    top: 5vh;
    right: 5vw;
    text-decoration: none;
    color: #fff;
    background: rgba(0, 0, 0, 0.75);
    padding: 0.5em 1em;
    display: none;
    z-index: 999;
    transition: all 0.1s ease-in-out;
    border-radius: 10%
  }

  .menu_item {
    display: inline-block
  }

  .menu_item a {
    display: inline-block;
    color: #fff;
    padding: 1em;
    text-decoration: none;
    transition: all 200ms ease-in-out
  }

  .menu_item a:hover,
  .menu_item a:focus {
    background: #eee;
    color: #111
  }
  
  @media all and (max-width: 1000px) {
    .nav {
      width: 300px;
      right: -300px;
      top: 0;
      bottom: 0;
      position: fixed;
      padding: 10% 2vw 5vh;
      background: rgba(0, 0, 0, 0.75);
      z-index: 1000;
      transition: right 200ms ease-in-out;
      border-bottom: 0;
      border-left: 3px solid #000;
      box-shadow: 0 -2px 4px #000
    }
    .nav:target,
    .nav:target+.menu-open,
    .menu_item {
      display: block
    }
    .menu_item a {
      width: 100%
    }
    .menu-open,
    .menu-close {
      display: block
    }
  }
</style>