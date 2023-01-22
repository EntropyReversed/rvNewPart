import {
  Mesh,
  PlaneGeometry,
  Clock,
  Color,
  DoubleSide,
  ShaderMaterial,
  ShaderChunk,
  ShaderLib,
  Euler,
} from 'three';
import * as dat from 'dat.gui';
import { monkeyPatch } from '../../Manager/Utils/monkeyPatch';
import { noise } from '../../Manager/Shaders/noise';

const shaderStripe = (uniforms) => {
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
        varying vec2 vUv;
  
        ${noise()}
        
        // the function which defines the displacement
        float displace(vec3 point) {
          return noise(vec3(point.x * frequency + time * speed, point.y * frequency - time * speed, point.z * frequency + time * speed)) * amplitude * (1.0 - uv.y);
        }
        
        vec3 orthogonal(vec3 v) {
          return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
          : vec3(0.0, -v.z, v.y));
        }
      `,
      main: `
        vUv =  uv;
        vec3 displacedPosition = position + normal * displace(position);
        float offset = 0.03;
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
        float alphaM = smoothstep(0.0,0.4, vUv.y) - smoothstep(progress,progress+0.2, vUv.y);
        gl_FragColor.a = alphaM * progress; 
      `,
    }),
  });

  return material;
};

export default class TestVertex {
  constructor(manager, group) {
    this.manager = manager;
    this.group = group;

    this.clock = new Clock();
    this.planeGeo = new PlaneGeometry(2, 4, 30, 60);

    const uniforms = {
      diffuse: { value: new Color('#C0C0C0') },
      roughness: { value: 0.05 },
      amplitude: { value: 0.5 },
      speed: { value: 0.15 },
      frequency: { value: 0.6 },
      time: { value: 0 },
      progress: { value: 1 },
    };

    this.material = shaderStripe(uniforms);
    this.material.depthWrite = false;

    this.plane = new Mesh(this.planeGeo, this.material);

    this.plane.position.set(this.plane.position.x, 2.35, 0.15);
    this.plane.rotation.setFromVector3(new Euler(-1.62, -0.57, -4.85));
    this.plane.scale.set(0.1, 0.2, 0.2);

    const gui = new dat.GUI();
    var folder1 = gui.addFolder('progress');
    folder1.add(this.material.uniforms.progress, 'value', 0, 1, 0.01);

    // var folder2 = gui.addFolder('rot');
    // folder2.add(this.plane.rotation, 'x', -Math.PI * 2, Math.PI * 2, 0.01);
    // folder2.add(this.plane.rotation, 'y', -Math.PI * 2, Math.PI * 2, 0.01);
    // folder2.add(this.plane.rotation, 'z', -Math.PI * 2, Math.PI * 2, 0.01);

    // var folder3 = gui.addFolder('scale');
    // folder3.add(this.plane.scale, 'x', 0, 2, 0.01);
    // folder3.add(this.plane.scale, 'y', 0, 2, 0.01);
    // folder3.add(this.plane.scale, 'z', 0, 2, 0.01);

    // var folder3 = gui.addFolder('position');
    // folder3.add(this.plane.position, 'x', -4, 4, 0.01);
    // folder3.add(this.plane.position, 'y', -4, 4, 0.01);
    // folder3.add(this.plane.position, 'z', -4, 4, 0.01);

    this.group.add(this.plane);
  }

  update() {
    this.material.uniforms.time.value = this.clock.getElapsedTime();
  }
}
