import { useOnMove } from '@/events/useOnMove';
import { avg } from '@/helpers/avg';
import { neighbourGroup } from '@/helpers/neighbourGroup';
import { range } from '@/helpers/range';
import { uniq } from '@/helpers/uniq';
import { StateDto } from '@/models/State';
import { Module } from '@/modules/Module';

export class ModuleLabels extends Module {
  private labels: Map<string, Label> = new Map();

  public destroy () {
    this.labels.forEach(l => l.el.remove());
  }

  public initView () {
    const keyedLabels = [
      this.getBasicLabels(),
      ...this.getAllNeighourLabels(this.config.initialValues.length - 1),
    ].flat();

    this.labels = new Map(keyedLabels.map(label => {
      const el = document.createElement('div');
      el.classList.add('jsr_label');
      el.dataset.key = label.key;
      el.style.left = '0';

      useOnMove(el, x => this.handleMove(label.key, x));

      return [
        label.key,
        { ...label, el } as Label,
      ];
    }));

    this.labels.forEach(label => this.renderer.addChild(label.el));
  }

  public render (state: StateDto): VoidFunction {
    return () => {
      this.applyValues(state);
      this.applyOverlapping();
    };
  }

  private applyValues (state: StateDto) {
    for (const [key, label] of this.labels) {
      const values = uniq(key.split('')).map(i => state.values[Number(i)]);
      const avgLeftRatio = avg(...values.map(v => v.asRatio()));

      label.el.style.left = `${avgLeftRatio * 100}%`;
      label.el.innerHTML = values.map(
        value => value.asReal().toFixed(this.config.stepDecimals),
      ).join(' - ');
    }
  }

  private applyOverlapping () {
    const visibilityMap = [...this.labels.values()].reduce(
      (map, label) => {
        if (label.components.length === 0) {
          return map;
        }

        const first = this.labels.get(label.components[0])!;
        const second = this.labels.get(label.components[1])!;

        const firstRect = first.el.getBoundingClientRect();
        const secondRect = second.el.getBoundingClientRect();

        if (firstRect.right > secondRect.left) {
          return {
            ...map,
            [first.key]: false,
            [second.key]: false,
            [label.key]: true,
          };
        } else {
          return {
            ...map,
            // [first.key]: true,
            // [second.key]: true,
            [label.key]: false,
          };
        }
      },
      {} as Record<string, boolean>,
    );

    [...this.labels.entries()].forEach(([key, label]) => {
      if (visibilityMap[key] === false) {
        label.el.classList.add('is-hidden');
      } else {
        label.el.classList.remove('is-hidden');
      }
    });
  }

  private handleMove (labelKey: string, x: number) {
    if (labelKey.length > 1) {
      return; // @TODO
    }

    this.input.setRatioValue(Number(labelKey), this.renderer.xToRelative(x));
  }

  private getAllNeighourLabels (n: number): KeyedLabel[][] {
    // [a, b, c] -> [[ab, bc], [abc]]
    const process = (arr: string[]): KeyedLabel[][] => {
      // [a, b, c] -> [ab, bc]
      const groups = neighbourGroup(arr).map(components => {
        return {
          key: components.join(''),
          components,
        } as KeyedLabel;
      });

      return [
        groups,
        ...groups.length > 1 ? process(groups.map(g => g.key)) : [],
      ];
    };

    return process(range(n).map(v => v.toString()));
  }

  private getBasicLabels (): KeyedLabel[] {
    return range(this.config.initialValues.length - 1).map(v => ({
      key: v.toString(),
      components: [],
    }));
  }
}

interface Label {
  key: string;
  components: string[];
  el: HTMLElement;
}

interface KeyedLabel {
  key: string;
  components: string[];
}
