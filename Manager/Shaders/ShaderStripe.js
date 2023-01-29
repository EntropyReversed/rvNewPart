import { DoubleSide, ShaderMaterial, ShaderChunk, ShaderLib } from 'three';
import { noise } from '../../Manager/Shaders/noise';
import { monkeyPatch } from '../../Manager/Utils/monkeyPatch';

export const shaderStripe = (uniforms) => {
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
        uniform float time;
        uniform float amplitude;
        uniform float speed;
        uniform float frequency;
        uniform float progress;
        uniform float offset;
        varying vec2 vUv;
  
        ${noise()}
        
        // the function which defines the displacement
        float displace(vec3 point) {
          float vel = time * speed;
          return noise(vec3(point.x, point.y, point.z) * frequency + vel) * amplitude * (1.0 - smoothstep(0.0, 0.05, uv.y));
        }
        
        vec3 orthogonal(vec3 v) {
          return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
          : vec3(0.0, -v.z, v.y));
        }
      `,
      main: `
        vUv =  uv;
        vec3 displacedPosition = position + normal * displace(position);
        vec3 tangent = orthogonal(normal);
        vec3 bitangent = normalize(cross(normal, tangent));
        vec3 neighbour1 = position + tangent * offset;
        vec3 neighbour2 = position + bitangent * offset;
        vec3 displacedNeighbour1 = neighbour1 + normal * displace(neighbour1);
        vec3 displacedNeighbour2 = neighbour2 + normal * displace(neighbour2);
        vec3 displacedTangent = displacedNeighbour1 - displacedPosition;
        vec3 displacedBitangent = displacedNeighbour2 - displacedPosition;
        vec3 displacedNormal = normalize(cross(displacedTangent, displacedBitangent));
      `,

      '#include <defaultnormal_vertex>':
        ShaderChunk.defaultnormal_vertex.replace(
          // transformedNormal will be used in the lighting calculations
          'vec3 transformedNormal = objectNormal;',
          `vec3 transformedNormal = displacedNormal;`
        ),

      // transformed is the output position
      '#include <displacementmap_vertex>': `
        transformed = displacedPosition;
      `,
    }),

    fragmentShader: monkeyPatch(ShaderChunk.meshphysical_frag, {
      header: `
        uniform float progress;
        varying vec2 vUv;
      `,
      '#include <dithering_fragment>': `
        float alphaM = smoothstep(0.0,0.01, vUv.y) - smoothstep(progress,progress+0.05, vUv.y);
        gl_FragColor.a = alphaM; 
      `,
    }),
  });

  return material;
};
