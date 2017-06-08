class JSRange {
  constructor (el, options) {
    this.options = options
    this.selected = {
      min: this.options.min,
      max: this.options.max
    }

    this._createBody(el)
    this._updateState()
  }

  update () {
    this._updateState()
  }

  set (hash = {}) {
  	if (hash.min) {
  		this.selected.min = hash.min
  	}

  	if (hash.max) {
  		this.selected.max = hash.max
  	}

  	this._updateState()
  }
 
  _createBody (el) {
    this.body = {}

    this.body.parent = document.querySelector(el)
    this.body.parent.classList.add('jsr')

    this.body.rail = document.createElement('div')
    this.body.rail.classList.add('jsr_rail')

    this.body.sliders = {}
    this.body.sliders.min = document.createElement('div')
    this.body.sliders.min.classList.add('jsr_slider', 'jsr_slider--min')
    this.body.sliders.max = document.createElement('div')
    this.body.sliders.max.classList.add('jsr_slider', 'jsr_slider--max')

    this.body.info = {}
    this.body.info.min = document.createElement('span')
    this.body.info.min.classList.add('jsr_info', 'jsr_info--min')
    this.body.info.max = document.createElement('span')
    this.body.info.max.classList.add('jsr_info', 'jsr_info--max')
    this.body.info.actualMin = document.createElement('span')
    this.body.info.actualMin.classList.add('jsr_info', 'jsr_info--actualMin')
    this.body.info.actualMax = document.createElement('span')
    this.body.info.actualMax.classList.add('jsr_info', 'jsr_info--actualMax')

    let elements = [
      this.body.rail,
      this.body.sliders.min,
      this.body.sliders.max,
      this.body.info.min,
      this.body.info.max,
      this.body.info.actualMin,
      this.body.info.actualMax
    ]

    elements.forEach((element) => {
      this.body.parent.appendChild(element)
    })
  }

  _updateState () {
    // Update rail color
    let railStart = this.selected.min / this.options.max * 100
    let railEnd = this.selected.max / this.options.max * 100
    this._setRail(railStart, railEnd)
  }

  // Sets colored part of rail
  // Expects percentages without % sign
  _setRail (start, end) {
    this.body.rail.style.backgroundPosition = `${start}% 0`
    this.body.rail.style.backgroundSize = `${end - start}% 100%`
  }
}