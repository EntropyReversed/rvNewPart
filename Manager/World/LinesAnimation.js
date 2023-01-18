import {
  Vector3,
  Color,
  Mesh,
  Group,
  LineBasicMaterial,
  ShaderMaterial,
  PlaneGeometry,
  UniformsUtils,
} from 'three';
import gsap from 'gsap';
import ShaderCircles from './../Shaders/ShaderCircles.js';

const lineMaterial = new LineBasicMaterial();

class AnimatableCircle {
  constructor(r, w, pos, op) {
    this.radius = r + w;
    this.strokeW = w;
    this.pos = pos;
    this.opacity = op;
    this.setUpShader();
    this.circle = this.createCircle();
  }

  setUpShader() {
    this.uniforms = UniformsUtils.merge([
      { opacity: { value: this.opacity } },
      { strokeWidth: { value: this.strokeW } },
      { progress: { value: 0 } },
      { mainCircle: { value: false } },
    ]);

    this.circleMaterial = new ShaderMaterial({
      uniforms: this.uniforms,
      ...ShaderCircles,
      transparent: true,
      depthWrite: false,
    });
  }

  createCircle() {
    const geometry = new PlaneGeometry(this.radius * 2, this.radius * 2);

    const mesh = new Mesh(geometry, this.circleMaterial);

    mesh.userData = {
      radius: this.radius,
      width: this.radius + this.strokeW,
    };
    mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    mesh.scale.x = -1;
    mesh.rotation.z = Math.PI * 1.5;
    return mesh;
  }
}

class AnimatableLine {
  constructor(w, h, pos, ang, org, c) {
    this.w = w;
    this.h = h;
    this.pos = pos;
    this.ang = ang;
    this.org = org;
    this.c = c;
    this.line = this.createLine();
  }

  createLine() {
    let offset, position;
    if (this.org === 'top') {
      offset = new Vector3(-this.w * 0.5, 0, 0);
      position = new Vector3(this.pos.x, this.pos.y + this.w * 0.5, this.pos.z);
    }
    if (this.org === 'btm') {
      offset = new Vector3(this.w * 0.5, 0, 0);
      position = new Vector3(
        this.pos.x,
        (this.pos.y + this.w * 0.5) * -1,
        this.pos.z
      );
    }
    if (this.org === 'left') {
      offset = new Vector3(this.w * 0.5, 0, 0);
      position = new Vector3(this.pos.x - this.w * 0.5, this.pos.y, this.pos.z);
    }
    if (this.org === 'right') {
      offset = new Vector3(-this.w * 0.5, 0, 0);
      position = new Vector3(this.pos.x + this.w * 0.5, this.pos.y, this.pos.z);
    }
    if (this.org === '') {
      offset = new Vector3(0, 0, 0);
      position = new Vector3(this.pos.x, this.pos.y, this.pos.z);
    }

    const geometry = new PlaneGeometry(this.w, this.h);
    geometry.translate(...offset);
    const material = lineMaterial.clone();
    material.color = this.c;
    const mesh = new Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.rotation.set(0, 0, this.ang);
    return mesh;
  }
}

export default class LinesAnimation {
  constructor(scene) {
    this.scene = scene;
    this.group = new Group();
    this.group.name = 'Lines';
    this.r = 2.8;
    this.w = 0.015;
    this.g = 0.2;
    this.circleOp = 0.3;
    this.colorCircle = new Color('rgb(40,40,40)');
    this.colorLine = new Color('rgb(10,10,10)');

    this.timeline = gsap.timeline();
    this.groupTimeline = gsap.timeline();
    this.circlesTimeline = gsap.timeline();
    this.linesTimeline = gsap.timeline();

    this.reversedTimeline = gsap.timeline();
    this.circlesTimelineReverse = gsap.timeline();
    this.linesTimelineReverse = gsap.timeline();

    this.generateCircles();
    this.generateLines();

    this.scene.add(this.group);

    this.createGroupTimeline();
    this.createCirclesTimeline();
    this.createLinesTimeline();

    this.createCirclesReverseTimeline();
    this.createLinesReverseTimeline();
  }

  getTimeline() {
    this.timeline
      .add(this.groupTimeline)
      .add(this.circlesTimeline, '<')
      .add(this.linesTimeline, '<');
    return this.timeline;
  }

  getTimelineReverse() {
    this.reversedTimeline
      .add(this.linesTimelineReverse)
      .add(this.circlesTimelineReverse, '<+0.2');
    return this.reversedTimeline;
  }

  generateLines() {
    const halfPI = Math.PI * 0.5;
    this.lineMid = new AnimatableLine(
      12,
      this.w,
      new Vector3(0, 0, -0.0025),
      halfPI,
      'btm',
      this.colorLine
    );
    this.lineRight = new AnimatableLine(
      12,
      this.w,
      new Vector3(this.r + this.w * 0.5, 0, -0.0015),
      halfPI,
      'btm',
      this.colorLine
    );
    this.lineLeft = new AnimatableLine(
      12,
      this.w,
      new Vector3((this.r + this.w * 0.5) * -1, 0, -0.003),
      halfPI,
      'btm',
      this.colorLine
    );

    this.lineTop = new AnimatableLine(
      18,
      this.w,
      new Vector3(0, this.r + this.w * 0.5, -0.0035),
      0,
      'left',
      this.colorLine
    );
    this.lineBtm = new AnimatableLine(
      18,
      this.w,
      new Vector3(0, (this.r + this.w * 0.5) * -1, -0.004),
      0,
      'right',
      this.colorLine
    );

    this.lineTopI = new AnimatableLine(
      18,
      this.w,
      new Vector3(0, this.r + this.w * 0.5 - this.g, -0.0045),
      0,
      'left',
      this.colorLine
    );
    this.lineBtmI = new AnimatableLine(
      18,
      this.w,
      new Vector3(0, (this.r + this.w * 0.5 - this.g) * -1, -0.005),
      0,
      'right',
      this.colorLine
    );
    this.lineRightI = new AnimatableLine(
      12,
      this.w,
      new Vector3(this.r + this.w * 0.5 - this.g, 0, -0.0055),
      halfPI,
      'top',
      this.colorLine
    );
    this.lineLeftI = new AnimatableLine(
      12,
      this.w,
      new Vector3((this.r + this.w * 0.5 - this.g) * -1, 0, -0.006),
      halfPI,
      'btm',
      this.colorLine
    );

    this.lineMidT = new AnimatableLine(
      18,
      this.w,
      new Vector3(0, this.r * 0.5 + this.w * 0.5 - this.g - 0.1, -0.0065),
      0,
      'left',
      this.colorLine
    );

    this.lineMidB = new AnimatableLine(
      18,
      this.w,
      new Vector3(0, (this.r * 0.5 + this.w * 0.5 - this.g) * -1 + 0.1, -0.007),
      0,
      'right',
      this.colorLine
    );

    this.lineD1 = new AnimatableLine(
      18,
      this.w,
      new Vector3(0, 0, -0.0075),
      halfPI * 0.5,
      '',
      this.colorLine
    );
    this.lineD2 = new AnimatableLine(
      18,
      this.w,
      new Vector3(0, 0, -0.008),
      halfPI * -0.5,
      '',
      this.colorLine
    );

    this.group.add(this.lineMid.line);
    this.group.add(this.lineRight.line);
    this.group.add(this.lineLeft.line);
    this.group.add(this.lineTop.line);
    this.group.add(this.lineBtm.line);
    this.group.add(this.lineTopI.line);
    this.group.add(this.lineBtmI.line);
    this.group.add(this.lineRightI.line);
    this.group.add(this.lineLeftI.line);
    this.group.add(this.lineMidB.line);
    this.group.add(this.lineMidT.line);
    this.group.add(this.lineD1.line);
    this.group.add(this.lineD2.line);
  }

  generateCircles() {
    this.circleMid = new AnimatableCircle(
      this.r,
      this.w,
      new Vector3(0, 0, 0),
      this.circleOp
    );
    this.circleMain = new AnimatableCircle(
      this.r - this.g,
      this.w * 1.8,
      new Vector3(0, 0, 0.0014),
      1
    );
    this.circleMain.circleMaterial.uniforms.mainCircle.value = true;
    this.circleLeft = new AnimatableCircle(
      this.r,
      this.w,
      new Vector3(this.r * -2 - this.w, 0, 0.001),
      this.circleOp
    );
    this.circleRight = new AnimatableCircle(
      this.r,
      this.w,
      new Vector3(this.r * 2 + this.w, 0, 0.002),
      this.circleOp
    );
    this.circleTop = new AnimatableCircle(
      this.r,
      this.w,
      new Vector3(0, this.r * 2 + this.w, 0.0025),
      this.circleOp
    );
    this.circleTopS = new AnimatableCircle(
      this.r / 2,
      this.w * 2,
      new Vector3(this.r / 2, this.r * 1.5 + this.w, 0.002),
      this.circleOp
    );
    this.circleTopXS = new AnimatableCircle(
      this.r / 4,
      this.w * 3,
      new Vector3(this.r / 2, this.r * 1.25 + this.w * 3, 0.003),
      this.circleOp
    );
    this.circleBtm = new AnimatableCircle(
      this.r,
      this.w,
      new Vector3(0, this.r * -2 - this.w, 0.0031),
      this.circleOp
    );
    this.circleBtmS = new AnimatableCircle(
      this.r / 2,
      this.w * 2,
      new Vector3(this.r / 2, this.r * -1.5 - this.w, 0.004),
      this.circleOp
    );

    this.group.add(this.circleMid.circle);
    this.group.add(this.circleLeft.circle);
    this.group.add(this.circleRight.circle);
    this.group.add(this.circleTop.circle);
    this.group.add(this.circleBtm.circle);

    this.group.add(this.circleMain.circle);
    this.group.add(this.circleTopS.circle);
    this.group.add(this.circleTopXS.circle);

    this.group.add(this.circleBtmS.circle);
  }

  createGroupTimeline() {
    this.groupTimeline
      .fromTo(
        this.group.position,
        { x: -3, y: -2, z: 1 },
        { x: 0, y: 0, z: 0, duration: 1 }
      )
      .fromTo(
        this.group.scale,
        { x: 1.5, y: 1.5 },
        { x: 1, y: 1, duration: 2 },
        '<'
      )
      .fromTo(
        this.group.rotation,
        { x: -0.8, y: 0.1 },
        { x: 0, y: 0, duration: 2 },
        '<+0.5'
      );
  }

  createCirclesTimeline() {
    const steps = [
      [this.circleRight, ''],
      [this.circleMid, '<+0.1'],
      [this.circleTopS, '<+0.15'],
      [this.circleTopXS, '<+0.15'],
      [this.circleTop, '<-0.15'],
      [this.circleLeft, '<-0.2'],
      [this.circleBtm, '<+0.1'],
      [this.circleBtmS, '<+0.15'],
      [this.circleMain, '<+1.7'],
    ];
    const dur = 0.8;

    steps.forEach((step) => {
      this.circlesTimeline.to(
        step[0].circleMaterial.uniforms.progress,
        {
          value: 1,
          duration: dur,
        },
        step[1]
      );
    });
  }

  createCirclesReverseTimeline() {
    const steps = [
      [this.circleTopXS, ''],
      [this.circleMid, '<'],
      [this.circleTopS, '<'],
      [this.circleRight, '<'],
      [this.circleTop, '<'],
      [this.circleLeft, '<'],
      [this.circleBtm, '<'],
      [this.circleBtmS, '<'],
    ];
    const dur = 0.6;

    steps.forEach((step) => {
      this.circlesTimelineReverse.to(
        step[0].circleMaterial.uniforms.progress,
        {
          value: 0,
          duration: dur,
        },
        step[1]
      );
    });
  }

  createLinesTimeline() {
    const steps = [
      [this.lineRight, ''],
      [this.lineLeft, '<'],
      [this.lineTop, '<'],
      [this.lineMidT, '<+0.2'],
      [this.lineTopI, '<'],
      [this.lineBtmI, '<'],
      [this.lineLeftI, '<'],
      [this.lineRightI, '<'],
      [this.lineMidB, '<+0.2'],
      [this.lineBtm, '<'],
      [this.lineMid, '<+0.5'],
      [this.lineD1, '<'],
      [this.lineD2, '<'],
    ];
    const dur = 1;

    steps.forEach((step) => {
      this.linesTimeline.fromTo(
        step[0].line.scale,
        { x: 0 },
        { x: 1, duration: dur },
        step[1]
      );
    });

    this.linesTimeline.to(
      this.colorLine,
      { r: 5 / 255, g: 5 / 255, b: 5 / 255, duration: dur / 2 },
      '<'
    );
  }

  createLinesReverseTimeline() {
    const steps = [
      [this.lineMid, ''],
      [this.lineD1, '<'],
      [this.lineD2, '<'],
      [this.lineLeft, '<+0.25'],
      [this.lineTop, '<'],
      [this.lineTopI, '<'],
      [this.lineBtmI, '<'],
      [this.lineLeftI, '<'],
      [this.lineRightI, '<'],
      [this.lineBtm, '<'],
      [this.lineRight, '<'],
      [this.lineMidT, '<+0.1'],
      [this.lineMidB, '<'],
    ];
    const dur = 0.7;

    steps.forEach((step) => {
      this.linesTimelineReverse.to(
        step[0].line.scale,
        { x: 0, duration: dur },
        step[1]
      );
    });
  }
}
