import { useOnMove } from '@/events/useOnMove';
import { avg } from '@/helpers/avg';
import { neighbourGroup } from '@/helpers/neighbourGroup';
import { range } from '@/helpers/range';
import { uniq } from '@/helpers/uniq';
import { StateDto } from '@/models/State';
import { Module } from '@/modules/Module';

export class ModuleLabels extends Module {
  private labels: Map<string, HTMLElement> = new Map();

  public destroy () {
    this.labels.forEach(l => l.remove());
  }

  public initView () {
    const labels = [
      ...range(this.config.initialValues.length - 1).map(v => v.toString()),
      ...this.getAllNeighourLabels(this.config.initialValues.length - 1),
    ].flat();

    this.labels = new Map(labels.map(labelKey => {
      const label = document.createElement('div');
      label.classList.add('jsr_label');
      label.dataset.key = labelKey;
      label.style.left = '0';

      useOnMove(label, x => this.handleMove(labelKey, x));

      return [labelKey, label];
    }));

    this.labels.forEach(label => this.renderer.addChild(label));
  }

  public render (state: StateDto): VoidFunction {
    return () => {
      for (const [key, label] of this.labels) {
        const values = key.split('').map(i => state.values[Number(i)]);
        const avgLeftRatio = avg(...values.map(v => v.asRatio()));

        label.style.left = `${avgLeftRatio * 100}%`;
        label.innerHTML = values.map(
          value => value.asReal().toFixed(this.config.stepDecimals),
        ).join(' - ');
      }
    };
  }

  private handleMove (labelKey: string, x: number) {
    if (labelKey.length > 1) {
      return; // @TODO
    }

    this.input.setRatioValue(Number(labelKey), this.renderer.xToRelative(x));
  }

  private getAllNeighourLabels (n: number) {
    // [a, b, c] -> [[ab, bc], [abc]]
    const process = (arr: string[]): string[][] => {
      const groups = neighbourGroup(arr).map(inner => {
        return uniq(inner.join('').split('')).join('');
      });

      return [
        groups,
        ...groups.length > 1 ? process(groups) : [],
      ];
    };

    return process(range(n).map(v => v.toString()));
  }
}