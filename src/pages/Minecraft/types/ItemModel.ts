import { Model } from './Model';

export interface Override {
  predicate: Record<string, number>;
  model: string;
}

export interface ItemModel extends Model {
  gui_light: string;
  overrides: Override[];
}
