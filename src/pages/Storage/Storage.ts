// https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API


export interface Migration {
  version: number;
  execute: (db: IDBDatabase) => void;
}

export class Storage {
  private _promise: Promise<void> | IDBDatabase;
  private _db: IDBDatabase | null = null;

  constructor(name: string, migrations: Migration[]) {
    this._promise = this.open(name, migrations);
  }

  async put(collection: string, values: Record<string, any>) {
    await this._promise;

    const keys = Object.keys(values);
    if (!this._db || !values || !keys?.length) {
      return Promise.reject('Not opened');
    }

    return new Promise<void>((resolve, reject) => {
      const transaction = this._db?.transaction(collection, 'readwrite');
      if (transaction) {
        transaction.oncomplete = () => {
          resolve();
        };
        transaction.onerror = (err) => {
          reject(err);
        };

        const objectStore = transaction.objectStore(collection);//.put(value, key);
        keys.forEach((key: string) => {
          objectStore.put(values[key], key);
        })
      } else {
        reject()
      }
    })
  }

  async get(collection: string, key: string): Promise<any> {
    await this._promise;

    return new Promise((resolve, reject) => {
      const transaction = this._db?.transaction(collection, 'readonly');
      if (transaction) {
        transaction.oncomplete = () => {
          resolve(undefined);
        };
        transaction.onerror = (err) => {
          reject(err);
        };
        transaction.objectStore(collection).get(key).onsuccess = (event: Event) => {
          resolve((event?.target as any)?.result)
        }
      } else {
        reject()
      }
    })
  }

  private async open(name: string, migrations: Migration[]): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this._db) {
        return;
      }

      const request = window.indexedDB.open(name, migrations.length);
      request.onerror = function(event) {
        reject(event);
      };
      request.onsuccess = (event) => {
        this._db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };
      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const { oldVersion, target } = event;
        const db = (target as IDBOpenDBRequest).result;

        // Run any migrations...
        for (const m of migrations) {
          if (m.version > oldVersion) {
            console.log('migrate to version', m.version)
            m.execute(db);
          }
        }
      }
    })
  }

  async close(): Promise<void> {
    this._db?.close();
  }
}
