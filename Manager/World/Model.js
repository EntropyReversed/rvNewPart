import { Color, MeshStandardMaterial, Group } from 'three';
import gsap from 'gsap';
import GradientCircle from './GradientCircle';
import LinesAnimation from './LinesAnimation';
import ModelLines from '../../Manager/World/ModelLines';
import EdgeRim from '../../Manager/World/EdgeRim';
import ModelPieces from '../../Manager/World/ModelPieces';
import Stripe from '../../Manager/World/Stripe';

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
    this.pieces = [];

    this.model.scene.traverse((child) => {
      switch (true) {
        case child.name === 'Circle':
          this.circle = child;
          this.setModelPart(child, 1);
          break;
        case child.name === 'CircleBottom':
          this.circleBottom = child;
          this.setModelPart(child);
          break;
        case child.name === 'Strip':
          this.stripeMesh = child;
          this.setModelPart(child);
          break;
        case child.name === 'LettersFill':
          this.letters = child;
          this.setModelPart(child);
          break;
        case child.name === 'Letters':
          this.lettersTop = child;
          this.setModelPart(child);
          break;
        case child.name === 'ring':
          this.mLines = child;
          break;
        case child.name === 'rim':
          this.edge = child;
          break;
        case child.name === 'rimInner':
          this.edgeInner = child;
          break;
        case child.name.includes('Piece'):
          this.pieces.push(child);
          break;
      }
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

    this.stripe = new Stripe(this.manager, this.stripeMesh);

    this.modelGroup.add(this.stripeMesh);
    this.modelGroup.add(this.circleBottom);
    this.modelGroup.add(this.circle);
    this.modelGroup.add(this.letters);
    this.modelGroup.add(this.lettersTop);
    this.modelGroup.add(this.rimRingGroup);

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
      .to(this.lettersTop.material, { opacity: 0.3 })
      .fromTo(
        '.secondTitle',
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: 'power3.out' },
        '<'
      )
      .fromTo(
        '.secondTitle',
        { scale: 2 },
        { scale: 1, duration: 0.2, ease: 'power3.out' },
        '<'
      )
      .to({}, { duration: 0.05 })
      .to('.secondTitle', { opacity: 0 }, '<+0.5')
      .to(this.lettersTop.material, { opacity: 1 }, '<+0.2');

    this.timeline3 = gsap
      .timeline()
      .to(this.modelGroup.rotation, { x: 0, y: 0 });
  }
}
