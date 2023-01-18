import { MeshStandardMaterial, Color } from 'three';
import gsap from 'gsap';

const linesData = [
  ['red', '', 0.18],
  ['blue', '<', 0.67],
  ['green', '<', 0.63],
  ['purple', '<', 0.85],
  ['teal', '<', 0.46],
  ['blue', '<', 0.7],
  ['purple', '<', 0.98],
  ['red', '<', 0.57],
  ['crimson', '<', 0.14],
  ['orange', '<', 0.1],
  ['purple', '<', 0.6],
  ['crimson', '<', 0.43],
  ['teal', '<', 0.48],
];

const modelLineMaterial = new MeshStandardMaterial();

export default class ModelLines {
  constructor(line, group) {
    this.line = line;
    this.group = group;
    this.posOffsetZ = 0.012;
    this.rotOffset = 0.01;
    this.setUp();
  }

  setUp() {
    this.lines = [];
    for (let i = 0; i < linesData.length; i++) {
      const mesh = this.line.clone();
      mesh.material = modelLineMaterial.clone();
      mesh.material.color = new Color(linesData[i][0]);
      mesh.material.depthWrite = false;
      mesh.material.transparent = true;
      mesh.material.needsUpdate = true;
      mesh.visible = true;
      // mesh.material.wireframe = true;

      mesh.position.z = i * -this.posOffsetZ - 0.01;
      mesh.rotation.z = 1 + linesData[i][2];
      // mesh.layers.enable(1);

      this.lines.push(mesh);
      this.group.add(mesh);
    }
  }

  getTimeline() {
    this.timeline = gsap.timeline();

    this.lines.forEach((line) => {
      this.timeline.set(line, { visible: true });
    });

    this.lines.forEach((line, index) => {
      const dur = Math.random() * 2 + 2;
      // console.log(index, dur);
      this.timeline
        .to(line.rotation, { z: -2.5, duration: dur }, linesData[index][1])
        .fromTo(line.material, { opacity: 0 }, { opacity: 1 }, '<');
    });

    this.lines.forEach((line) => {
      this.timeline.set(line, { visible: false }, '-=0.5');
    });

    return this.timeline;
  }
}
