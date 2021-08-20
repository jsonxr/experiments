import JSZip from 'jszip';
import { Model, BlockState, ModelVariant } from './types';
import { Storage, Migration } from '../Storage/Storage';
import { Block } from './Block';


export class MinecraftError extends Error {
  constructor(public code: number, message: string) {
    super(message);
  }
}
export class NotFoundError extends Error {
  constructor(name: string) {
    super(`"${name}" not found`)
  }
}

const migrations: Migration[] = [];
migrations.push({ version: 1, execute: (db: IDBDatabase) => {
  db.createObjectStore('blockstates');
  db.createObjectStore('models');
  db.createObjectStore('sounds');
  db.createObjectStore('textures');
}})
const storage: Storage = new Storage("Minecraft", migrations);


const jszip = new JSZip();

async function importObjects<T>(zip: JSZip, regex: string, type: 'text' | 'arraybuffer' = 'text'): Promise<Record<string, T>> {
  const blocks: Record<string, T> = {};
  const r = new RegExp(regex);
  const zipObjects: JSZip.JSZipObject[] = zip.file(r);

  for (let i = 0; i < zipObjects.length; i++) {
    const zipObject = zipObjects[i];
    const found = zipObject.name.match(r);
    if (found?.length === 2) {
      const name = found[1];

      await zipObject.async('arraybuffer');
      if (type === 'text') {
        const str = await zipObject.async('text');
        const json: T = JSON.parse(str);
        blocks[name] = json;
      } else {
        const buffer = await zipObject.async('arraybuffer');
        blocks[name] = buffer as unknown as T;
      }
    }
  }

  return blocks;
}

const importModels = async (zip: JSZip): Promise<Record<string, Model>> => importObjects(zip, '^assets/minecraft/models/(.*).json$');
const importBlockStates = async (zip: JSZip): Promise<Record<string, BlockState>> => importObjects(zip, '^assets/minecraft/blockstates/(.*).json$');
const importBlockTextures = async (zip: JSZip): Promise<Record<string, ArrayBuffer>> => importObjects(zip, '^assets/minecraft/textures/(.*)\\.png$', 'arraybuffer')
const importBlockSounds = async (zip: JSZip): Promise<Record<string, ArrayBuffer>> => importObjects(zip, '^assets/minecraft/sounds/(.*)\\.ogg$', 'arraybuffer')

export class Minecraft {
  models: Record<string, Model> = {}
  blockstates: Record<string, BlockState> = {}
  textures: Record<string, ArrayBuffer> = {}
  sounds: Record<string, ArrayBuffer> = {}
  blocks: Record<string, Block> = {}

  async loadFromCache<T>(name: string, collection: string, cache: Record<string, T>): Promise<T> {
    const lookup = name.replace('minecraft:', '');

    // Check cache...
    if (cache[lookup]) {
      return cache[lookup];
    }

    // Get from storage
    const object: T = await storage.get(collection, lookup);
    if (object) {
      cache[lookup] = object;
      return object;
    }

    throw new NotFoundError(name);
  }

  async loadBlockState(name: string): Promise<undefined | BlockState> {
    return this.loadFromCache(name, 'blockstates', this.blockstates);
  }

  async loadBlock(name: string): Promise<undefined | Block> {
    let block: Block = this.blocks[name];
    if (block) {
      return block;
    }

    const blockstates = await this.loadBlockState(name);
    if (!blockstates) {
      throw new NotFoundError(name);
    }

    block = { variants: {}, multipart: []}
    for (const key of Object.keys(blockstates.variants)) {
      const variants: ModelVariant[] = Array.isArray(blockstates.variants[key]) ? blockstates.variants[key] as ModelVariant[] : [blockstates.variants[key] as ModelVariant];
      block.variants![key] = variants;

      for (const variant of variants) {
        if (typeof variant.model === 'string') {
          variant.model = await this.loadModel(variant.model);
        }
      }
    }

    return block;
  }

  async loadModel(name: string): Promise<Model> {
    const model = await this.loadFromCache(name, 'models', this.models);

    let parent
    if (typeof model.parent === 'string') {
      parent = await this.loadModel(model.parent);
    }

    let result;
    if (parent) {
      result = {...parent, ...model, textures: {...parent.textures, ...model.textures}}
    } else {
      result = {...model}
    }

    delete result.parent;

    return result;
  }

  async loadTexture(name: string): Promise<undefined | ArrayBuffer> {
    return this.loadFromCache(name, 'textures', this.textures);
  }

  static async load(file: File): Promise<Minecraft> {
    const zip: JSZip = await jszip.loadAsync(file)
    const jar = new Minecraft();
    jar.models = await importModels(zip);
    jar.blockstates = await importBlockStates(zip);
    jar.textures = await importBlockTextures(zip);
    jar.sounds = await importBlockSounds(zip);

    await storage.put('blockstates', jar.blockstates);
    await storage.put('models', jar.models);
    await storage.put('textures', jar.textures);
    await storage.put('sounds', jar.sounds);

    return jar;
  }

}
