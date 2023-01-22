export default class FusedModel {
  constructor(manager, model) {
    this.manager = manager;
    this.model = model;

    this.setUp()
  }

  setUp() {
    this.model.children.forEach((c) => {
      c.material.metalness = 0.97;
      c.material.roughness = 0.1;
      c.material.transparent = true;
      c.material.opacity = 0;

      c.receiveShadow = false;
      c.castShadow = false;
      c.material.depthWrite = false;
      
      c.material.needsUpdate = true;
      // c.visible = false;
    });
  }
}
