import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native'
import { FileInput } from '../../components/FileInput';

const createFilesystem = async () => new Promise((resolve, reject) => {
  (navigator as any).webkitPersistentStorage.requestQuota(300*1024*1024, () => {
    (window as any).webkitRequestFileSystem((window as any).PERSISTENT, 300, resolve, reject);
  }, reject)
});

const FileSystemView = () => {

  const [estimate, setEstimate] = useState<any>(null);
  const quota = Math.floor(estimate?.quota ?? 0 / (1000*1000*1000))
  const usage = Math.floor(estimate?.usage ?? 0 / (1000*1000*1000))

  const onPress = async () => {
    const filesystem = await createFilesystem();
    console.log(filesystem);
  }

  useEffect(() => {
    navigator.storage.estimate().then(inEstimate => {
      setEstimate(inEstimate);
      // estimate.quota is the estimated quota
      // estimate.usage is the estimated number of bytes used
    });
  }, [])

  return <View>
    <Text>FileSystemView</Text>
    <a href="https://caniuse.com/filesystem">caniuse</a>
    <Button onPress={onPress} title="Doit" />
    <Text>Quota: {quota}Gb</Text>
    <Text>Usage: {usage}Gb</Text>
    </View>
}

export default FileSystemView;
