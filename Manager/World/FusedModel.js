import { Color } from 'three';
import { shaderFused } from '../../Manager/Shaders/ShaderFused';
import * as dat from 'dat.gui';

export default class FusedModel {
  constructor(manager, model) {
    this.manager = manager;
    this.model = model;
    this.setUp();
  }

  setUp() {
    const uniforms = {
      diffuse: { value: new Color('rgb(255,255,255)') },
      roughness: { value: 0.3 },
      metalness: { value: 0.97 },
      progress: { value: -0.05 },
    };

    this.material = shaderFused(uniforms);
    this.material.depthWrite = false;

    this.model.material = this.material;
    this.model.renderOrder = 1;

    // const gui = new dat.GUI();
    // var folder1 = gui.addFolder('stripe');
    // folder1.add(this.material.uniforms.progress, 'value', -0.1, 1, 0.001);
    // folder1.add(this.model.position, 'z', -1, 1, 0.001);

    // this.model.material.metalness = 0.97;
    // this.model.material.roughness = 0.1;
    // this.model.material.transparent = true;
    // this.model.material.opacity = 0;

    // this.model.receiveShadow = false;
    // this.model.castShadow = false;
    // this.model.material.depthWrite = false;

    // this.model.material.needsUpdate = true;
  }
}
