import gsap from 'gsap';
import { animateText } from '../../Manager/Utils/animateText';
// import TextSplitter from '../Utils/SplitText';

export default class Text {
  constructor(manager) {
    this.manager = manager;
    this.timeline = gsap.timeline();
    // new TextSplitter(this.manager.parent.querySelector('.firstTitle'));
  }

  getTimeline() {
    // animateText(this.timeline, '.firstTitle');
    this.timeline.to('.firstTitle', {opacity: 0})
    .to('.fadeScreen', { opacity: 0 })
    return this.timeline;
    // .fromTo(
    //   '.firstTitle .letter',
    //   { opacity: 0 },
    //   {
    //     duration: 0.1,
    //     opacity: 1,
    //     stagger: 0.012,
    //   }
    // )
    // .to({}, { duration: 0.3 })
    // .to(
    //   '.firstTitle',
    //   {
    //     opacity: 0,
    //     duration: 0.2,
    //   },
    //   '+=0.2'
    // );
  }
}
