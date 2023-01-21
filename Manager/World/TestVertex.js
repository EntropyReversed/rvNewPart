import {
  Mesh,
  PlaneGeometry,
  Clock,
  Color,
  DoubleSide,
  ShaderMaterial,
  ShaderChunk,
  ShaderLib,
} from 'three';
import * as dat from 'dat.gui';
import { monkeyPatch } from '../../Manager/Utils/monkeryPath';
import { noise } from '../../Manager/Shaders/noise';

const SIZE = 2;
const RESOLUTION = 80;

export default class TestVertex {
  constructor(manager, group) {
    this.manager = manager;
    this.group = group;

    this.clock = new Clock();
    this.planeGeo = new PlaneGeometry(
      SIZE,
      SIZE * 2,
      RESOLUTION,
      RESOLUTION
    ).rotateX(-Math.PI / 2);

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
    };

    this.material2 = new ShaderMaterial({
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
        time: { value: 0 },
      },

      vertexShader: monkeyPatch(ShaderChunk.meshphysical_vert, {
        header: `
          uniform float time;
          uniform float amplitude;
          uniform float speed;
          uniform float frequency;
    
          ${noise()}
          
          // the function which defines the displacement
          float displace(vec3 point) {
            return noise(vec3(point.x * frequency, point.z * frequency, time * speed)) * amplitude * (1.0 - uv.y);
          }
          
          // http://lolengine.net/blog/2013/09/21/picking-orthogonal-vector-combing-coconuts
          vec3 orthogonal(vec3 v) {
            return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
            : vec3(0.0, -v.z, v.y));
          }
        `,
        // adapted from http://tonfilm.blogspot.com/2007/01/calculate-normals-in-shader.html
        main: `
          vec3 displacedPosition = position + normal * displace(position);
    
    
          float offset = ${SIZE / RESOLUTION};
          vec3 tangent = orthogonal(normal);
          vec3 bitangent = normalize(cross(normal, tangent));
          vec3 neighbour1 = position + tangent * offset;
          vec3 neighbour2 = position + bitangent * offset;
          vec3 displacedNeighbour1 = neighbour1 + normal * displace(neighbour1);
          vec3 displacedNeighbour2 = neighbour2 + normal * displace(neighbour2);
    
          // https://i.ya-webdesign.com/images/vector-normals-tangent-16.png
          vec3 displacedTangent = displacedNeighbour1 - displacedPosition;
          vec3 displacedBitangent = displacedNeighbour2 - displacedPosition;
    
          // https://upload.wikimedia.org/wikipedia/commons/d/d2/Right_hand_rule_cross_product.svg
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

      fragmentShader: ShaderChunk.meshphysical_frag,
    });

    this.plane = new Mesh(this.planeGeo, this.material2);

    this.plane.position.z = 0.15;
    this.plane.position.y = 2.35;

    this.plane.rotation.x = -1.55;
    this.plane.rotation.y = 0.63;
    this.plane.rotation.z = -1.59;

    this.plane.scale.x = 0.2;
    this.plane.scale.y = 0.2;
    this.plane.scale.z = 0.2;

    const gui = new dat.GUI();
    var folder1 = gui.addFolder('rotation');
    folder1.add(this.plane.rotation, 'x', -2, 2, 0.01);
    folder1.add(this.plane.rotation, 'y', -2, 2, 0.01);
    folder1.add(this.plane.rotation, 'z', -2, 2, 0.01);

    this.group.add(this.plane);
  }

  update() {
    this.material2.uniforms.time.value = this.clock.getElapsedTime();
  }
}
