import { Color, MeshStandardMaterial, Group } from 'three';
import gsap from 'gsap';
import GradientCircle from './GradientCircle';
import LinesAnimation from './LinesAnimation';
import ModelLines from '../../Manager/World/ModelLines';
import EdgeRim from '../../Manager/World/EdgeRim';
import ModelPieces from '../../Manager/World/ModelPieces';
import Stripe from '../../Manager/World/Stripe';

import * as dat from 'dat.gui';
import { animateText } from '../../Manager/Utils/animateText';
import FusedModel from '../../Manager/World/FusedModel';

export default class Model {
  constructor(manager) {
    this.manager = manager;
    this.scene = this.manager.scene;
    this.resources = this.manager.resources;
    this.model = this.resources.items.model;
    this.mainColor = new Color('rgb(200,200,200)');

    this.setModel();

    this.lines = new LinesAnimation(this.scene);
    this.gradientCircle = new GradientCircle(this.manager, this.lines, this);

    this.createTimeline();
  }

  setModel() {
    this.mainMaterial = new MeshStandardMaterial();
    this.rimRingGroup = new Group();
    this.modelGroup = new Group();
    this.modelInnerGroup = new Group();
    this.pieces = [];

    const actions = {
      Circle: (child) => {
        this.circle = child;
        this.setModelPart(child, 1);
      },
      CircleBottom: (child) => {
        this.circleBottom = child;
        this.setModelPart(child);
      },
      Strip: (child) => {
        this.stripeMesh = child;
        this.setModelPart(child);
      },
      LettersFill: (child) => {
        this.letters = child;
        this.setModelPart(child);
      },
      Letters: (child) => {
        this.lettersTop = child;
        this.setModelPart(child);
      },
      ring: (child) => {
        this.mLines = child;
      },
      rim: (child) => {
        this.edge = child;
      },
      rimInner: (child) => {
        this.edgeInner = child;
      },
      Piece: (child) => {
        this.pieces.push(child);
      },
      fused: (child) => {
        this.fused = child;
      },
    };

    this.model.scene.traverse((child) => {
      const action =
        actions[child.name] ||
        ((child) => {
          if (child.name.includes('Piece')) {
            this.pieces.push(child);
          }
        });
      action(child);
    });

    this.modelPieces = new ModelPieces(
      this.manager,
      this.pieces,
      this.modelGroup,
      this.mainColor
    );
    this.modelLines = new ModelLines(this.mLines, this.rimRingGroup);
    this.edgeRim = new EdgeRim(
      this.manager,
      this.edge,
      this.edgeInner,
      this.rimRingGroup,
      this.mainColor
    );

    this.stripe = new Stripe(this.manager, this.stripeMesh, this.modelGroup);
    this.fusedModel = new FusedModel(this.manager, this.fused);

    this.modelInnerGroup.add(this.circleBottom);
    this.modelInnerGroup.add(this.circle);
    this.modelInnerGroup.add(this.letters);
    this.modelInnerGroup.add(this.lettersTop);
    this.modelInnerGroup.add(this.rimRingGroup);
    this.modelInnerGroup.add(this.fused);
    this.modelGroup.add(this.modelInnerGroup);
    this.modelGroup.add(this.stripeMesh);

    // const gui = new dat.GUI();
    // var folder1 = gui.addFolder('Rotation');
    // folder1.add(this.modelGroup.rotation, 'x', -Math.PI * 2, Math.PI * 2, 0.01);
    // folder1.add(this.modelGroup.rotation, 'y', -Math.PI * 2, Math.PI * 2, 0.01);
    // folder1.add(this.modelGroup.rotation, 'z', -Math.PI * 2, Math.PI * 2, 0.01);

    // var folder2 = gui.addFolder('Position');
    // folder2.add(this.modelGroup.position, 'x', -10, 10, 0.01);
    // folder2.add(this.modelGroup.position, 'y', -10, 10, 0.01);
    // folder2.add(this.modelGroup.position, 'z', -10, 10, 0.01);

    this.scene.add(this.modelGroup);
  }

  setModelPart(part, startOp = 0, shade = false) {
    part.material = this.mainMaterial.clone();
    part.material.transparent = true;
    part.material.color = this.mainColor;

    part.material.opacity = startOp;
    part.material.metalness = 0;
    part.material.roughness = 0.1;

    part.material.flatShading = shade;
    part.material.needsUpdate = true;

    part.receiveShadow = true;
    part.castShadow = true;
  }

  createTimeline() {
    this.timeline = gsap
      .timeline()

      .to(this.circle.material, { opacity: 0.3 })
      .to({}, { duration: 0.1 })
      .to(this.modelGroup.scale, { x: 0.8, y: 0.8, duration: 0.8 }, '<')
      .to(this.modelGroup.scale, { x: 1.2, y: 1.2, duration: 0.2 })
      .to(this.circle.material, { opacity: 1 }, '<')
      .to(this.modelGroup.rotation, { z: 0.6, duration: 0.4 }, '<')
      .to(
        this.modelGroup.position,
        { z: 12, x: -0.5, duration: 0.2, ease: 'power3.in' },
        '<'
      );

    this.timeline2 = gsap
      .timeline()
      .set(this.circle.material, { opacity: 0 })
      .set(this.modelGroup.rotation, { z: 0 })
      .set(this.modelGroup.position, { x: 0.3, y: 0.08 })
      .set(this.lettersTop.material, { opacity: 1 })
      .to(this.modelGroup.scale, { x: 1.2, y: 1.2, duration: 0.2 })
      .to(
        this.modelGroup.position,
        { x: 0, z: 0.5, duration: 0.4, ease: 'power3.out' },
        '<+0.2'
      )
      .to(this.lettersTop.material, { opacity: 0.3 });

    animateText(this.timeline2, '.secondTitle');

    this.timeline2.to(this.lettersTop.material, { opacity: 1 }, '<+0.2');

    this.timeline3 = gsap
      .timeline()
      .to(this.circle.position, { z: 0.2, duration: 0.4 })
      .to(this.letters.material, { opacity: 0, duration: 0.4 }, '<')
      .set(this.fused.material, { depthWrite: true })
      .set(this.fused.material, { opacity: 1 })
      .set(this.circle.material, { opacity: 0 }, "<")
      .set(this.letters.material, { opacity: 0 }, "<")
      .set(this.lettersTop.material, { opacity: 0 }, "<")
      .to(this.modelGroup.rotation, { x: -1, y: -1.9, z: 4.66, duration: 2 })
      .to(this.modelGroup.position, { x: -2.09, duration: 3 }, '<')
      .to(this.modelInnerGroup.rotation, { z: 1.6, duration: 6 });
  }
}
