import { DoubleSide, ShaderMaterial, ShaderChunk, ShaderLib } from 'three';
import { monkeyPatch } from '../../Manager/Utils/monkeyPatch';

export const shaderFused = (uniforms) => {
  const material = new ShaderMaterial({
    lights: true,
    transparent: true,
    side: DoubleSide,
    extensions: {
      derivatives: true,
    },

    defines: {
      STANDARD: '',
      PHYSICAL: '',
    },

    uniforms: {
      ...ShaderLib.physical.uniforms,
      ...uniforms,
    },

    vertexShader: monkeyPatch(ShaderChunk.meshphysical_vert, {
      header: `
        uniform float progress;
        varying vec2 vUv;
      `,
      main: `
        vUv =  uv;
      `,
    }),

    fragmentShader: monkeyPatch(ShaderChunk.meshphysical_frag, {
      header: `
        uniform float progress;
        varying vec2 vUv;
      `,
      '#include <dithering_fragment>': `
        vec2 uv = vUv;
        uv.y += (cos(uv.x*15.)/20.0);
        float alphaM = 1.0 - smoothstep(progress,progress+0.05, uv.y);
        gl_FragColor.a = alphaM; 
      `,
    }),
  });

  return material;
};
