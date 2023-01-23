import {
  UniformsUtils,
  Mesh,
  Clock,
  Color,
  PlaneGeometry,
  ShaderMaterial,
} from 'three';
import ShaderGradient from './../Shaders/ShaderGradient';
import gsap from 'gsap';
import { animateText } from '../../Manager/Utils/animateText';

export default class GradientCircle {
  constructor(manager, lines, model) {
    this.manager = manager;
    this.lines = lines;
    this.camera = this.manager.camera.perspectiveCamera;
    this.scene = this.manager.scene;
    this.model = model;
    this.texture = this.manager.world.textures.gradientTexture;
    this.lettersTex = this.manager.world.textures.lettersTexture;
    this.setCircleGrad();
  }

  setCircleGrad() {
    this.circle = new Mesh();
    this.geometry = new PlaneGeometry(4.25, 4.25);

    this.clock = new Clock();

    this.uniforms = UniformsUtils.merge([
      { u_texture: { value: null } },
      { u_letters_texture: { value: null } },
      { u_time: { value: this.clock.getElapsedTime() } },
      { lettersV: { value: 0 } },

      { progress: { value: -0.1 } },
    ]);

    this.materialGrad = new ShaderMaterial({
      uniforms: this.uniforms,
      ...ShaderGradient,
      transparent: true,
    });
    this.materialGrad.depthWrite = false;

    // THREE.UniformsUtils.merge() calls THREE.clone() on each uniform.
    // Texture needs to be assigned here so it's not cloned
    this.materialGrad.uniforms.u_texture.value = this.texture;

    this.lettersTex.anisotropy =
      this.manager.renderer.renderer.capabilities.getMaxAnisotropy();

    this.materialGrad.uniforms.u_letters_texture.value = this.lettersTex;
    this.circle.geometry = this.geometry;
    this.circle.material = this.materialGrad;
    this.circle.position.z = 0.001;

    this.lettersStartZPos = 0.002;
    this.model.lettersTop.position.z = this.lettersStartZPos;
    this.model.modelGroup.add(this.circle);
  }

  getTimeline() {
    this.timeline = gsap.timeline();
    const c = new Color('rgb(0,0,0)');
    this.timeline
      .set(this.model.lettersTop.position, { z: this.lettersStartZPos })
      .fromTo(
        this.circle.scale,
        { x: 0, y: 0 },
        { x: 3.1, y: 3.1, duration: 0.8 }
      )
      .set(this.lines.circleMain.circle, { visible: false })

      .to(this.model.modelGroup.rotation, { x: -1, z: -0.7, duration: 1 })
      .to(this.model.modelGroup.position, { z: 4, duration: 0.8 }, '<')

      .to(this.circle.scale, { x: 1, y: 1 }, '<+0.3')

      .to(this.circle.material.uniforms.lettersV, {
        value: 1,
        duration: 0.05,
      })
      .set(this.model.circle.material, { metalness: 0.97 })
      .set(this.model.letters.material, { metalness: 0.97 })
      .set(this.model.lettersTop.material, {
        color: c,
      })
      .set(this.model.lettersTop.position, { z: 0 })

      .set(this.model.circle.material, { opacity: 1 })
      .set(this.model.letters.material, { opacity: 1 })
      .set(this.model.lettersTop.material, { opacity: 1 })

      .to(
        this.circle.material.uniforms.progress,
        {
          value: 1.1,
          duration: 0.8,
          ease: 'power3.out',
          // onStart: () => {
          //   if (this.manager.pause) {
          //     this.manager.pause = false;
          //   }
          // },
          // onReverseComplete: () => {
          //   if (!this.manager.pause) {
          //     this.manager.pause = true;
          //   }
          // },
          // onComplete: () => {
          //   if (!this.manager.pause) {
          //     this.manager.pause = true;
          //   }
          // },
        },
        '<'
      )
      .to(
        this.model.lettersTop.material,
        { metalness: 0.97, duration: 0.15 },
        '<+=0.1'
      )
      .to(
        c,
        {
          r: 200 / 255,
          g: 200 / 255,
          b: 200 / 255,
          duration: 0.15,
        },
        '<+=0.1'
      )
      .to(
        this.model.letters.position,
        {
          z: -0.18,
          duration: 0.1,
          // onReverseComplete: () => {
          //   if (this.manager.pause) {
          //     this.manager.pause = false;
          //   }
          // },
        },
        '<+=0.2'
      );

    animateText(this.timeline, '.thirdTitle', '<', '<', '<+0.3');

    this.timeline
      .to(this.model.lettersTop.position, { z: 0.2, duration: 0.2 }, '-=0.3')
      .to(this.model.lettersTop.scale, { z: 1.9, duration: 0.2 }, '<');

    return this.timeline;
  }

  updateTime() {
    this.materialGrad.uniforms.u_time.value = this.clock.getElapsedTime();
  }
}
