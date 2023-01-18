import { UniformsUtils, Clock, ShaderMaterial } from 'three';
import gsap from 'gsap';
import ShaderStripe from './../Shaders/ShaderStripe';

export default class Stripe {
  constructor(manager, stripe) {
    this.manager = manager;
    this.stripe = stripe;

    this.setUp();
  }

  setUp() {
    this.clock = new Clock();

    this.uniforms = UniformsUtils.merge([
      { u_texture: { value: null } },
      { opacity: { value: 0 } },
      { progress: { value: 0.34 } },
    ]);

    this.material = new ShaderMaterial({
      uniforms: this.uniforms,
      ...ShaderStripe,
      transparent: true,
    });
    this.material.depthWrite = false;

    this.stripe.material = this.material;
  }

  getTimeline() {
    this.timeline = gsap
      .timeline()
      .set(this.stripe.material, { depthWrite: true })
      .fromTo(
        this.material.uniforms.opacity,
        { value: 0 },
        { value: 1, duration: 0.1 }
      )
      .to(
        this.material.uniforms.progress,
        { value: -0.2, duration: 1.4 },
        '<+=0.1'
      );
    return this.timeline;
  }
}
