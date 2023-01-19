import { UniformsUtils, Clock, ShaderMaterial } from 'three';
import gsap from 'gsap';
import ShaderStripe from './../Shaders/ShaderStripe';

import * as dat from 'dat.gui';

export default class Stripe {
  constructor(manager, stripe) {
    this.manager = manager;
    this.stripe = stripe;
    this.texture = this.manager.world.textures.gradientTexture;
    this.setUp();
  }

  setUp() {
    this.clock = new Clock();

    this.uniforms = UniformsUtils.merge([
      { u_texture: { value: null } },
      { opacity: { value: 1 } },
      { progress: { value: 0 } },
    ]);

    this.material = new ShaderMaterial({
      uniforms: this.uniforms,
      ...ShaderStripe,
      transparent: true,
    });
    this.material.depthWrite = false;

    this.material.uniforms.u_texture.value = this.texture;

    this.stripe.material = this.material;

    const gui = new dat.GUI();
    var folder1 = gui.addFolder('progress');
    folder1.add(this.material.uniforms.progress, 'value', 0, 1, 0.01);
  }

  getTimeline() {
    this.timeline = gsap
      .timeline()
      .set(this.stripe.material, { depthWrite: true })
      .set(this.material.uniforms.opacity, { value: 0.4 })
      .to(
        this.material.uniforms.progress,
        { value: 1, duration: 2 },
        '<+=0.1'
      )
      .to(this.material.uniforms.opacity, { value: 0, duration: 1 }, '<+=1');
    return this.timeline;
  }
}
