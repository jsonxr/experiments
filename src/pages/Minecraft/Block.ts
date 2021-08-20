import { Model, ModelVariant, Multipart } from './types'
import { Color3, MeshBuilder, Scene, StandardMaterial, Vector4 } from "@babylonjs/core";

export interface Block {
  variants: Record<string, ModelVariant[]>
  multipart: Multipart[];
}

export const getMeshFromBlock = (block: Block, scene: Scene) => {
  const index = Math.floor(Math.random() * block.variants[""].length)
  const variant = block.variants[""][0];
  const model = variant.model as Model;

  for (const element of model.elements!) {
    for (const face of Object.keys(element.faces)) {
      console.log(face)
    }
  }

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
