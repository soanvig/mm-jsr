import { Core } from './index';

describe('Core', () => {
  describe('internals', () => {
    describe('_setValue', () => {
      let core;
      let eventizerTrigger;
      const _updateSlider = {};

      beforeEach(() => {
        _updateSlider.original = Core.prototype._updateSlider;
        Core.prototype._updateSlider = _updateSlider.mock = jest.fn();

        eventizerTrigger = jest.fn();

        core = new Core();
        core.config.enabled = true;
        core.modules.eventizer = {
          trigger: eventizerTrigger
        };
        core.stepRatio = 0.1;
      });

      afterEach(() => {
        Core.prototype._updateSlider = _updateSlider.original;
      });

      it('should do nothing if !enabled', () => {
        core.config.enabled = false;
        const result = core._setValue(1);

        expect(result).toBeNull();
        expect(core.values).toEqual(expect.arrayContaining([]));
      });

      describe('when provided with value and id', () => {
        it('should save value', () => {
          core._setValue(0.5, 0);
          expect(core.values[0]).toBe(0.5);
        });

        it('should save value rounded to stepRatio', () => {
          core._setValue(0.54, 0);
          expect(core.values[0]).toBe(0.5);
        });

        it('should call _updateSlider', () => {
          core._setValue(0.5, 0);
          expect(_updateSlider.mock).toHaveBeenCalledTimes(1);
        });

        it('should not call _updateSlider if value did not change', () => {
          core._setValue(0.5, 0);
          expect(_updateSlider.mock).toHaveBeenCalledTimes(1);
          core._setValue(0.5, 0);
          expect(_updateSlider.mock).toHaveBeenCalledTimes(1);
        });

        it('should not exceed preceding value', () => {
          core.values[0] = 0.2;
          core._setValue(0.1, 1);
          expect(core.values[1]).toBe(0.2);
        });

        it('should not exceed following value', () => {
          core.values[1] = 0.2;
          core._setValue(0.3, 0);
          expect(core.values[0]).toBe(0.2);
        });

        it('should set value larger than preceding value', () => {
          core.values[0] = 0.2;
          core._setValue(0.3, 1);
          expect(core.values[1]).toBe(0.3);
        });

        it('should set value smaller than followiing value', () => {
          core.values[1] = 0.2;
          core._setValue(0.1, 0);
          expect(core.values[0]).toBe(0.1);
        });
      });

      describe('when not provided with id', () => {
        it('should find closest value and set it', () => {
          core.values = [0.2, 0.5];
          core._setValue(0.3);
          expect(core.values[0]).toBe(0.3);
        });
      });

      describe('when provided with diff (and id)', () => {
        it('should set value relative to valueInMove', () => {
          core.values = [0.2];
          core.valueInMove[0] = 0.2;

          core._setValue(0.1, 0, true);
          expect(core.values[0]).toBe(0.3);

          core._setValue(-0.1, 0, true);
          expect(core.values[0]).toBe(0.1);
        });
      });

      describe('limits', () => {
        it('should not exceed min limit if defined', () => {
          core._setValue(-1, 0);
          expect(core.values[0]).toBe(0);
        });

        it('can exceed min limit if it is null', () => {
          core.limit.min = null;
          core._setValue(-1, 0);
          expect(core.values[0]).toBe(-1);
        });

        it('should not exceed max limit if defined', () => {
          core._setValue(2, 0);
          expect(core.values[0]).toBe(1);
        });

        it('can exceed max limit if it is null', () => {
          core.limit.max = null;
          core._setValue(2, 0);
          expect(core.values[0]).toBe(2);
        });
      });
    });

    describe('_updateBars', () => {
      let core;

      beforeEach(() => {
        core = new Core();
        core.modules.renderer = {
          body: {
            bars: [
              {
                style: {
                  left: null,
                  right: null
                }
              },
              {
                style: {
                  left: null,
                  right: null
                }
              }
            ]
          }
        };
      });

      it('should set left bar right style', () => {
        core._updateBars(1, 0.3);
        expect(core.modules.renderer.body.bars[0].style.right).toBe('70%');
        expect(core.modules.renderer.body.bars[0].style.left).toBeNull();
      });

      it('should set right bar left style', () => {
        core._updateBars(0, 0.3);
        expect(core.modules.renderer.body.bars[0].style.left).toBe('30%');
        expect(core.modules.renderer.body.bars[0].style.right).toBeNull();
      });
    });

    describe('_updateSlider', () => {
      let core;

      beforeEach(() => {
        core = new Core();
        core._updateBars = jest.fn();
        core.logger = {
          debug: jest.fn()
        };
        core.modules.renderer = {
          body: {
            sliders: [
              {
                style: {
                  left: null,
                  right: null
                }
              }
            ]
          }
        };
      });

      it('should set slider left', () => {
        core._updateSlider(0, 0.3);
        expect(core.modules.renderer.body.sliders[0].style.left).toBe('30%');
        expect(core.modules.renderer.body.sliders[0].style.right).toBe(null);
      });
    });
    describe('_initValues', () => {
      let core;
      const _setValue = {};

      beforeEach(() => {
        _setValue.original = Core.prototype._setValue;
        Core.prototype._setValue = _setValue.mock = jest.fn();

        core = new Core();
        core.config = {
          min: 0,
          max: 10,
          values: [0, 2, 5]
        };
      });

      afterEach(() => {
        Core.prototype._setValue = _setValue.original;
      });

      it('should set values from config', () => {
        core._initValues();

        expect(_setValue.mock.mock.calls).toHaveLength(3);
        expect(_setValue.mock.mock.calls).toEqual(
          expect.arrayContaining([[0, 0], [0.2, 1], [0.5, 2]])
        );
      });
    });

    describe('_initLimits', () => {
      let core;
      const setLimit = {};

      beforeEach(() => {
        setLimit.original = Core.prototype.setLimit;
        Core.prototype.setLimit = setLimit.mock = jest.fn();

        core = new Core();
        core.config = {
          limit: {
            min: 20,
            max: 100
          }
        };
      });

      afterEach(() => {
        Core.prototype.setLimit = setLimit.original;
      });

      it('should create limit object', () => {
        core._initLimits();
        expect(core.limit).toMatchObject({});
      });

      it('should call setLimit', () => {
        core._initLimits();
        expect(setLimit.mock.mock.calls).toEqual(
          expect.arrayContaining([
            ['min', 20, true],
            ['max', 100, true]
          ])
        );
      });
    });

    describe('_initData', () => {
      let core;

      beforeEach(() => {
        core = new Core();
        core.config = {
          min: 0,
          max: 100,
          step: 1
        };
      });

      it('should set stepRatio', () => {
        core._initData();
        expect(core.stepRatio).toBeCloseTo(0.01, 2);
      });

      it('should set stepRatioDecimals', () => {
        core._initData();
        expect(core.stepRatioDecimals).toBe(2);
      });
    });
  });

  describe('public methods', () => {
    let core;

    beforeEach(() => {
      core = new Core();
      core.config = {
        min: 0,
        max: 100,
        values: [0, 20, 50],
        step: 10
      };
    });

    describe('build', () => {

    });

    describe('init', () => {

    });

    describe('getValue', () => {
      it('should return value converted to real', () => {
        core.values = [0.2];
        const value = core.getValue(0);
        expect(value).toBe(20);
      });
    });

    describe('refresh', () => {

    });

    describe('setValue', () => {

    });

    describe('setLimit', () => {

    });

    describe('view', () => {

    });
  });
});