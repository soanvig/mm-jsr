class JSRange {
  constructor (el, options) {
    this._updateObject = this._update
    this._eventsObject = this._events
    this._mousemoveThrottle = false

    this.options = options
    this.selected = {
      from: this.options.min,
      to: this.options.max
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
    if (hash.from) {
      this.selected.from = hash.from
    }

    if (hash.to) {
      this.selected.to = hash.to
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
    this.body.sliders.from = document.createElement('div')
    this.body.sliders.from.classList.add('jsr_slider', 'jsr_slider--from')
    this.body.sliders.from.dataset.jsrType = 'from'
    this.body.sliders.to = document.createElement('div')
    this.body.sliders.to.classList.add('jsr_slider', 'jsr_slider--to')
    this.body.sliders.to.dataset.jsrType = 'to'

    this.body.info = {}
    this.body.info.min = document.createElement('span')
    this.body.info.min.classList.add('jsr_info', 'jsr_info--min')
    this.body.info.max = document.createElement('span')
    this.body.info.max.classList.add('jsr_info', 'jsr_info--max')
    this.body.info.from = document.createElement('span')
    this.body.info.from.classList.add('jsr_info', 'jsr_info--from')
    this.body.info.to = document.createElement('span')
    this.body.info.to.classList.add('jsr_info', 'jsr_info--to')
    this.body.info.single = document.createElement('span')
    this.body.info.single.classList.add('jsr_info', 'jsr_info--single')

    let elements = [
      this.body.rail,
      this.body.sliders.from,
      this.body.sliders.to,
      this.body.info.min,
      this.body.info.max,
      this.body.info.from,
      this.body.info.to,
      this.body.info.single
    ]

    elements.forEach((element) => {
      this.body.parent.appendChild(element)
    })
  }

  _validateAndSave (type, value) {
    if (type === 'from') {
      if (value < this.options.min) {
        value = this.options.min
      }

      if (value > this.selected.to) {
        value = this.selected.to
      }
    }

    if (type === 'to') {
      if (value > this.options.max) {
        value = this.options.max
      }

      if (value < this.selected.from) {
        value = this.selected.from
      }
    }

    this.selected[type] = value
  }

  _bindEvents () {
    this.body.sliders.from.addEventListener('mousedown', this._events.sliderMouseDown)
    this.body.sliders.to.addEventListener('mousedown', this._events.sliderMouseDown)
    document.addEventListener('mousemove', this._events.sliderMouseMove)
    document.addEventListener('mouseup', this._events.sliderMouseUp)

    this.body.rail.addEventListener('click', this._events.railClick)
  }

  _getValueOfPosition (mouseX) {
    let railLeft = this.body.rail.getBoundingClientRect().left
    let diff = mouseX - railLeft
    return parseInt(diff / this.body.rail.offsetWidth * this.options.max)
  }

  // returns left of element relatively to rail
  _getLeftOf (element) {
    let railLeft = parseFloat(this.body.rail.getBoundingClientRect().left)
    let elLeft = parseFloat(element.getBoundingClientRect().left)
    let elRelativeLeft = elLeft - railLeft
    let railWidth = parseFloat(this.body.rail.offsetWidth)
    return elRelativeLeft / railWidth
  }

  // returns right of element (from style + width)
  _getRightOf (element) {
    return this._getLeftOf(element) + this._getWidthOf(element)
  }

  // returns center of element relatively to rail
  _getCenterOf (element) {
    let left = this._getLeftOf(element)
    let widthRatio = this._getWidthOf(element)
    return (left + widthRatio / 2)
  }

  // returns width of element relatively to rail
  _getWidthOf (element) {
    let width = parseFloat(element.offsetWidth)
    let widthRatio = width / parseFloat(this.body.rail.offsetWidth)
    return widthRatio
  }

  // _update returns all events available to use
  // it tries to use the buffering-variable (_eventsObject) to not recreate this big object every time
  get _events () {
    var _this = this;
    return _this._eventsObject || {
      sliderMouseDown: function (event) {
        event.preventDefault() // prevents selecting text
        window.jsrMoveObject = event.target
      },
      sliderMouseUp: function (event) {
        window.jsrMoveObject = null
      },
      sliderMouseMove: function (event) {
        if (window.jsrMoveObject && !_this._mousemoveThrottle) {
          // throttling function
          _this._mousemoveThrottle = true
          setTimeout(() => { _this._mousemoveThrottle = false}, 20)

          let type = window.jsrMoveObject.dataset.jsrType
          let newSelected = _this._getValueOfPosition(event.clientX)
          _this._validateAndSave(type, newSelected)
          _this.update()
        }
      },
      railClick: function (event) {
        // determine closer to which slider it was closer
        let clickedValue = _this._getValueOfPosition(event.clientX)

        // compare absolute distance between clickedValue and selected.from/max
        // closer to zero, means closer to min/max
        if (Math.abs(_this.selected.from - clickedValue) < Math.abs(_this.selected.to - clickedValue)) {
          // closer to min
          _this.selected.from = clickedValue
        } else {
          // closer to max
          _this.selected.to = clickedValue
        }

        _this.update()
      }
    }
  }

  // _update returns all methods available to use to update things
  // it tries to use the buffering-variable (_updateObject) to not recreate this big object every time
  get _update () {
    var _this = this;
    return _this._updateObject || {
      // Here goes every function which should be updated via .all()
      // 'info' should be after 'sliders' because it depends on their value
      _toUpdate: ['rail', 'sliders', 'info'], 
      all: function () {
        this._toUpdate.forEach((item) => {
          this[item]() // Call certain update function
        })
      },

      rail: function () {
        // Calc rail color position
        let start     = _this.selected.from / _this.options.max
        let end       = _this.selected.to / _this.options.max
        // Calc real start (because of weird percentage work)
        let realStart = start / (1 - (end - start))

        // Sets colored part of rail
        // Expects percentages without % sign
        _this.body.rail.style.backgroundPosition  = `${realStart * 100}% 0`
        _this.body.rail.style.backgroundSize      = `${(end - start) * 100}% 100%`
      },

      sliders: function () {
        let startWidthRatio = _this._getWidthOf(_this.body.sliders.from)
        let endWidthRatio   = _this._getWidthOf(_this.body.sliders.to)
        // widthRatio is used to place middle point of slider in the right point
        let start           = _this.selected.from / _this.options.max - startWidthRatio / 2
        let end             = _this.selected.to / _this.options.max - endWidthRatio / 2

        _this.body.sliders.from.style.left  = `${start * 100}%`
        _this.body.sliders.to.style.left    = `${end * 100}%`
      },

      info: function () {
        _this.body.info.min.innerHTML     = _this.options.min
        _this.body.info.max.innerHTML     = _this.options.max
        _this.body.info.from.innerHTML    = _this.selected.from
        _this.body.info.to.innerHTML      = _this.selected.to
        _this.body.info.single.innerHTML  = (_this.selected.from === _this.selected.to )
                                            ? _this.selected.from
                                            : `${_this.selected.from} - ${_this.selected.to}`

        // position infos
        let fromInfo = _this._getCenterOf(_this.body.sliders.from) - _this._getWidthOf(_this.body.info.from) / 2
        let toInfo = _this._getCenterOf(_this.body.sliders.to) - _this._getWidthOf(_this.body.info.to) / 2
        let slidersMiddle = (_this._getCenterOf(_this.body.sliders.from) + _this._getCenterOf(_this.body.sliders.to)) / 2
        let singleInfo = slidersMiddle - _this._getWidthOf(_this.body.info.single) / 2

        _this.body.info.from.style.left = `${fromInfo * 100}%`
        _this.body.info.to.style.left = `${toInfo * 100}%`
        _this.body.info.single.style.left = `${singleInfo * 100}%`

        // determine infos overlap, and hide them
        // 'from' and 'to' overlaps
        if (_this._getRightOf(_this.body.info.from) > _this._getLeftOf(_this.body.info.to)) {
          _this.body.info.from.style.visibility = 'hidden'
          _this.body.info.to.style.visibility = 'hidden'
          _this.body.info.single.style.visibility = 'visible'
        } else {
          _this.body.info.from.style.visibility = 'visible'
          _this.body.info.to.style.visibility = 'visible'
          _this.body.info.single.style.visibility = 'hidden'
        }

        // 'min' and 'from' overlaps
        if (_this._getRightOf(_this.body.info.min) > _this._getLeftOf(_this.body.info.from)) {
          _this.body.info.min.style.visibility = 'hidden'
        } else {
          _this.body.info.min.style.visibility = 'visible'
        }

        // 'max' and 'to' overlaps
        if (_this._getRightOf(_this.body.info.to) > _this._getLeftOf(_this.body.info.max)) {
          _this.body.info.max.style.visibility = 'hidden'
        } else {
          _this.body.info.max.style.visibility = 'visible'
        }
      }
    }
  }
}