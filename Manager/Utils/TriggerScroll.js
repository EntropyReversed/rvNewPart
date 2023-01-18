import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Manager from '../Manager';

export default class TriggerScroll {
  constructor() {
    this.manager = new Manager();
    gsap.registerPlugin(ScrollTrigger);
    this.createTrigger();
  }

  createTrigger() {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: '.scene-wrap',
          start: 'top top',
          scrub: 2,
          immediateRender: false,
          invalidateOnRefresh: true,
          pin: true,
          end: '+=16000',
        },
        onUpdate: () => {
          if (this.manager.pause) {
            window.requestAnimationFrame(() => this.manager.update());
          }
        },
      })
      .add(this.manager.masterTimeline);
  }
}
