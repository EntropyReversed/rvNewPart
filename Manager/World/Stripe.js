import { Color, Clock } from 'three';
import gsap from 'gsap';

import * as dat from 'dat.gui';
import { shaderStripe } from '../../Manager/Shaders/ShaderStripe';
import Paint from '../../Manager/World/Paint';

export default class Stripe {
  constructor(manager, stripe, group) {
    this.manager = manager;
    this.stripe = stripe;
    this.group = group;
    console.log(group);
    // this.paint = new Paint(this.manager, this.group);
    this.setUp();
  }

  setUp() {
    this.clock = new Clock();
    this.stripe.rotation.z = 0.037;
    this.stripe.scale.set(1.001, 1.001, 0.98);
    const uniforms = {
      diffuse: { value: new Color('rgb(255,255,255)') },
      roughness: { value: 0.3 },
      metalness: { value: 0.9 },
      amplitude: { value: 0.06 },
      speed: { value: 0.2 },
      frequency: { value: 4 },
      offset: { value: 0.01 },
      time: { value: 0 },
      progress: { value: -0.05 },
    };

    // const uniforms = {
    //   diffuse: { value: new Color('rgb(255,255,255)') },
    //   progress: { value: -0.05 },
    //   roughness: { value: 0.3 },
    //   metalness: { value: 0.97 },
    // };

    this.material = shaderStripe(uniforms);
    this.material.depthWrite = false;
    this.stripe.visible = false;

    this.stripe.material = this.material;
    // const gui = new dat.GUI();
    // var folder1 = gui.addFolder('stripe');
    // folder1.add(this.stripe.rotation, 'z', -4, 4, 0.001);
    // folder1.add(this.material.uniforms.progress, 'value', -0.1, 1, 0.001);
    // folder1.add(this.paint.material.uniforms.progress, 'value', -0.1, 1, 0.001);
  }

  getTimeline() {
    this.timeline = gsap
      .timeline()
      .set(this.stripe, { visible: true })
      // .set()
      // .to(
      //   this.paint.material.uniforms.progress,
      //   { value: 1, duration: 2 },
      //   '<+=0.1'
      // )
      .to(this.material.uniforms.progress, { value: 0.5, duration: 6 });
    // .to(
    //   this.paint.material.uniforms.progress,
    //   { value: 0, duration: 2 },
    //   '+=1.2'
    // );
    return this.timeline;
  }

  updateTime() {
    // this.paint.update();
    this.material.uniforms.time.value = this.clock.getElapsedTime();
  }
}
