import { Config } from '@/models/Config';
import type { State } from '@/models/State';

export interface Changelog {
  changedValues: number[];
}

export type Extension = (config: Config, state: State, changelog: Changelog) => State;