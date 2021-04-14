import { useOnMove } from '@/events/useOnMove';
import { avg } from '@/helpers/avg';
import { neighbourGroup } from '@/helpers/neighbourGroup';
import { range } from '@/helpers/range';
import { uniq } from '@/helpers/uniq';
import { StateDto } from '@/models/State';
import { Value } from '@/models/Value';
import { Module } from '@/modules/Module';
import { assert, isFunction } from '@/validation/assert';

interface Settings {
  formatter: (realValue: number) => string;
}

export class ModuleLabel extends Module {
  private labels: Map<string, Label> = new Map();
  private primaryLabels: string[] = [];
  private settings: Settings;

  constructor (settings: Partial<Settings> = {}) {
    super();

    this.assertSettings(settings);

    this.settings = Object.assign({
      formatter: String,
    }, settings);
  }

  public destroy () {
    this.labels.forEach(l => l.el.remove());
  }

  public initView () {
    const primaryLabels = getPrimaryLabels(this.config.valuesCount);

    const labelGroups = [
      primaryLabels,
      ...getAllNeighourLabels(this.config.valuesCount),
    ];

    const labels = new Map(labelGroups.flat().map(label => {
      const el = document.createElement('div');
      el.classList.add('jsr_label');
      el.dataset.key = label;
      el.style.left = '0';

      useOnMove(el, (x, trigger) => this.handleMove(label, x, trigger), this.renderer.getContainer());

      return [
        label,
        { key: label, el } as Label,
      ];
    }));

    this.primaryLabels = primaryLabels;
    this.labels = labels;
    this.labels.forEach(label => this.renderer.addChild(label.el));
  }

  public render (state: StateDto): VoidFunction {
    return () => {
      this.applyValues(state);
      this.fixExceeding();
      this.fixOverlapping();
    };
  }

  private applyValues (state: StateDto) {
    for (const [key, label] of this.labels) {
      const labels = uniq(key.split('')).map(singleKey => ({
        key: singleKey,
        value: state.values[Number(singleKey)],
      }));

      const avgLeftRatio = avg(...labels.map(v => v.value.asRatio()));
      const formatValue = (v: Value) => this.settings.formatter(
        Number(v.asReal().toFixed(this.config.stepDecimals)),
      );

      label.el.style.left = `${avgLeftRatio * 100}%`;
      label.el.innerHTML = labels.map(
        (label, index) => `
        <span data-key="${label.key}">
          ${formatValue(label.value)}
          ${index < (labels.length - 1) ? ' - ' : ''}
        </span>
      `,
      ).join('');
    }
  }

  /**
   * @performance
   */
  private fixOverlapping () {
    const verifiedLabels = verifyVisibleLabels([], this.primaryLabels, this.doLabelsOverlap.bind(this));

    [...this.labels.values()].forEach(label => {
      if (verifiedLabels.includes(label.key)) {
        label.el.classList.remove('is-hidden');
      } else {
        label.el.classList.add('is-hidden');
      }
    });
  }

  /**
   * @performance
   */
  private fixExceeding () {
    const containerRect = this.renderer.getContainer().getBoundingClientRect();

    [...this.labels.values()].map(l => l.el).forEach(label => {
      const rect = label.getBoundingClientRect();

      if (rect.left < containerRect.left) {
        const currentLeft = parseFloat(label.style.left);
        const correction = this.renderer.distanceToRelative(containerRect.left - rect.left) * 100;
        label.style.left = `${currentLeft + correction}%`;
      }

      if (rect.right > containerRect.right) {
        const currentLeft = parseFloat(label.style.left);
        const correction = this.renderer.distanceToRelative(rect.right - containerRect.right) * 100;
        label.style.left = `${currentLeft - correction}%`;
      }
    });
  }

  private handleMove (labelKey: string, x: number, trigger: HTMLElement) {
    const ratio = this.renderer.positionToRelative(x);

    if (labelKey.length === 1) {
      this.input.setRatioValue(Number(labelKey), ratio);
    } else {
      const movedLabelKey = trigger.dataset.key;

      if (!movedLabelKey || movedLabelKey.length > 1) {
        return; // @TODO
      }

      this.input.setRatioValue(Number(movedLabelKey), ratio);
    }
  }

  private doLabelsOverlap (first: string, second: string): boolean {
    const firstRect = this.labels.get(first)!.el.getBoundingClientRect();
    const secondRect = this.labels.get(second)!.el.getBoundingClientRect();

    return firstRect.right > secondRect.left;
  }

  private assertSettings (settings: Partial<Settings>) {
    settings.formatter && assert('Label.formatter', settings.formatter, isFunction);
  }
}

const uniqChars = (str: string) => uniq(str.split('')).join('');

export const getPrimaryLabels = (n: number): string[] => {
  if (n === 0) {
    return [];
  }

  if (n === 1) {
    return ['0'];
  }

  return range(n - 1).map(v => v.toString());
};

export const getAllNeighourLabels = (n: number): string[][] => {
  // [a, b, c] -> [[ab, bc], [abc]]
  const process = (arr: string[]): string[][] => {
    // [a, b, c] -> [ab, bc]
    const groups = neighbourGroup(arr).map(g => uniqChars(g.join('')));

    return [
      groups,
      ...groups.length > 1 ? process(groups) : [],
    ];
  };

  return process(getPrimaryLabels(n));
};

export const verifyVisibleLabels = (
  verifiedLabels: string[],
  labels: string[],
  doLabelsOverlap: (first: string, second: string) => boolean,
): string[] => {
  const [first, second, ...rest] = labels;

  if (!first) {
    return verifiedLabels;
  } else if (!second) {
    return [...verifiedLabels, first];
  } else {
    if (doLabelsOverlap(first, second)) {
      return verifyVisibleLabels(
        [],
        // labels overlap, so verify if joined label overlaps with previous ones (already verified) or with next (rest)
        [...verifiedLabels, uniqChars(first + second), ...rest],
        doLabelsOverlap,
      );
    } else {
      return verifyVisibleLabels(
        [...verifiedLabels, first], // first label doesn't overlap second, so it's visible
        [second, ...rest], // but second label may overlap with third, so pass it further
        doLabelsOverlap,
      );
    }
  }
};

interface Label {
  key: string;
  el: HTMLElement;
}
