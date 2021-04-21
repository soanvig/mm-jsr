import { Extension } from '@/extensions/types';

const label = 'Extension process time';

export const extensionPerformanceStart: Extension = (_, state) => {
  console.time(label);

  return state;
};

export const extensionPerformanceEnd: Extension = (_, state) => {
  console.timeEnd(label);

  return state;
};