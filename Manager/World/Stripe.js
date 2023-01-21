import {
  UniformsUtils,
  Clock,
  Color,
  DoubleSide,
  ShaderMaterial,
  ShaderLib,
  ShaderChunk,
} from 'three';
import gsap from 'gsap';
import ShaderStripe from './../Shaders/ShaderStripe';

import * as dat from 'dat.gui';
import { monkeyPatch } from '../../Manager/Utils/monkeyPatch';
import { noise } from '../../Manager/Shaders/noise';

export default class Stripe {
  constructor(manager, stripe) {
    this.manager = manager;
    this.stripe = stripe;
    this.setUp();
  }

  setUp() {
    const SIZE = 2;
    const RESOLUTION = 80;
    this.clock = new Clock();
    const controls = {
      diffuse: {
        value: new Color('#5B82A6'),
      },
      roughness: {
        value: 0.2,
      },
      amplitude: {
        value: 0.6,
      },
      speed: {
        value: 0.2,
      },
      frequency: {
        value: 0.7,
      },
      time: {
        value: 0,
      },
    };

    this.material = new ShaderMaterial({
      lights: true,
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
        ...controls,
      },

      vertexShader: monkeyPatch(ShaderChunk.meshphysical_vert, {
        header: `
          uniform float time;
          uniform float amplitude;
          uniform float speed;
          uniform float frequency;
    
          ${noise()}
          float displace(vec3 point) {
            return noise(vec3(point.x * frequency, point.z * frequency, time * speed)) * amplitude * (1.0 - smoothstep(0.1,0.11,uv.y));
          }
          
          vec3 orthogonal(vec3 v) {
            return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
            : vec3(0.0, -v.z, v.y));
          }
        `,
        main: `
          vec3 displacedPosition = position + normal * displace(position);
    
    
          float offset = ${SIZE / RESOLUTION};
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

      fragmentShader: monkeyPatch(ShaderChunk.meshphysical_frag, {}),
    });

    // this.stripe.material = this.material
    // const gui = new dat.GUI();
    // var folder1 = gui.addFolder('progress');
    // folder1.add(this.material.uniforms.progress, 'value', 0, 1, 0.01);
  }

  getTimeline() {
    this.timeline = gsap.timeline();
    // .set(this.stripe.material, { depthWrite: true })
    // .set(this.material.uniforms.opacity, { value: 1 })
    // .to(
    //   this.material.uniforms.progress,
    //   { value: 0.1, duration: 2 },
    //   '<+=0.1'
    // )
    // .to(this.material.uniforms.opacity, { value: 0, duration: 1 }, '<+=1');
    return this.timeline;
  }

  updateTime() {
    this.material.uniforms.time.value = this.clock.getElapsedTime();
  }
}
