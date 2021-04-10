import { ArcRotateCamera, Vector3, HemisphericLight, Scene, Mesh, MeshBuilder, Vector4, StandardMaterial, Color3, Texture } from "@babylonjs/core";
//import SceneComponent from "./SceneComponent"; // uses above component in same directory
import SceneComponent from './components/babylonjs-hook'; // if you install 'babylonjs-hook' NPM.


let box: Mesh | undefined;



const onSceneReady = async (scene: Scene) => {
  const canvas = scene.getEngine().getRenderingCanvas();

  //const camera = new FreeCamera("camera1", new Vector3(0, 1, -10), scene);
  //camera.setTarget(Vector3.Zero());

  const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, new Vector3(0, 0, 0), scene);
  camera.attachControl(canvas, true);
  const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);

    /**** Materials *****/
    //color
    const groundMat = new StandardMaterial("groundMat", scene);
    groundMat.diffuseColor = new Color3(0, 1, 0)

    //texture
    const roofMat = new StandardMaterial("roofMat", scene);
    roofMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/roof.jpg", scene);
    const boxMat = new StandardMaterial("boxMat", scene);
    boxMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/cubehouse.png", scene)


    //options parameter to set different images on each side
    const faceUV = [];
    faceUV[0] = new Vector4(0.6, 0.0, 1.0, 1.0); //rear face
    faceUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0); //front face
    faceUV[2] = new Vector4(0.4, 0, 0.6, 1.0); //right side
    faceUV[3] = new Vector4(0.4, 0, 0.6, 1.0); //left side
    // top 4 and bottom 5 not seen so not set


    /**** World Objects *****/
    const box = MeshBuilder.CreateBox("box", {width: 1, faceUV: faceUV, wrap: true});
    box.material = boxMat;
    box.position.y = 0.5;

    const ground = MeshBuilder.CreateGround("ground", {width:10, height:10});
    ground.material = groundMat;
};

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene: Scene) => {
  if (box !== undefined) {
    var deltaTimeInMillis = scene.getEngine().getDeltaTime();
    const rpm = 10;
    box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
  }
};

const App = () => (
  <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="canvas" style={{outline: 'none', width: '100%', height: '100%'}}/>
);

export default App;
