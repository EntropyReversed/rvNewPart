import { UniformsUtils, Clock, ShaderMaterial } from 'three';
import gsap from 'gsap';
import ShaderStripe from './../Shaders/ShaderStripe';

import * as dat from 'dat.gui';

export default class Stripe {
  constructor(manager, stripe) {
    this.manager = manager;
    this.stripe = stripe;
    this.setUp();
  }

  setUp() {
    this.clock = new Clock();

    this.uniforms = UniformsUtils.merge([
      { uOpacity: { value: 1 } },
      { uProgress: { value: 0 } },
      { uTime: { value: 0 } }
    ]);

    this.material = new ShaderMaterial({
      uniforms: this.uniforms,
      ...ShaderStripe,
      transparent: true,
    });
    this.material.depthWrite = false;

    this.stripe.material = this.material;

    // const gui = new dat.GUI();
    // var folder1 = gui.addFolder('progress');
    // folder1.add(this.material.uniforms.progress, 'value', 0, 1, 0.01);
  }

  getTimeline() {
    this.timeline = gsap
      .timeline()
      .set(this.stripe.material, { depthWrite: true })
      .set(this.material.uniforms.opacity, { value: 1 })
      .to(
        this.material.uniforms.progress,
        { value: 0.1, duration: 2 },
        '<+=0.1'
      )
      .to(this.material.uniforms.opacity, { value: 0, duration: 1 }, '<+=1');
    return this.timeline;
  }

  updateTime() {
    this.material.uniforms.uTime.value = this.clock.getElapsedTime();
  }
}
