import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Button } from 'react-native'
import { ArcRotateCamera, Vector3, HemisphericLight, Scene, MeshBuilder, Vector4, Mesh, StandardMaterial, Color3, Texture } from "@babylonjs/core";
import SceneComponent from '../babylonjs/components/babylonjs-hook'; // if you install 'babylonjs-hook' NPM.
import { FileInput } from '../../components/FileInput/FileInput';
import { Minecraft } from './Minecraft';
import { BlockState } from './types/'


const blockToScene = (block: BlockState) => {
  const count = block.variants
}


const minecraft = new Minecraft();

let box: Mesh | undefined;
const MinecraftView = () => {
  const [scene, setScene] = useState<Scene>();

  const onFiles = async (files: FileList) => {
    console.log('files: ', files);
    if (files?.length) {
      const file = files[0];
      console.log('importing...')
      const minecraft = await Minecraft.load(file);

      console.log('imported: ', minecraft);
    }
    console.log('done')
  }

  const onSceneReady = async (scene: Scene) => {
    const canvas = scene.getEngine().getRenderingCanvas();
    //const camera = new FreeCamera("camera1", new Vector3(0, 1, -10), scene);
    //camera.setTarget(Vector3.Zero());

    const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 5, new Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);
    const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);

    /**** Materials *****/
    //color
    const groundMat = new StandardMaterial("groundMat", scene);
    groundMat.diffuseColor = new Color3(0, 1, 0)


    const block = await minecraft.loadBlock('minecraft:stone');
    console.log(block);

    //texture
    const boxMat = new StandardMaterial("boxMat", scene);
    boxMat.specularColor = new Color3(0.0, 0.0, 0.0);
    //console.log('texture: ', texture);


    //boxMat.diffuseTexture = new Texture('data:block/sand.png', scene, true, true, Texture.EXPLICIT_MODE, undefined, undefined, texture, true);
    //boxMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/cubehouse.png", scene)

    //options parameter to set different images on each side
    const faceUV = [];
    faceUV[0] = new Vector4(0, 0, 1.0, 1.0); //rear face
    faceUV[1] = new Vector4(0, 0, 1.0, 1.0); //front face
    faceUV[2] = new Vector4(0, 0, 1.0, 1.0); //right side
    faceUV[3] = new Vector4(0, 0, 1.0, 1.0); //left side
    // top 4 and bottom 5 not seen so not set


    /**** World Objects *****/
    const box = MeshBuilder.CreateBox("box", { width: 1, faceUV: faceUV, wrap: true });
    box.material = boxMat;
    box.position.y = 0.5;

  }

  /**
   * Will run on every frame render.  We are spinning the box on y-axis.
   */
  const onRender = useCallback((scene: Scene) => {
    if (box !== undefined) {
      var deltaTimeInMillis = scene.getEngine().getDeltaTime();
      const rpm = 10;
      box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
    }
  }, []);

  const onDirOpen = async () => {
    // store a reference to our file handle
    let fileHandle;

    async function getFile() {
      // open file picker
      [fileHandle] = await (window as any).showDirectoryPicker();

      if (fileHandle.type === 'file') {
        // run file code
      } else if (fileHandle.type === 'directory') {
        // run directory code
      }
    }

    await getFile();
  }

  return (
    <View>
      <Text>Minecraft</Text>
      <View>
        <Text>Example: </Text><input value="~/Library/Application\ Support/minecraft/versions/1.16.5/1.16.5.jar" readOnly />
      </View>
      <View>
        <Button onPress={onDirOpen} title="Open Dir" />
      </View>
      <View>
        <FileInput onFiles={onFiles} />
        <a href="https://minecraft.fandom.com/wiki/Development_resources#Java_Edition">Development Resources</a>
      </View>
      <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="canvas" style={{ outline: 'none', width: '100%', height: '100%' }} />
    </View>)
}


export default MinecraftView;
