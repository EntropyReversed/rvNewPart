import { Mesh, PlaneGeometry, Clock, Color, Euler } from 'three';
import * as dat from 'dat.gui';
import { shaderPaint } from '../../Manager/Shaders/ShaderPaint';

export default class Paint {
  constructor(manager, group) {
    this.manager = manager;
    this.group = group;

    this.clock = new Clock();
    this.planeGeo = new PlaneGeometry(2, 4, 40, 80);

    const uniforms = {
      diffuse: { value: new Color('rgb(80,80,80)') },
      roughness: { value: 0.05 },
      amplitude: { value: 0.4 },
      speed: { value: 0.15 },
      frequency: { value: 0.6 },
      time: { value: 0 },
      progress: { value: 0 },
    };

    this.material = shaderPaint(uniforms);
    this.material.depthWrite = false;

    this.plane = new Mesh(this.planeGeo, this.material);

    this.plane.position.set(0.137, 2.348, 0.11);
    this.plane.rotation.setFromVector3(new Euler(-1.573, -0.49, -4.708));
    this.plane.scale.set(0.099, 0.2, 0.2);

    // const gui = new dat.GUI();
    // var folder1 = gui.addFolder('paint');
    // folder1.add(this.plane.rotation, 'x', -6, 6, 0.001);
    // folder1.add(this.plane.rotation, 'y', -6, 6, 0.001);
    // folder1.add(this.plane.rotation, 'z', -6, 6, 0.001);
    // folder1.add(this.plane.position, 'x', -12, 12, 0.001);
    // folder1.add(this.plane.position, 'y', -12, 12, 0.001);
    // folder1.add(this.plane.position, 'z', -12, 12, 0.001);
    // var folder2 = gui.addFolder('rot');
    // folder2.add(this.plane.rotation, 'x', -Math.PI * 2, Math.PI * 2, 0.01);
    // folder2.add(this.plane.rotation, 'y', -Math.PI * 2, Math.PI * 2, 0.01);
    // folder2.add(this.plane.rotation, 'z', -Math.PI * 2, Math.PI * 2, 0.01);

    // var folder3 = gui.addFolder('scale');
    // folder3.add(this.plane.scale, 'x', 0, 2, 0.01);
    // folder3.add(this.plane.scale, 'y', 0, 2, 0.01);
    // folder3.add(this.plane.scale, 'z', 0, 2, 0.01);

    // var folder3 = gui.addFolder('position');
    // folder3.add(this.plane.position, 'x', -4, 4, 0.01);
    // folder3.add(this.plane.position, 'y', -4, 4, 0.01);
    // folder3.add(this.plane.position, 'z', -4, 4, 0.01);

    this.group.add(this.plane);
  }

  update() {
    this.material.uniforms.time.value = this.clock.getElapsedTime();
  }
}
