import {
  PerspectiveCamera,
  // CameraHelper,
  // Vector3,
  // GridHelper,
  // AxesHelper,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';
import gsap from 'gsap';
import { animateText } from '../Manager/Utils/animateText';

export default class Camera {
  constructor(manager) {
    this.manager = manager;
    this.sizes = this.manager.sizes;
    this.scene = this.manager.scene;
    this.canvas = this.manager.canvas;
    this.fovMax = 55;
    this.fovMin = 35;
    this.fov = this.fovMin;
    this.createPerspectiveCamera();
    this.createPerspectiveCameraMain();

    // this.setOrbitControls();
  }

  createPerspectiveCamera() {
    this.setUpFov();
    this.perspectiveCamera = new PerspectiveCamera(
      this.fov,
      this.sizes.aspect,
      0.1,
      200
    );
    this.perspectiveCamera.position.z = 12;
    // this.perspectiveCamera.lookAt(0, 0, 0);
    // this.perspectiveCamera.rotation.order = 'YXZ';
    this.scene.add(this.perspectiveCamera);
    // this.helper = new CameraHelper(this.perspectiveCamera);
    // this.scene.add(this.helper);

    const gui = new GUI();
    const folder = gui.addFolder('Camera Pos');

    folder.add(this.perspectiveCamera.position, 'x', -30, 30, 0.01);
    folder.add(this.perspectiveCamera.position, 'y', -30, 30, 0.01);
    folder.add(this.perspectiveCamera.position, 'z', -30, 30, 0.01);

    // const guiChangeHangler = () => {
    //   window.requestAnimationFrame(this.manager.update());
    // };

    // const lookAtVector = new Vector3(0, 0, 0);
    // folder
    //   .add(this.perspectiveCamera.position, 'x', -30, 30, 0.01)
    //   .onChange(() => {
    //     // guiChangeHangler();
    //     // this.perspectiveCamera.lookAt(lookAtVector)
    //   });
    // folder.add(this.perspectiveCamera.position, 'y', -30, 30, 0.01);
    // folder.add(this.perspectiveCamera.position, 'z', -30, 30, 0.01);
    // folder.open();

    // const folder2 = gui.addFolder('Camera Rot');

    // folder2.add(this.perspectiveCamera.rotation, 'x', -10, 10, 0.01);
    // folder2.add(this.perspectiveCamera.rotation, 'y', -10, 10, 0.01);
    // folder2.add(this.perspectiveCamera.rotation, 'z', -10, 10, 0.01);
    // folder2.open();
  }

  getTimeline() {
    this.timeline = gsap
      .timeline()
      .to(this.manager.world.enviroment.sunLight, { intensity: 0 })
      .to(
        this.perspectiveCamera.rotation,

        {
          x: 0,
          y: 0,
          z: -0.8,
          duration: 1,
          // onUpdate: () => {
          //   this.perspectiveCamera.updateProjectionMatrix();
          // },
        },
        '<'
      )

      .to(
        this.perspectiveCamera.position,
        {
          x: -2,
          y: 1,
          z: 3.5,
          duration: 1,
          // onUpdate: () => {
          //   this.perspectiveCamera.updateProjectionMatrix();
          // },
        },
        '<'
      )

      .to(
        this.perspectiveCamera.rotation,

        {
          x: 0,
          y: -1.05,
          z: -0.41,
          duration: 1,
          // onUpdate: () => {
          //   this.perspectiveCamera.updateProjectionMatrix();
          // },
        }
      )
      .to(
        this.manager.world.enviroment.sunLight.position,
        {
          x: 24,
          y: 4.8,
          z: 4,
        },
        '<'
      )
      .to(
        this.manager.world.enviroment.sunLightTarget.position,
        {
          x: -8.4,
          y: -3.5,
          z: -0.2,
        },
        '<'
      );
    return this.timeline;
  }

  getTimeline2() {
    this.timeline2 = gsap
      .timeline()
      .to(
        this.perspectiveCamera.position,

        { x: -4.85, y: 2.86, z: 5.78, duration: 2 }
      )
      .to(
        this.perspectiveCamera.rotation,

        { x: -1, y: -1, z: -1.58, duration: 2 },
        '<'
      )
      .to(this.manager.world.enviroment.sunLight, { intensity: 1 }, '<+0.5');

    animateText(this.timeline2, '.fourthTitle', '<+0.5', '<', '<+0.6');

    return this.timeline2;
  }

  createPerspectiveCameraMain() {
    this.perspectiveCameraMain = new PerspectiveCamera(
      35,
      this.sizes.aspect,
      0.1,
      200
    );
    this.scene.add(this.perspectiveCameraMain);
    this.perspectiveCameraMain.position.x = 0;
    this.perspectiveCameraMain.position.y = 55;
    this.perspectiveCameraMain.position.z = 60;

    // const size = 20;
    // const divisions = 20;

    // const gridHelper = new GridHelper(size, divisions);
    // gridHelper.position.y = -0.005;
    // this.scene.add(gridHelper);

    // const axesHelper = new AxesHelper(3);
    // axesHelper.position.y = -0.01;
    // this.scene.add(axesHelper);
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.perspectiveCamera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.enableZoom = false;
  }

  setUpFov() {
    if (window.matchMedia('(max-width: 991px)').matches) {
      if (this.fov !== this.fovMax) {
        this.fov = this.fovMax;
      }
    } else {
      if (this.fov !== this.fovMin) {
        this.fov = this.fovMin;
      }
    }
  }

  resize() {
    this.setUpFov();
    this.perspectiveCamera.fov = this.fov;
    this.perspectiveCamera.aspect = this.sizes.aspect;
    this.perspectiveCamera.updateProjectionMatrix();

    this.perspectiveCameraMain.aspect = this.sizes.aspect;
    this.perspectiveCameraMain.updateProjectionMatrix();
  }

  // update() {
  //   // this.controls.update();
  //   // this.helper.matrixWorldNeedsUpdate = true;
  //   // this.helper.update();
  //   // this.helper.position.copy(this.perspectiveCameraMain.position);
  // }
}
