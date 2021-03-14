import { useOnMove } from '@/events/useOnMove';
import { neighbourGroup } from '@/helpers/neighbourGroup';
import { range } from '@/helpers/range';
import { uniq } from '@/helpers/uniq';
import { StateDto } from '@/models/State';
import { Module } from '@/modules/Module';

export class ModuleLabels extends Module {
  private labels: HTMLElement[] = [];

  public destroy () {
    this.labels.forEach(l => l.remove());
  }

  public initView () {
    // this.labels = this.config.initialValues.map((_, index) => {
    //   const label = document.createElement('div');
    //   label.classList.add('jsr_label');
    //   label.style.left = '0';

    //   useOnMove(label, x => this.handleMove(index, x));

    //   return label;
    // });

    const labels = [
      ...range(this.config.initialValues.length).map(v => v.toString()),
      ...this.getAllNeighourLabels(this.config.initialValues.length),
    ].flat();

    this.labels = labels.map(labelKey => {
      const label = document.createElement('div');
      label.classList.add('jsr_label');
      label.dataset.key = labelKey;
      label.style.left = '0';

      // useOnMove(label, x => this.handleMove(index, x));

      return label;
    });

    this.labels.forEach(label => this.renderer.addChild(label));
  }

  public render (state: StateDto): VoidFunction {
    return () => {
      state.values.forEach((value, i) => {
        this.labels[i].style.left = `${value.asRatio() * 100}%`;
        this.labels[i].innerHTML = value.asReal().toFixed(this.config.stepDecimals);
      });
    };
  }

  // private handleMove (index: number, x: number) {
  //   this.input.setRatioValue(index, this.renderer.xToRelative(x));
  // }

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