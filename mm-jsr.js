// Author: Mortimer, http://mortmortis.pl
// https://github.com/mm-jsr/jsr
// For instructions see README in repository
// Script uses ES6
class JSRange {
  // Note about setting "step" with "from"/"to": it is allowed to use "from"/"to" not matching step
  // this however may lead to unexpected results
  // Step option is best used with powers of 10 (including negative powers) or regular numbers like 2 (but not 3)
  // -------
  // Options for JSRange are retrieved from supplied 'inputMin'
  constructor (inputMin, inputMax, options) {
    this._buffer = {
      update: this._update,
      events: this._events
    }

    this.inputMin   = document.querySelector(inputMin)
    if (options.single) {
      // this is only fallback
      this.inputMax = this.inputMin
    } else {
      this.inputMax = document.querySelector(inputMax)
    }

    let defaultOptions = {
      min:          parseFloat(this.inputMin.getAttribute('min')),
      max:          parseFloat(this.inputMin.getAttribute('max')),
      step:         parseFloat(this.inputMin.getAttribute('step')),
      value:        parseFloat(this.inputMin.getAttribute('value')),
      single:       false,
      prefixes:     {},
      suffixes:     {},
      grid:         { step: 0.02, bigstepNth: 5, disabled: false }
    }

    // Merge default options with supplied options
    this.options              = this._extend(true, defaultOptions, options)
    // Calculate number of decimals of step
    this.options.stepDecimals = this._calculateDecimals(this.options.step)

    // cross-object informations:
    this.meta = {}
    this.meta.moveObject        = null // object being moved
    this.meta.clickX            = null // position of click
    this.meta.distanceFromValue = null // difference between click position
                                       // and the real value (the center usually) of label/slider
    this.meta.throttle          = {}   // throttles database (used by _throttle())
    this.meta.twentiethRange    = this._roundToStep((this.options.max - this.options.min) / 20) // buffered value of 1/20 of slider

    this.selected = {}
    if (this.options.single) {
      this.selected.single = this.selected.from = this.selected.to = this.options.value
    } else {
      this.selected.from   = parseFloat(this.inputMin.getAttribute('value')) || this.options.min,
      this.selected.to     = parseFloat(this.inputMax.getAttribute('value')) || this.options.max
      this.selected.single = this.selected.from
    }

    this._createBody()
    this._parseLabels()
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
 
  // Creates body (all html elements) of slider
  _createBody () {
    this.inputMin.style.display = 'none'
    this.inputMax.style.display = 'none'

    this.body = {}

    this.body.parent = document.createElement('div')
    this.body.parent.classList.add('jsr')
    this.body.parent.setAttribute('aria-live', 'assertive')

    this.body.rail = document.createElement('div')
    this.body.rail.classList.add('jsr_rail')

    this.body.sliders = {}
    this.body.sliders.from = document.createElement('div')
    this.body.sliders.from.classList.add('jsr_slider', 'jsr_slider--from')
    this.body.sliders.from.dataset.jsrType = 'from'
    this.body.sliders.to = document.createElement('div')
    this.body.sliders.to.classList.add('jsr_slider', 'jsr_slider--to')
    this.body.sliders.to.dataset.jsrType = 'to'
    this.body.sliders.to.setAttribute('tabindex', '0')
    if (!this.options.single) {
      this.body.sliders.from.setAttribute('tabindex', '0')
    }

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
    this.body.info.single.dataset.jsrType = 'single'
    this.body.info.singleFrom = document.createElement('span')
    this.body.info.singleFrom.classList.add('jsr_info_singleFrom')
    this.body.info.singleFrom.dataset.jsrType = 'from'
    this.body.info.singleTo = document.createElement('span')
    this.body.info.singleTo.classList.add('jsr_info_singleTo')
    this.body.info.singleTo.dataset.jsrType = 'to'
    this.body.info.singleSingle = document.createElement('span')
    this.body.info.singleSingle.classList.add('jsr_info_singleSingle')
    this.body.info.singleSingle.dataset.jsrType = 'single'
    this.body.info.singleSingle.style.display = 'none'

    this.body.info.single.appendChild(this.body.info.singleFrom)
    this.body.info.single.appendChild(this.body.info.singleTo)
    this.body.info.single.appendChild(this.body.info.singleSingle)

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

    this.inputMax.parentNode.insertBefore(this.body.parent, this.inputMax.nextSibling);

    // Create grid
    if (!this.options.grid.disabled) {
      this.body.grid = document.createElement('div')
      this.body.grid.classList.add('jsr_grid')

      let markersNumber = 100 / (this.options.grid.step * 100) + 1
      for (let i = 0; i < markersNumber; ++i) {
        let marker = document.createElement('span')
        marker.classList.add('jsr_grid_marker')

        if (i % this.options.grid.bigstepNth == 0) {
          marker.classList.add('jsr_grid_marker--big')
        }

        // If this is last marker it is best to set it's right to 0, insted of left
        if (i == markersNumber - 1) {
          marker.style.right = 0
        } else {
          marker.style.left = this.options.grid.step * 100 * i + '%'
        }
        
        this.body.grid.appendChild(marker)
      }

      this.body.parent.appendChild(this.body.grid)
    }
  }

  // Parses labels, which enables focusing slider on label click event
  // Since labels are not directly slider elements, they are not parsed in ._bindEvents()
  _parseLabels () {
    var minLabel = document.querySelector('label[for=' + this.inputMin.id + ']')
    if (!this.options.single) {
      var maxLabel = document.querySelector('label[for=' + this.inputMax.id + ']')
    }

    if (minLabel) {
      minLabel.addEventListener('click', () => {
        if (!this.options.single) {
          this.body.sliders.from.focus()
        } else {
          // Single sliders uses 'to' slider as leading, while using 'min' input
          this.body.sliders.to.focus()
        }
      })
    }

    if (maxLabel) {
      maxLabel.addEventListener('click', () => {
        this.body.sliders.to.focus()
      })
    }
  }

  // Applies events to all slider elements
  _bindEvents () {
    // mouseDown also supports touch
    const mouseDownElements = [
      // Following handle moving basic from/to sliders (dots [sliders] and labels [info])
      this.body.sliders.from,
      this.body.sliders.to,
      this.body.info.from,
      this.body.info.to,
      // Following handle moving single slider
      this.body.info.singleFrom,
      this.body.info.singleTo,
      this.body.info.single,
      // Following handle moving slider to min or max
      this.body.info.min,
      this.body.info.max
    ]

    mouseDownElements.forEach((element) => {
      element.addEventListener('mousedown', this._events.sliderMouseDown)
      element.addEventListener('touchstart', this._events.touchStart)
      element.addEventListener('touchmove', this._events.touchMove)
    })

    this.body.parent.addEventListener('keydown', this._events.keydown)

    window.addEventListener('resize', this._events.windowResize)

    document.addEventListener('mousemove', this._events.sliderMouseMove)
    document.addEventListener('mouseup', this._events.sliderMouseUp)

    this.body.rail.addEventListener('click', this._events.railClick)
    if (!this.body.grid.disabled) {
      this.body.grid.addEventListener('click', this._events.railClick)
    }
  }

  // Determines, how many decimal places the (float) number has
  _calculateDecimals (number) {
    let string = number.toString().split('.')
    if (string[1]) {
      return string[1].length
    } else {
      return 0
    }
  }

  // Creates string formatted with number of decimals equal to step decimals
  // Example:
  // Number: 10, step: 0.01 -> 10.00
  // Number: 10.1, step: 0.01 -> 10.10
  _getStringWithDecimals (number) {
    let decimals = this._calculateDecimals(number)
    let stepDecimals = this._calculateDecimals(this.options.step)
    let string = number.toString().split('.')
    string[1] = string[1] || '' // just to make things simpler...
    let zeros = Array(1 + (stepDecimals - decimals)).join('0')
    return string[0] + (string[1].length + zeros.length > 0 ? '.' : '') + string[1] + zeros
  }

  // Returns the value in relevance to rail
  // MouseX is the value relative to window
  _getValueOfPosition (mouseX) {
    let railLeft = this.body.rail.getBoundingClientRect().left
    let diff = mouseX - railLeft
    let value = parseFloat(diff / this.body.rail.offsetWidth * (this.options.max - this.options.min) + this.options.min) 
    return value
  }

  // Rounds number to decimal places of step
  _roundToStep (float) {
    // Round to precision of step
    float = Math.round(float / this.options.step) * this.options.step

    let stepDecimalsPow = Math.pow(10, this.options.stepDecimals)
    return Math.round(float * stepDecimalsPow) / stepDecimalsPow
  }

  // Returns left of element relatively to rail
  _getLeftOf (element) {
    let railLeft = parseFloat(this.body.rail.getBoundingClientRect().left)
    let elLeft = parseFloat(element.getBoundingClientRect().left)
    let elRelativeLeft = elLeft - railLeft
    let railWidth = parseFloat(this.body.rail.offsetWidth)
    return elRelativeLeft / railWidth
  }

  // Returns right of element relatively to rail
  _getRightOf (element) {
    return this._getLeftOf(element) + this._getWidthOf(element)
  }

  // Returns center of element relatively to rail
  _getCenterOf (element) {
    let left = this._getLeftOf(element)
    let widthRatio = this._getWidthOf(element)
    return (left + widthRatio / 2)
  }

  // Returns width of element relatively to rail
  _getWidthOf (element) {
    let width = parseFloat(element.offsetWidth)
    let widthRatio = width / parseFloat(this.body.rail.offsetWidth)
    return widthRatio
  }

  // Focuses slider
  // type: from, to, min, max
  _focusSlider (type) {
    if (this.options.single || type == 'max' || type == 'to') {
      this.body.sliders.to.focus()
    } else if (type == 'min' || type == 'from') {
      this.body.sliders.from.focus()
    }
  }

  // Calculates (sets values) and validates move (+ focuses sliders, because this function knows best what actually is happening)
  // If solveMove is used with keyboard, provide distance = 0, clientX = 0 and direction = (-1 || 1)
  // type: type of element being moved (from, to, single)
  // value: the new value of element
  // distance: distance between center of label/slider and mouse position
  // clientX: the actual position of cursor
  // direction: the direction of move (if not provided, is calculated)
  _solveMove (type, value, distance, clientX, direction = null) {
    // Let's say somebody wants to move a label...

    // but he or she clicked not in the center of label:
    value -= distance

    // Definitely it can't:
    if (value < this.options.min) {
      // move behind min,
      value = this.options.min
    } 
    if (value > this.options.max) {
      // and behind max
      value = this.options.max
    }

    if (type == 'from') {
      // He or she can't move 'from' behind 'to'!
      this.selected.from = (value < this.selected.to) ? value : this.selected.to
      this._focusSlider('from')
    } else if (type == 'to') {
      // also can't move 'to' before 'from'!
      this.selected.to = (value > this.selected.from) ? value : this.selected.from
      this._focusSlider('to')
    } else if (type == 'single') {
      // But if, and ONLY IF, hypothetical, somebody would want to move SINGLE label
      // (single means selected values are equal)
      // we need to determine whether he or she is moving it to the LEFT or to the RIGHT,
      // then set the corresponding value and move object to proper label.
      // But who would want to do such a thing?
      if (!direction) {
        direction = clientX - this.meta.clickX // negative = left, positive = right
      }
      if (direction < 0) {
        this.selected.from = value
        this.meta.moveObject = this.body.info.from
      } else if (direction > 0) {
        this.selected.to = value
        this.meta.moveObject = this.body.info.to
      }
      // No, seriously, who?

      // In single slider, 'to' is leading
      this._focusSlider('to')
    }

    this.selected.from = this._roundToStep(this.selected.from)
    this.selected.to = this._roundToStep(this.selected.to)

    if (this.options.single) {
      this.selected.from = this.selected.to = this._roundToStep(value)
    }
  }

  // _update returns all events available to use
  // it tries to use the buffering-variable (_eventsObject) to not recreate this big object every time
  get _events () {
    var _this = this;
    return (_this._buffer && _this._buffer.events) ? _this._buffer.events : {
      windowResize: function (event) {
        if (_this._throttle('windowResize', 50)) {
          _this.update()
        }
      },
      touchStart: function (event) {
        _this._events.sliderMouseDown(event.targetTouches.item(0))
      },
      sliderMouseDown: function (event) {
        let type = event.target.dataset.jsrType
        event.preventDefault()

        _this._focusSlider(type)

        // Calculate distanceFromValue
        let valueOfType = (type == 'single') ? _this.selected.from : _this.selected[type] // single value may use etheir 'from' or 'to' value
        _this.meta.distanceFromValue = _this._getValueOfPosition(event.clientX) - valueOfType

        // Handle only move of handled item - type determines if it is handled
        if (type) {
          if (type == 'min') {
            // 'min' label was clicked
            _this.selected.from = _this.options.min
            if (_this.options.single) {
              _this.selected.to = _this.selected.from
            }
          } else if (type == 'max') {
            // 'max' label was clicked
            _this.selected.to = _this.options.max
            if (_this.options.single) {
              _this.selected.from = _this.selected.to
            }
          } else {
            // other label/slider was clicked
            _this.meta.moveObject = event.target
            _this.meta.clickX = event.clientX
            return // don't execute .update(), because nothing to update
          }

          // Update after setting values
          _this.update()
        }
      },
      sliderMouseUp: function (event) {
        // Clean data
        _this.meta.moveObject        = null
        _this.meta.clickX            = null
        _this.meta.distanceFromValue = null
      },
      touchMove: function (event) {
        _this._events.sliderMouseMove(event.targetTouches.item(0))
      },
      sliderMouseMove: function (event) {
        if (_this.meta.moveObject && _this._throttle('mousemove', 20)) {
          let type   = _this.meta.moveObject.dataset.jsrType
          let value  = _this._getValueOfPosition(event.clientX)
          _this._solveMove(type, value, _this.meta.distanceFromValue, event.clientX)
          _this.update()
        }
      },
      railClick: function (event) {
        // Determine which slider is closer to the clicked value
        let clickedValue = _this._getValueOfPosition(event.clientX)
        clickedValue = _this._roundToStep(clickedValue)
        // Average is mid-point between sliders
        let selectedAverage = (_this.selected.from + _this.selected.to) / 2

        if (clickedValue < selectedAverage) {
          // clicked on the left side of average, move 'from'
          _this.selected.from = clickedValue
          var type = 'from'
          if (_this.options.single) {
            _this.selected.to = _this.selected.from
          }
        } else {
          // clicked on the right side of average, move 'to'
          _this.selected.to = clickedValue
          var type = 'to'
          if (_this.options.single) {
            _this.selected.from = _this.selected.to
          }
        }

        _this._focusSlider((_this.options.single ? 'single' : type))
        _this.update()
      },
      keydown: function (event) {
        let type     = event.target.dataset.jsrType
        let keyCodes = {
          left: 37,
          right: 39
        }

        // If the left or right arrow was pressed
        if (event.keyCode == keyCodes.left || event.keyCode == keyCodes.right) {
          // Prevent default, to disable functions like selecting text
          // Condition doesn't block other keys like TAB
          event.preventDefault()
        }

        let value  = _this.selected[type]
        let moveBy = (event.shiftKey ? _this.meta.twentiethRange : (
                       event.ctrlKey ? _this.options.step * 10 : _this.options.step))

        if (event.keyCode == keyCodes.left) {
          value -= moveBy
          var direction = -1
        } else if (event.keyCode == keyCodes.right) {
          value += moveBy
          var direction = 1
        } else {
          // other key was pressed, don't do anything
          return false
        }

        _this._solveMove(type, value, 0, 0, direction)
        _this.update()
      }
    }
  }

  // _update returns all methods available to use to update things
  // it tries to use the buffering-variable (_updateObject) to not recreate this big object every time
  get _update () {
    var _this = this;
    return (_this._buffer && _this._buffer.update) ? _this._buffer.update : {
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
        let start = (_this.selected.from - _this.options.min) / (_this.options.max  - _this.options.min)
        let end   = (_this.selected.to  - _this.options.min) / (_this.options.max  - _this.options.min)
        // Calc real start (because of weird percentage work)
        let realStart = start / (1 - (end - start))

        // Sets colored part of rail
        // Expects percentages without % sign
        _this.body.rail.style.backgroundPosition  = `${realStart * 100}% 0`
        _this.body.rail.style.backgroundSize      = `${(end - start) * 100}% 100%`
      },

      sliders: function () {
        let fromWidthRatio = _this._getWidthOf(_this.body.sliders.from)
        let toWidthRatio   = _this._getWidthOf(_this.body.sliders.to)
        // widthRatio is used to place middle point of slider in the right point
        let from = (_this.selected.from - _this.options.min) / (_this.options.max  - _this.options.min)
        from     = from - fromWidthRatio / 2
        let to   = (_this.selected.to  - _this.options.min) / (_this.options.max  - _this.options.min)
        to       = to - toWidthRatio / 2

        _this.body.sliders.from.style.left  = `${from * 100}%`
        _this.body.sliders.to.style.left    = `${to * 100}%`
      },

      info: function () {
        let min  = _this._getStringWithDecimals(_this.options.min)
        let max  = _this._getStringWithDecimals(_this.options.max)
        let from = _this._getStringWithDecimals(_this.selected.from)
        let to   = _this._getStringWithDecimals(_this.selected.to)

        // Update text
        _this.body.info.min.innerHTML          = _this._addAffixes(min, 'min')
        _this.body.info.max.innerHTML          = _this._addAffixes(max, 'max')
        _this.body.info.from.innerHTML         = _this._addAffixes(from, 'from')
        _this.body.info.to.innerHTML           = _this._addAffixes(to, 'to')
        _this.body.info.singleFrom.innerHTML   = _this._addAffixes(from, 'from')
        _this.body.info.singleTo.innerHTML     = _this._addAffixes(to, 'to')
        _this.body.info.singleSingle.innerHTML = _this._addAffixes(to, 'single') // doesn't matter which one

        // Hide singleFrom and singleTo if equal
        if (_this.selected.from == _this.selected.to) {
          _this.body.info.singleFrom.style.display   = 'none'
          _this.body.info.singleTo.style.display     = 'none'
          _this.body.info.singleSingle.style.display = 'inline-block'
        } else {
          _this.body.info.singleFrom.style.display   = 'inline-block'
          _this.body.info.singleTo.style.display     = 'inline-block'
          _this.body.info.singleSingle.style.display = 'none'
        }

        // Position infos
        let fromInfoWidth   = _this._getWidthOf(_this.body.info.from)
        let toInfoWidth     = _this._getWidthOf(_this.body.info.to)
        let singleInfoWidth = _this._getWidthOf(_this.body.info.single)
        let fromInfoLeft    = _this._getCenterOf(_this.body.sliders.from) - fromInfoWidth / 2
        let toInfoLeft      = _this._getCenterOf(_this.body.sliders.to) - toInfoWidth / 2
        let slidersMiddle   = (_this._getCenterOf(_this.body.sliders.from) + _this._getCenterOf(_this.body.sliders.to)) / 2
        let singleInfoLeft  = slidersMiddle - singleInfoWidth / 2

        // if info exceeds parent, we need to hold it in place
        let parentLeft  = _this._getLeftOf(_this.body.parent)
        let parentRight = _this._getRightOf(_this.body.parent)

        if (fromInfoLeft < parentLeft) {
          fromInfoLeft = parentLeft
        } else if (fromInfoLeft + fromInfoWidth > parentRight) {
          fromInfoLeft = parentRight - fromInfoWidth
        }

        if (toInfoLeft < parentLeft) {
          toInfoLeft = parentLeft
        } else if (toInfoLeft + toInfoWidth > parentRight) {
          toInfoLeft = parentRight - toInfoWidth
        }

        if (singleInfoLeft < parentLeft) {
          singleInfoLeft = parentLeft
        } else if (singleInfoLeft + singleInfoWidth > parentRight) {
          singleInfoLeft = parentRight - singleInfoWidth
        }

        // And now we can save it
        _this.body.info.from.style.left   = `${fromInfoLeft * 100}%`
        _this.body.info.to.style.left     = `${toInfoLeft * 100}%`
        _this.body.info.single.style.left = `${singleInfoLeft * 100}%`

        // Determine infos overlap, and hide them
        // 'from' and 'to' overlaps
        if (_this._getRightOf(_this.body.info.from) > _this._getLeftOf(_this.body.info.to)) {
          _this.body.info.from.style.visibility   = 'hidden'
          _this.body.info.to.style.visibility     = 'hidden'
          _this.body.info.single.style.visibility = 'visible'
        } else {
          _this.body.info.from.style.visibility   = 'visible'
          _this.body.info.to.style.visibility     = 'visible'
          _this.body.info.single.style.visibility = 'hidden'
        }

        // 'min' and 'from' overlaps
        if (_this._getRightOf(_this.body.info.min) > _this._getLeftOf(_this.body.info.from)
            || (_this._getRightOf(_this.body.info.min) > _this._getLeftOf(_this.body.info.single) 
                && _this.body.info.single.style.visibility == 'visible')) {
          _this.body.info.min.style.visibility = 'hidden'
        } else {
          _this.body.info.min.style.visibility = 'visible'
        }

        // 'max' and 'to' overlaps
        if (_this._getRightOf(_this.body.info.to) > _this._getLeftOf(_this.body.info.max)
            || (_this._getRightOf(_this.body.info.single) > _this._getLeftOf(_this.body.info.max)
                && _this.body.info.single.style.visibility == 'visible')) {
          _this.body.info.max.style.visibility = 'hidden'
        } else {
          _this.body.info.max.style.visibility = 'visible'
        }
      },

      values: function () {
        // Update inputs values
        _this.inputMin.setAttribute('value', _this.selected.from)
        _this.inputMax.setAttribute('value', _this.selected.to)
      }
    }
  }

  // Add suffixed and affixes to text
  _addAffixes (value, type) {
    if (this.options.prefixes[type]) {
      value = this.options.prefixes[type] + value
    }

    if (this.options.suffixes[type]) {
      value += this.options.suffixes[type]
    }

    return value
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

  // Deep merge by https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
  // Pass in the objects to merge as arguments.
  // For a deep extend, set the first argument to `true`.
  _extend () {
    // Variables
    var extended = {}
    var deep = false
    var i = 0
    var length = arguments.length
    var _this = this;

    // Check if a deep merge
    if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
      deep = arguments[0]
      i++
    }

    // Merge the object into the extended object
    var merge = function (obj) {
      for ( var prop in obj ) {
        if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
          // If deep merge and property is an object, merge properties
          if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
            extended[prop] = _this._extend( true, extended[prop], obj[prop] )
          } else {
            extended[prop] = obj[prop]
          }
        }
      }
    };

    // Loop through each object and conduct a merge
    for ( ; i < length; i++ ) {
      var obj = arguments[i]
      merge(obj)
    }

    return extended
  }
}