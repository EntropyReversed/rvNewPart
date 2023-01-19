import { MeshStandardMaterial } from 'three';
import gsap from 'gsap';
import { animateText } from '../../Manager/Utils/animateText';

export default class ModelPieces {
  constructor(manager, pieces, group, color) {
    this.manager = manager;
    this.scene = this.manager.scene;
    this.pieces = pieces;
    this.group = group;
    this.mainColor = color;
    this.material = new MeshStandardMaterial();

    this.setUpPieces();
  }

  setUpPieces() {
    this.pieces.forEach((piece) => {
      this.setModelPart(piece, 1);
      piece.position.z = -0.01;
      piece.scale.z = 0;
      this.group.add(piece);
    });
  }

  setModelPart(part, startOp = 0, shade = false) {
    part.material = this.material.clone();
    part.visible = false;
    part.material.transparent = true;
    part.material.color = this.mainColor;

    part.material.opacity = startOp;
    part.material.metalness = 0.97;
    part.material.roughness = 0.1;

    part.material.flatShading = shade;
    part.material.needsUpdate = true;

    part.receiveShadow = true;
    part.castShadow = true;
  }

  getTimeline() {
    this.timeline = gsap.timeline();
    this.pieces.forEach((piece) => {
      this.timeline.set(piece, { visible: true });
    });
    this.timeline.to(this.manager.world.model.letters.position, {
      z: 0,
      duration: 0.4,
    });

    const pieceDuration = 6;
    let maxDelay = 0;
    this.pieces.forEach((piece) => {
      const delay = Math.random() * 0.02;
      if (delay > maxDelay) {
        maxDelay = delay;
      }
      this.timeline.to(
        piece.scale,
        {
          keyframes: [
            { z: 1 },
            { z: 0.5 },
            { z: 1.3 },
            { z: 0.4 },
            { z: 1.4 },
            { z: 0.7 },
            // { z: 1.2 },
            // { z: 0.6 },
            { z: 1 },
            { z: 0 },
          ],
          // ease: 'power1.inOut',
          duration: pieceDuration,
          delay: delay,
        },
        '<'
      );
    });

    this.timeline
      .to(
        this.manager.world.model.modelGroup.rotation,
        { z: Math.PI * 1.1, duration: pieceDuration + maxDelay },
        '<-=0.4'
      )
      .to(
        this.manager.world.model.circle.position,
        {
          z: 0.195,
          duration: 2,
        },
        '-=2'
      )
      .to(
        this.manager.world.model.modelGroup.position,
        {
          x: -0.3,
          duration: 4,
        },
        '<-=2'
      )
      .to(
        this.manager.world.model.modelGroup.rotation,
        {
          y: 0.3,
          duration: 4,
        },
        '<'
      );

    animateText(this.timeline, '.fifthTitle', '-=0.5', '<');

    this.pieces.forEach((piece) => {
      this.timeline.set(piece, { visible: false });
    });

    return this.timeline;
  }
}
