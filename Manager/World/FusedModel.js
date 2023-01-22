export default class FusedModel {
  constructor(manager, model) {
    this.manager = manager;
    this.model = model;
    this.setUp();
    console.log(this.manager.world);
  }

  setUp() {
    this.model.material.metalness = 0.97;
    this.model.material.roughness = 0.1;
    this.model.material.transparent = true;
    this.model.material.opacity = 0;

    this.model.receiveShadow = false;
    this.model.castShadow = false;
    this.model.material.depthWrite = false;

    this.model.material.needsUpdate = true;

  }
}
