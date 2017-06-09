class JSRange {
  constructor (el, options) {
    this._updateObject = this._update
    this._eventsObject = this._events

    this.options = options
    this.selected = {
      min: this.options.min,
      max: this.options.max
    }

    this._createBody(el)
    this._bindEvents()
    this.update()
  }

  // Propably we want to update everything
  update () {
    this._update.all()
  }

  set (hash = {}) {
    if (hash.min) {
      this.selected.min = hash.min
    }

    if (hash.max) {
      this.selected.max = hash.max
    }

    this.update()
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
    this.body.sliders.min.dataset.jsrType = 'min'
    this.body.sliders.max = document.createElement('div')
    this.body.sliders.max.classList.add('jsr_slider', 'jsr_slider--max')
    this.body.sliders.max.dataset.jsrType = 'max'

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

  _bindEvents () {
    this.body.sliders.min.addEventListener('mousedown', this._events.sliderMouseDown)
    this.body.sliders.max.addEventListener('mousedown', this._events.sliderMouseDown)
    document.addEventListener('mousemove', this._events.sliderMouseMove)
    document.addEventListener('mouseup', this._events.sliderMouseUp)
  }

  // _update returns all events available to use
  // it tries to use the buffering-variable (_eventsObject) to not recreate this big object every time
  get _events () {
    var _this = this;
    return _this._eventsObject || {
      sliderMouseDown: function(event) {
        event.preventDefault() // prevents selecting text
        window.jsrMoveObject = event.target
      },
      sliderMouseUp: function(event) {
        window.jsrMoveObject = null
      },
      sliderMouseMove: function(event) {
        if (window.jsrMoveObject) {
          let type = window.jsrMoveObject.dataset.jsrType
          let mouseX = event.clientX
          let railLeft = _this.body.rail.getBoundingClientRect().left
          let diff = mouseX - railLeft
          let newSelected = diff / _this.body.rail.offsetWidth * _this.options.max
          _this.selected[type] = parseInt(newSelected)
          _this.update()
        }
      }
    }
  }

  // _update returns all methods available to use to update things
  // it tries to use the buffering-variable (_updateObject) to not recreate this big object every time
  get _update () {
    var _this = this;
    return _this._updateObject || {
      // Here goes every function which should be updated via .all()
      _toUpdate: ['rail', 'info', 'sliders'], 
      all: function () {
        this._toUpdate.forEach((item) => {
          this[item]() // Call certain update function
        })
      },

      rail: function (min = _this.selected.min, max = _this.selected.max) {
        // Calc rail color position
        let start = min / _this.options.max * 100
        let end = max / _this.options.max * 100

        // Sets colored part of rail
        // Expects percentages without % sign
        _this.body.rail.style.backgroundPosition = `${end}% 0`
        _this.body.rail.style.backgroundSize = `${end - start}% 100%`
      },

      info: function () {
        _this.body.info.min.innerHTML = _this.options.min
        _this.body.info.max.innerHTML = _this.options.max
        _this.body.info.actualMin.innerHTML = _this.selected.min
        _this.body.info.actualMax.innerHTML = _this.selected.max
      },

      sliders: function (min = _this.selected.min, max = _this.selected.max) {
        let startWidthRatio = _this.body.sliders.min.offsetWidth / _this.body.rail.offsetWidth
        let endWidthRatio = _this.body.sliders.max.offsetWidth / _this.body.rail.offsetWidth
        // widthRatio is used to place middle point of slider in the right point
        let start = min / _this.options.max - startWidthRatio / 2
        let end = max / _this.options.max - endWidthRatio / 2

        _this.body.sliders.min.style.left = `${start * 100}%`
        _this.body.sliders.max.style.left = `${end * 100}%`
      }
    }
  }
}