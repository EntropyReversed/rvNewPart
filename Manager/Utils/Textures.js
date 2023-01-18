import { CanvasTexture } from 'three';

export default class Textures {
  constructor() {
    this.gradientTexture = new CanvasTexture(this.generateTexture());
    this.lettersTexture = new CanvasTexture(this.generateTextureLetters());
    // this.noiseTexture = new CanvasTexture(this.generateWhiteNoise());
  }

  generateTexture() {
    const size = 1024;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = size;
    canvas.height = size;
    ctx.rect(0, 0, size, size);

    const gradient = ctx.createLinearGradient(size / 2, 0, size / 2, size);
    gradient.addColorStop(0, '#a59bf4');
    gradient.addColorStop(1, '#f2a0ac');
    ctx.fillStyle = gradient;
    ctx.fill();

    return canvas;
  }

  generateTextureLetters() {
    const size = 1024;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const scaleR = 1.693;
    const scaleV = 1.695;
    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = 'black';
    ctx.rect(0, 0, size, size);
    ctx.fill();

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5.5;
    ctx.save();
    var path = new Path2D(
      'M141.869,55.953C141.869,55.953 128.131,7.141 128.135,7.092C127.644,7.01 33.151,-7.164 7.778,84.888C6.68,88.854 6.175,92.961 6.281,97.074C6.306,126.76 6.442,253.022 6.442,253.022L56.985,253.114C56.985,253.114 57.034,106.642 57.034,106.6C57.034,106.6 57.034,106.6 57.034,106.6C57.033,106.475 56.68,46.314 141.869,55.953Z'
    );
    ctx.translate(236, 308);
    ctx.scale(scaleR, scaleR);
    ctx.stroke(path);
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    var path2 = new Path2D(
      'M6.261,6.374L58.787,6.37L108.943,182.21L157.887,6.261L209.294,6.371L141.601,235.429C141.601,235.429 133.913,255.488 108.65,255.272C80.912,255.035 74.056,231.984 74.057,231.984C74.058,231.985 6.261,6.374 6.261,6.374Z'
    );
    ctx.translate(466.5, 306.3);
    ctx.scale(scaleV, scaleV);
    ctx.stroke(path2);
    ctx.restore();

    return canvas;
  }

  // generateWhiteNoise() {
  //   const size = 1024;
  //   const canvas = document.createElement('canvas');
  //   const ctx = canvas.getContext('2d');

  //   canvas.width = size;
  //   canvas.height = size;

  //   const noiseData = [];
  //   for (let i = 0; i < canvas.width; i++) {
  //     noiseData[i] = [];
  //     for (let j = 0; j < canvas.height; j++) {
  //       noiseData[i][j] = Math.floor(Math.random() * 256);
  //     }
  //   }

  //   for (let i = 0; i < canvas.width; i++) {
  //     for (let j = 0; j < canvas.height; j++) {
  //       const value = noiseData[i][j];
  //       ctx.fillStyle = `rgb(${value}, ${value}, ${value})`;
  //       ctx.fillRect(i, j, 1, 1);
  //     }
  //   }

  //   return canvas;
  // }
}
