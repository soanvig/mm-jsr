(function () {

  const menu      = document.querySelector('#menu')
  const menuOpen  = document.querySelector('.menu-open')
  const menuClose = document.querySelector('.menu-close')

  menuClose.addEventListener('click', (event) => {
    event.preventDefault()
    menu.classList.remove('nav--opened')
  })

  menuOpen.addEventListener('click', (event) => {
    event.preventDefault()
    menu.classList.add('nav--opened')
  })
  
})()