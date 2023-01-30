import { Color, Clock } from 'three';
import gsap from 'gsap';

import * as dat from 'dat.gui';
import { shaderStripe } from '../../Manager/Shaders/ShaderStripe';
import { animateText } from '../../Manager/Utils/animateText';

export default class Stripe {
  constructor(manager, stripe, group) {
    this.manager = manager;
    this.stripe = stripe;
    this.group = group;
    console.log(manager.world.enviroment.sunLight);
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
      amplitude: { value: 0.1 },
      speed: { value: 0.2 },
      frequency: { value: 3.14 },
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
      .set(this.stripe.material, { depthWrite: true })
      .to(
        this.material.uniforms.progress,
        {
          value: 0.2,
          duration: 3,
          onStart: () => {
            if (this.manager.pause) {
              this.manager.pause = false;
            }
          },
          onReverseComplete: () => {
            if (!this.manager.pause) {
              this.manager.pause = true;
            }
          },
        },
        '<'
      )
      .to(this.material.uniforms.progress, {
        value: -0.05,
        duration: 3,
      })
      .to({}, { duration: 1 });
    animateText(this.timeline, '.seventhTitle');

    this.timeline
      .to(
        this.manager.camera.perspectiveCamera.position,
        {
          x: -10,
          y: 5.7,
          z: 7.5,
          delay: 1,
          onComplete: () => {
            if (!this.manager.pause) {
              this.manager.pause = true;
            }
          },
          onReverseComplete: () => {
            if (this.manager.pause) {
              this.manager.pause = false;
            }
          },
        },
        '<'
      )

      // .to(this.manager.world.enviroment.sunLight, { intensity: 0 }, '<')
      // .to(this.manager.world.enviroment.spotLight, { intensity: 0 }, '<')
      // .to(this.manager.world.enviroment.ambientlight, { intensity: 0 }, '<')
      .to('.fadeScreen', { opacity: 1 }, '-=0.2');
    // .fromTo(
    // 	'.titleLoop',
    // 	{ scale: 0.1, yPercent: -150, opacity: 0 },
    // 	{
    // 		keyframes: [
    // 			{ scale: 0.1, yPercent: -150, opacity: 0 },
    // 			{ scale: 1, yPercent: -50, opacity: 1 },
    // 			{ scale: 0.1, yPercent: 100, opacity: 0 },
    // 		],
    // 		duration: 4,
    // 		stagger: 1,
    // 	},
    // 	'-=1.6',
    // )
    document.querySelectorAll('.titleLoop').forEach((title) => {
      this.timeline
        .fromTo(
          title,
          { scale: 6, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            willChange: 'transform',
            duration: 1,
            onComplete: () => {
              title.style.willChange = 'auto';
            },
          },
          '-=0.5'
        )
        .to(title, { color: 'gray' });
    });

    this.timeline
      .to('.titleLoop', { color: 'white' })
      .to({}, { duration: 0.5 });

    // .fromTo('.titleLoop', {scale: 6, opacity: 0}, {scale: 1, opacity: 1, stagger: 0.4})

    // .to('.fadeScreen', { opacity: 0 })
    // .to(
    // 	this.manager.camera.perspectiveCamera.position,
    // 	{ x: -4.85, y: 2.86, z: 5.78 },
    // 	'<-=0.2',
    // )
    // .to(this.manager.world.enviroment.sunLight, { intensity: 1 }, '<')
    // .to(this.manager.world.enviroment.spotLight, { intensity: 1.5 }, '<')
    // .to(this.manager.world.enviroment.ambientlight, { intensity: 1.5 }, '<')
    // .to({}, { duration: 1 });

    return this.timeline;
  }

  updateTime() {
    this.material.uniforms.time.value = this.clock.getElapsedTime();
  }
}
