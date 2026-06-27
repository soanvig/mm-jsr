import {
  JSR,
  ModuleRail,
  ModuleSlider,
  ModuleBar,
  ModuleLabel,
  ModuleGrid,
  ModuleLimit,
} from 'mm-jsr';

const init = () => {
  new JSR({
    modules: [
      new ModuleRail(),
      new ModuleSlider(),
      new ModuleBar(),
      new ModuleLabel(),
      new ModuleGrid({ color: '#777' }),
    ],
    config: {
      min: 0,
      max: 100,
      step: 1,
      initialValues: [25, 75],
      container: document.getElementById('start-jsr'),
    },
  });

  new JSR({
    modules: [
      new ModuleRail(),
      new ModuleSlider(),
      new ModuleBar(),
      new ModuleLabel(),
    ],
    config: {
      min: 0,
      max: 100,
      step: 1,
      initialValues: [25, 75],
      container: document.getElementById('demo-1'),
    },
  });

  new JSR({
    modules: [
      new ModuleLimit({ min: 25, max: 75 }),
      new ModuleRail(),
      new ModuleSlider(),
      new ModuleLabel(),
    ],
    config: {
      min: 0,
      max: 100,
      step: 1,
      initialValues: [35, 65],
      container: document.getElementById('demo-2'),
    },
  });

  new JSR({
    modules: [
      new ModuleRail(),
      new ModuleSlider(),
      new ModuleLabel({ formatter: v => `${v}°C` }),
      new ModuleGrid({ formatter: v => `${v}°C`, color: '#999' }),
    ],
    config: {
      min: 0,
      max: 100,
      step: 1,
      initialValues: [50],
      container: document.getElementById('demo-3'),
    },
  });

  new JSR({
    modules: [
      new ModuleSlider(),
      new ModuleGrid({ color: '#999' }),
    ],
    config: {
      min: 0,
      max: 100,
      step: 1,
      initialValues: [50],
      container: document.getElementById('demo-4'),
    },
  });

  new JSR({
    modules: [
      new ModuleRail(),
      new ModuleBar(),
      new ModuleLabel(),
    ],
    config: {
      min: 0,
      max: 100,
      step: 1,
      initialValues: [30, 70],
      container: document.getElementById('demo-5'),
    },
  });

  new JSR({
    modules: [
      new ModuleSlider(),
      new ModuleRail(),
      new ModuleBar(),
      new ModuleLabel(),
    ],
    config: {
      min: 0,
      max: 100,
      step: 1,
      initialValues: [15, 30, 45, 60],
      container: document.getElementById('demo-6'),
    },
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
