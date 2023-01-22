import {
  Mesh,
  LineBasicMaterial,
  ShaderMaterial,
  PlaneGeometry,
  UniformsUtils,
} from 'three';
import ShaderCircles from './../Shaders/ShaderCircles.js';

export default class AnimatableCircle {
  constructor(r, w, pos, op) {
    this.radius = r + w;
    this.strokeW = w;
    this.pos = pos;
    this.opacity = op;
    this.setUpShader();
    this.circle = this.createCircle();
  }

  setUpShader() {
    this.uniforms = UniformsUtils.merge([
      { opacity: { value: this.opacity } },
      { strokeWidth: { value: this.strokeW } },
      { progress: { value: 0 } },
      { mainCircle: { value: false } },
    ]);

    this.circleMaterial = new ShaderMaterial({
      uniforms: this.uniforms,
      ...ShaderCircles,
      transparent: true,
      depthWrite: false,
    });
  }

  createCircle() {
    const geometry = new PlaneGeometry(this.radius * 2, this.radius * 2);

    const mesh = new Mesh(geometry, this.circleMaterial);

    mesh.userData = {
      radius: this.radius,
      width: this.radius + this.strokeW,
    };
    mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    mesh.scale.x = -1;
    mesh.rotation.z = Math.PI * 1.5;
    return mesh;
  }
}
