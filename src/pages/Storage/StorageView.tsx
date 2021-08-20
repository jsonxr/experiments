import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native'
import { Storage, Migration } from './Storage';

const migrations: Migration[] = [];
migrations.push({ version: 1, execute: (db: IDBDatabase) => {
  db.createObjectStore('models');
}})
const storage: Storage = new Storage("MyStorage", migrations);


const StorageView = () => {
  useEffect(() => {
    (async () => {
      const model = {
        name: 'model1',
        value: 42,
      }
      await storage.put('models', { '42': model });
      const diffmodel = await storage.get('models', '42');
      console.log(diffmodel);
    })();

    return () => {
      storage.close();
    }
  });

  const onPress = async () => {
    const model = {
      name: 'model1',
      value: 42,
    }
    await storage.put('models', { '42': model });
    const diffmodel = await storage.get('models', '42');
    console.log(diffmodel);
  }

  return <View>
    <Text>Storage</Text>
    <Button title="Go" onPress={onPress} disabled={!storage} />
    </View>
}

export default StorageView;
