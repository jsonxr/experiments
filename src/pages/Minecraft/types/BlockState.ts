// https://minecraft.fandom.com/wiki/Model#Block_states

import { Model } from "./Model";

export interface ModelVariant {
  model:  string | Model;
  x?: 0 | 90 |180 | 270;
  y?: 0 | 90 |180 | 270;
  uvlock?: boolean;
  weight?: number;
}

export type Condition = Record<string, string> | { OR: Condition[] }

export interface Multipart {
  when: Condition;
  apply: ModelVariant | ModelVariant[]
}

export interface BlockState {
  variants: Record<string, ModelVariant | ModelVariant[]>;
  multipart: Multipart[];
}
