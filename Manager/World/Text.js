import gsap from 'gsap';
import TextSplitter from '../Utils/SplitText';

export default class Text {
  constructor(manager) {
    this.manager = manager;
    this.timeline = gsap.timeline();
    new TextSplitter(this.manager.parent.querySelector('.firstTitle'));
  }

  getTimeline() {
    return this.timeline
      .fromTo(
        '.firstTitle .letter',
        { opacity: 0 },
        {
          duration: 0.1,
          opacity: 1,
          stagger: 0.012,
        }
      )
      .to({}, { duration: 0.3 })
      .to(
        '.firstTitle',
        {
          opacity: 0,
          duration: 0.2,
        },
        '+=0.2'
      );
  }
}
