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
    uniform sampler2D u_letters_texture;
    uniform float u_time;
    uniform float lettersV;

    uniform float progress;

    float circle(in vec2 _st, in float _radius){
      vec2 dist = _st-vec2(0.5);
      return 1.-smoothstep(_radius-(_radius*0.005),
                           _radius+(_radius*0.005),
                           dot(dist,dist)*4.0);
    }

    void main() {
      vec2 uv = vUv;
      vec4 color = texture2D(u_texture, uv);

      vec4 colorLetters = texture2D(u_letters_texture, uv);
      vec3 lettersColor = vec3(0.86);
      
      vec3 circleMask = vec3(circle(uv,1.0));

      uv.x += (cos(uv.y*5.+progress*4.+u_time*0.4)/20.0);
      // uv.x += (cos(uv.y*5.+progress*4.)/20.0);

      vec3 alphaMask = circleMask * smoothstep(progress,progress+0.08,uv.x);

      gl_FragColor = vec4( mix(color.rgb, lettersColor, colorLetters.rgb * lettersV), alphaMask);

    }
  `,
};
