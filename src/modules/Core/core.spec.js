import { Core } from './index';

describe('Core', () => {
  describe('internals', () => {
    describe('_setValue', () => {
      let core;
      let eventizerTrigger;
      const setSliderValue = {};

      beforeEach(() => {
        setSliderValue.original = Core.prototype.setSliderValue;
        Core.prototype.setSliderValue = setSliderValue.mock = jest.fn();

        eventizerTrigger = jest.fn();

        core = new Core();
        core.config.enabled = true;
        core.modules.eventizer = {
          trigger: eventizerTrigger
        };
        core.stepRatio = 0.1;
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

        it('should call setSliderValue', () => {
          core._setValue(0.5, 0);
          expect(setSliderValue.mock).toHaveBeenCalledTimes(1);
        });

        it('should not call setSliderValue if value did not change', () => {
          core._setValue(0.5, 0);
          expect(setSliderValue.mock).toHaveBeenCalledTimes(1);
          core._setValue(0.5, 0);
          expect(setSliderValue.mock).toHaveBeenCalledTimes(1);
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
  });
});