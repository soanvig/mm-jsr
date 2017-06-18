// Author: Mortimer from http://mortmortis.pl
// https://github.com/soanvig/js-range
// Script uses ES6
class JSRange {
  // Note about setting "step" with "from"/"to": it is allowed to use "from"/"to" not matching step
  // Step option is best used with powers of 10 (including negative powers) or regular numbers like 2 (but not 3)
  // -------
  // Options for JSRange are retrieved from supplied 'inputMin'
  constructor (inputMin, inputMax, options) {
    // cross-object informations:
    this.meta = {}
    this.meta.moveObject = null
    this.meta.clientX = null
    this.meta.clickX = null
    this.meta.throttle = {}

    this.inputMin       = document.querySelector(inputMin)
    this.inputMax       = document.querySelector(inputMax)
    this._updateObject  = this._update
    this._eventsObject  = this._events

    this.options        = {}
    this.options.min    = options.min   || this.inputMin.getAttribute('min')
    this.options.max    = options.max   || this.inputMin.getAttribute('max')
    this.options.step   = options.step  || this.inputMin.getAttribute('step')
    this.options.stepDecimals = this._calculateDecimals(this.options.step)

    this.selected = {
      from: parseFloat(this.inputMin.getAttribute('value')) || this.options.min,
      to: parseFloat(this.inputMax.getAttribute('value')) || this.options.max
    }

    this._createBody()
    this._bindEvents()
    this.update()
  }

  // Propably we want to update everything
  update () {
    this._update.all()
  }

  // Sets values:
  // from, to
  set (hash = {}) {
    if (hash.from) {
      this.selected.from = hash.from
    }

    if (hash.to) {
      this.selected.to = hash.to
    }

    this.update()
  }
 
  _createBody () {
    this.inputMin.style.display = 'none'
    this.inputMax.style.display = 'none'

    this.body = {}

    this.body.parent = document.createElement('div')
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
    this.body.info.min.dataset.jsrType = 'min'
    this.body.info.max = document.createElement('span')
    this.body.info.max.classList.add('jsr_info', 'jsr_info--max')
    this.body.info.max.dataset.jsrType = 'max'
    
    this.body.info.from = document.createElement('span')
    this.body.info.from.classList.add('jsr_info', 'jsr_info--from')
    this.body.info.from.dataset.jsrType = 'from'
    this.body.info.to = document.createElement('span')
    this.body.info.to.classList.add('jsr_info', 'jsr_info--to')
    this.body.info.to.dataset.jsrType = 'to'
    
    this.body.info.single = document.createElement('span')
    this.body.info.single.classList.add('jsr_info', 'jsr_info--single')
    this.body.info.singleFrom = document.createElement('span')
    this.body.info.singleFrom.classList.add('jsr_info_singleFrom')
    this.body.info.singleFrom.dataset.jsrType = 'from'
    this.body.info.singleTo = document.createElement('span')
    this.body.info.singleTo.classList.add('jsr_info_singleTo')
    this.body.info.singleTo.dataset.jsrType = 'to'

    this.body.info.single.appendChild(this.body.info.singleFrom)
    this.body.info.single.appendChild(this.body.info.singleTo)

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

    // https://stackoverflow.com/questions/4793604/how-to-do-insert-after-in-javascript-without-using-a-library
    this.inputMax.parentNode.insertBefore(this.body.parent, this.inputMax.nextSibling);
  }

  _solveMove (type, value, clientX) {
    // Let's say somebody want to move a label...
    if (type == 'from') {
      // but it can't move behind 'to'!
      this.selected.from = (value > this.selected.to) ? (this.selected.to) : value
    } else if (type == 'to') {
      // also it can't move before 'from'!
      this.selected.to = (value < this.selected.from) ? (this.selected.from) : value
    // we should be safe now
    // ...
    } else if (type == 'single') {
      // But if, and ONLY IF, hypothetical, somebody would want to move SINGLE label
      // (single means selected values are equal)
      // we need to determine whether he or she is moving it to the LEFT or to the RIGHT,
      // then set the corresponding value and move object to proper label.
      // But who would want to do such a thing?
      let direction = clientX - this.meta.clickX // negative = left, positive = right
      if (direction < 0) {
        this.selected.from == value
        this.meta.moveObject = this.body.info.from
      } else if (direction > 0) {
        this.selected.to == value
        this.meta.moveObject = this.body.info.to
      }
      // No, seriously, who?
    }

    // Definitely it can't:
    if (this.selected.from <= this.options.min) {
      // move behind min,
      this.selected.from = this.options.min
    }

    if (this.selected.to >= this.options.max) {
      // and behind max
      this.selected.to = this.options.max
    }
  }

  _bindEvents () {
    let mouseDownElements = [
      // Following handle moving basic from/to sliders (dots [sliders] and labels [info])
      this.body.sliders.from,
      this.body.sliders.to,
      this.body.info.from,
      this.body.info.to,
      // Following handle moving single slider
      this.body.info.singleFrom,
      this.body.info.singleTo,
      // Following handle moving slider to min or max
      this.body.info.min,
      this.body.info.max,
      // Following just prevents selecting text
      this.body.info.single
    ]

    mouseDownElements.forEach((element) => {
      element.addEventListener('mousedown', this._events.sliderMouseDown)
    })

    window.addEventListener('resize', this._events.windowResize)

    document.addEventListener('mousemove', this._events.sliderMouseMove)
    document.addEventListener('mouseup', this._events.sliderMouseUp)

    this.body.rail.addEventListener('click', this._events.railClick)
  }

  _calculateDecimals (number) {
    let string = number.toString().split('.')
    if (string[1]) {
      return string[1].length
    } else {
      return 0
    }
  }

  _getStringWithDecimals (number) {
    let decimals = this._calculateDecimals(number)
    let stepDecimals = this._calculateDecimals(this.options.step)
    let string = number.toString().split('.')
    let zeros = Array(1 + (stepDecimals - decimals)).join('0')
    return (string[0] + (string[1] ? '.' + string[1] : '')) + zeros
  }

  _getValueOfPosition (mouseX) {
    let railLeft = this.body.rail.getBoundingClientRect().left
    let diff = mouseX - railLeft
    let value = parseFloat(diff / this.body.rail.offsetWidth * this.options.max)
    value = Math.round(value / this.options.step) * this.options.step
    // let's make finish rounding: move decimal point to the left (*), then to the right (/)
    let stepDecimalsPow = Math.pow(10, this.options.stepDecimals)
    value = Math.round(value * stepDecimalsPow) / stepDecimalsPow
    return value
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
      windowResize: function (event) {
        if (_this._throttle('windowResize', 50)) {
          _this.update()
        }
      },

      sliderMouseDown: function (event) {
        event.preventDefault() // prevents selecting text

        let type = event.target.dataset.jsrType
        // Handle only move of handled item - type determines if it is handled
        if (type) {
          if (type == 'min') {
            _this.selected.from = _this.options.min
          } else if (type == 'max') {
            _this.selected.to = _this.options.max
          } else {
            _this.meta.moveObject = event.target
            _this.meta.clickX = event.clientX
            return
          }
          // Update after setting values
          _this.update()
        }
      },
      sliderMouseUp: function (event) {
        _this.meta.moveObject = null
        _this.meta.clickX = null
      },
      sliderMouseMove: function (event) {
        if (_this.meta.moveObject && _this._throttle('mousemove', 20)) {
          let type = _this.meta.moveObject.dataset.jsrType
          let newSelected = _this._getValueOfPosition(event.clientX)
          _this._solveMove(type, newSelected, event.clientX)
          _this.update()
        }
      },
      railClick: function (event) {
        // determine closer to which slider it was closer
        let clickedValue = _this._getValueOfPosition(event.clientX)
        let selectedAverage = (_this.selected.from + _this.selected.to) / 2

        // determine side of click
        if (clickedValue < selectedAverage) {
          // clicked on the left side of average, move 'from'
          _this.selected.from = clickedValue
        } else {
          // clicked on the right side of average, move 'to'
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
      _toUpdate: ['rail', 'sliders', 'info', 'values'], 
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
        _this.body.info.min.innerHTML         = _this._getStringWithDecimals(_this.options.min)
        _this.body.info.max.innerHTML         = _this._getStringWithDecimals(_this.options.max)
        _this.body.info.from.innerHTML        = _this._getStringWithDecimals(_this.selected.from)
        _this.body.info.to.innerHTML          = _this._getStringWithDecimals(_this.selected.to)
        _this.body.info.singleFrom.innerHTML  = _this._getStringWithDecimals(_this.selected.from)
        _this.body.info.singleTo.innerHTML    = _this._getStringWithDecimals(_this.selected.to)

        if (_this.selected.from == _this.selected.to) {
          _this.body.info.singleTo.style.display = 'none'
          _this.body.info.singleFrom.dataset.jsrType = 'single'
        } else {
          _this.body.info.singleTo.style.display = 'inline'
          _this.body.info.singleFrom.dataset.jsrType = 'from'
        }

        // position infos
        let toInfoWidth =_this._getWidthOf(_this.body.info.to)
        let fromInfoLeft = _this._getCenterOf(_this.body.sliders.from) - _this._getWidthOf(_this.body.info.from) / 2
        let toInfoLeft = _this._getCenterOf(_this.body.sliders.to) - toInfoWidth / 2
        let slidersMiddle = (_this._getCenterOf(_this.body.sliders.from) + _this._getCenterOf(_this.body.sliders.to)) / 2
        let singleInfoLeft = slidersMiddle - _this._getWidthOf(_this.body.info.single) / 2

        // if something exceeds parent, we need to fix stuff
        let parentLeft = _this._getLeftOf(_this.body.parent)
        let parentRight = _this._getRightOf(_this.body.parent)
        if (fromInfoLeft < parentLeft) {
          fromInfoLeft = parentLeft
        }
        if (toInfoLeft + toInfoWidth > parentRight) {
          toInfoLeft = parentRight - toInfoWidth
        }

        _this.body.info.from.style.left = `${fromInfoLeft * 100}%`
        _this.body.info.to.style.left = `${toInfoLeft * 100}%`
        _this.body.info.single.style.left = `${singleInfoLeft * 100}%`

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
      },

      values: function () {
        _this.inputMin.setAttribute('value', _this.selected.from)
        _this.inputMax.setAttribute('value', _this.selected.to)
      }
    }
  }

  // Enables throttling for 'variable' in a 'time' [ms]
  _throttle (name, time) {
    // Create named throttle for the first time
    if (typeof this.meta.throttle[name] === 'undefined') {
      this.meta.throttle[name] = false
    }

    if (this.meta.throttle[name]) {
      return false // don't allow execution
    } else {
      this.meta.throttle[name] = true
      setTimeout(() => { this.meta.throttle[name] = false }, time)
      return true
    }
  }
}