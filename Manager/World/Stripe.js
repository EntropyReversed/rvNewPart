import { Color } from 'three';
import gsap from 'gsap';

import * as dat from 'dat.gui';
import { shaderStripe } from '../../Manager/Shaders/ShaderStripe';
import Paint from '../../Manager/World/Paint';

export default class Stripe {
  constructor(manager, stripe, group) {
    this.manager = manager;
    this.stripe = stripe;
    this.group = group;
    this.paint = new Paint(this.manager, this.group);
    this.setUp();
  }

  setUp() {
    this.stripe.rotation.z = 0.1;
    const uniforms = {
      diffuse: { value: new Color('#C0C0C0') },
      progress: { value: -0.05 },
    };

    this.material = shaderStripe(uniforms);
    this.material.depthWrite = false;

    this.stripe.material = this.material;
    // const gui = new dat.GUI();
    // var folder1 = gui.addFolder('stripe');
    // folder1.add(this.material.uniforms.progress, 'value', -0.1, 1, 0.001);
    // folder1.add(this.paint.material.uniforms.progress, 'value', -0.1, 1, 0.001);
    console.log(this.manager.world.model)
  }

  getTimeline() {
    this.timeline = gsap
      .timeline()
      .set(this.material, { depthWrite: true })
      // .set()
      .to(
        this.paint.material.uniforms.progress,
        { value: 1, duration: 2 },
        '<+=0.1'
      )
      .to(
        this.material.uniforms.progress,
        { value: 0.5, duration: 6 },
        '-=0.55'
      );
    return this.timeline;
  }

  updateTime() {
    this.paint.update();
  }
}
