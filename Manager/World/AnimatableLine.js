import { Vector3, Mesh, LineBasicMaterial, PlaneGeometry } from 'three';

const lineMaterial = new LineBasicMaterial();

export default class AnimatableLine {
  constructor(w, h, pos, ang, org, c) {
    this.w = w;
    this.h = h;
    this.pos = pos;
    this.ang = ang;
    this.org = org;
    this.c = c;
    this.line = this.createLine();
  }

  createLine() {
    let offset, position;
    if (this.org === 'top') {
      offset = new Vector3(-this.w * 0.5, 0, 0);
      position = new Vector3(this.pos.x, this.pos.y + this.w * 0.5, this.pos.z);
    }
    if (this.org === 'btm') {
      offset = new Vector3(this.w * 0.5, 0, 0);
      position = new Vector3(
        this.pos.x,
        (this.pos.y + this.w * 0.5) * -1,
        this.pos.z
      );
    }
    if (this.org === 'left') {
      offset = new Vector3(this.w * 0.5, 0, 0);
      position = new Vector3(this.pos.x - this.w * 0.5, this.pos.y, this.pos.z);
    }
    if (this.org === 'right') {
      offset = new Vector3(-this.w * 0.5, 0, 0);
      position = new Vector3(this.pos.x + this.w * 0.5, this.pos.y, this.pos.z);
    }
    if (this.org === '') {
      offset = new Vector3(0, 0, 0);
      position = new Vector3(this.pos.x, this.pos.y, this.pos.z);
    }

    const geometry = new PlaneGeometry(this.w, this.h);
    geometry.translate(...offset);
    const material = lineMaterial.clone();
    material.color = this.c;
    const mesh = new Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.rotation.set(0, 0, this.ang);
    return mesh;
  }
}
