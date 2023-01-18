import Manager from '../Manager';
import Model from './Model';
import Enviroment from './Enviroment';
import Text from './Text';
import TriggerScroll from '../Utils/TriggerScroll';
import Textures from './../Utils/Textures';

export default class World {
  constructor() {
    this.manager = new Manager();
    this.masterTimeline = this.manager.masterTimeline;
    this.resources = this.manager.resources;
    this.text = new Text(this.manager);
    this.camera = this.manager.camera;
    this.enviroment = new Enviroment();
    this.textures = new Textures();
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    };

    this.manager.parent.addEventListener(
      'ready',
      (e) => {
        this.onReady();
      },
      false
    );
  }

  onReady() {
    this.model = new Model();
    this.setUpTimeline();
    window.requestAnimationFrame(() => this.manager.update());
  }

  setUpTimeline() {
    const linesTimeline = this.model.lines.getTimeline();
    const linesReverse = this.model.lines.getTimelineReverse();
    const title1 = this.text.getTimeline();
    const modelTimeline1 = this.model.timeline;
    const modelTimeline2 = this.model.timeline2;
    const cameraTimeline = this.camera.getTimeline();
    const gradientTimeline = this.model.gradientCircle.getTimeline();
    const modelLinesTimeline = this.model.modelLines.getTimeline();
    const edgeTimeline = this.model.edgeRim.getTimeline();
    const cameraTimeline2 = this.camera.getTimeline2();
    const modelPiecesTimeline = this.model.modelPieces.getTimeline();

    this.masterTimeline
      .add(modelTimeline1)
      .add(title1, '<+0.1')
      .add(linesTimeline, '-=0.35')
      .add(modelTimeline2, '-=1.3')
      .add(linesReverse, '-=0.3')
      .add(gradientTimeline, '-=0.1')
      .add(cameraTimeline)
      .add(modelLinesTimeline, '<')
      .add(edgeTimeline, '-=1.5')
      .add(cameraTimeline2, '-=1.2')
      .add(modelPiecesTimeline);

    this.scrollTrigger = new TriggerScroll();
  }
}
