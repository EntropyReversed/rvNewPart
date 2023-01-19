export default {
  vertexShader: `
  varying vec2 vUv; 

  void main() {
      vUv = uv; 
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    precision highp float;

    varying vec2 vUv;
    uniform sampler2D u_texture;

    uniform float opacity;
    uniform float progress;


    void main() {
      vec2 uv = vUv;
      vec4 color = texture2D(u_texture, uv);
      
      // uv.x += (cos(uv.x*5.+progress*8.)/60.0);

      vec3 alphaMask = vec3(opacity) * (1.0-smoothstep(progress,progress+0.03,uv.y));

      gl_FragColor = vec4( vec3(1.0), alphaMask);

    }
  `,
};
