import { Scene } from 'three';
import Sizes from './Utils/Sizes';
import Camera from './Camera';
import Renderer from './Renderer';
import Resources from './Utils/Resources';
import World from './World/World';
import assets from './Utils/assets';
import gsap from 'gsap';
import { RealVhCssVar } from '../Manager/Utils/RealVhCssVar';
import Stats from 'three/addons/libs/stats.module.js';
import * as THREE from 'three';

export default class Manager {
  constructor(parent) {
    this.parent = parent;
    this.canvas = this.parent.querySelector('canvas');
    this.scene = new Scene();
    this.sizes = new Sizes();
    this.camera = new Camera(this);
    this.renderer = new Renderer(this);
    this.resources = new Resources(this, assets);
    this.masterTimeline = gsap.timeline();
    this.world = new World(this);

    this.pause = true;

    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);

    document.addEventListener('DOMContentLoaded', () => {
      new RealVhCssVar();
    });

    document.body.onmousedown = function (e) {
      if (e.button === 1) return false;
    };
    window.addEventListener('resize', () => {
      this.resize();
    });
  }

  resize() {
    this.sizes.resize();
    this.camera.resize();
    this.renderer.resize();
    if (this.pause) {
      window.requestAnimationFrame(() => this.update());
    }
  }

  update() {
    this.renderer.update();
    this.stats.update();

    this.world.model.gradientCircle.updateTime();
    this.world.model.stripe.updateTime();

    if (this.pause) return;
    window.requestAnimationFrame(() => this.update());
  }
}
