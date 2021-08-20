
export interface MinecraftFunction {
  function: string;
  source?: string;
  ops?: { source: string; target: string; op: string;}[]
  entries?: { type: string; name: string }[]
}

export interface Entry {
  type: 'item'|'tag'|'loot_table'|'group'|'alternatives'|'sequence'|'dynamic'|'empty';
  name: string;
  conditions?: { condition: string}[]
  functions?: MinecraftFunction[]
  children?: any;
  expand?: boolean;
  weight?: number;
  quality: number;
}

export interface Pool {
  rolls: number;
  bonus_rolls?: number;
  entries: Entry[],
  conditions?: {condition: string}[]
}

export interface LootTable {
  type: string;
  pools: Pool[];
}
