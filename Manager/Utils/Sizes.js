export default class Sizes {
  constructor() {
    // this.aspectSpan = document.createElement('span');
    // document.body.appendChild(this.aspectSpan);
    // this.aspectSpan.style.position = 'fixed';
    // this.aspectSpan.style.top = '0';
    // this.aspectSpan.style.left = '0';
    // this.aspectSpan.style.color = 'white';

    // this.sizeSpan = document.createElement('span');
    // document.body.appendChild(this.sizeSpan);
    // this.sizeSpan.style.position = 'fixed';
    // this.sizeSpan.style.top = '30px';
    // this.sizeSpan.style.left = '0';
    // this.sizeSpan.style.color = 'white';

    this.setSizes();
  }

  setSizes() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspect = this.width / this.height;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    // this.aspectSpan.innerHTML = this.aspect;
    // this.sizeSpan.innerHTML = `${this.width} ${this.height}`;
  }

  resize() {
    this.setSizes();
  }
}
