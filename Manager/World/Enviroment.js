import {
  Object3D,
  DirectionalLight,
  // CameraHelper,
  SpotLight,
  AmbientLight,
} from 'three';
// import { GUI } from 'dat.gui';

export default class Enviroment {
  constructor(manager) {
    this.manager = manager;
    this.scene = this.manager.scene;

    this.setSunlight();
  }

  setSunlight() {
    this.sunLightTarget = new Object3D();
    this.sunLightTarget.position.x = -1.3;
    this.sunLightTarget.position.y = 3.3;
    this.sunLightTarget.position.z = -1.4;

    this.sunLight = new DirectionalLight('#ffffff', 1);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 60;
    this.sunLight.shadow.mapSize.set(4096, 4096);
    this.sunLight.shadow.normalBias = 0.1;
    this.sunLight.shadow.bias = 0.001;
    this.sunLight.position.set(-2.1, 7.4, -5.2);
    this.sunLight.target = this.sunLightTarget;

    // const helper = new CameraHelper(this.sunLight.shadow.camera);
    // this.scene.add(helper);

    this.scene.add(this.sunLightTarget);
    this.scene.add(this.sunLight);

    this.spotLight = new SpotLight('#ffffff', 1.5);
    this.spotLight.position.set(-3, 3, 8);
    this.scene.add(this.spotLight);

    this.ambientlight = new AmbientLight('#ffffff', 1.2);
    this.scene.add(this.ambientlight);

    //     const gui = new GUI();
    // const folder = gui.addFolder('Camera Pos');

    // folder
    //   .add(this.sunLight.position, 'x', -30, 30, 0.01)

    // folder.add(this.sunLight.position, 'y', -30, 30, 0.01);
    // folder.add(this.sunLight.position, 'z', -30, 30, 0.01);
  }
}
