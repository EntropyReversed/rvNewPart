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

    const float PI = 3.14159265358979323846;
    varying vec2 vUv;

    uniform float strokeWidth;
    uniform float progress;
    uniform float opacity;
    uniform bool mainCircle;

    float circle(in vec2 _st, in float _radius){
      vec2 dist = _st-vec2(0.5);
      return 1.-smoothstep(_radius-(_radius*0.006),
                           _radius+(_radius*0.006),
                           dot(dist,dist)*4.0);
    }

    vec2 rotateUV(vec2 uv, float rotation)
    {
        float mid = 0.5;
        return vec2(
            cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
            cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
        );
    }

    float halfSlice(vec2 uv, float angle) {

      float c = 1.0 - length(uv - 0.5);
      c = step(0.5, c);
      c -= step(uv.x, 0.5);
      c -= step(rotateUV(uv, PI - angle).x, 0.5);
      c = clamp(c, 0.0, 1.0);

      return c;
    }

    float slice(vec2 uv, float angle) {
      if (angle <= PI) return halfSlice(uv, angle);

      float remainingAngle = angle - PI;
      vec2 ruv = rotateUV(uv, PI);
      return halfSlice(ruv, remainingAngle) + halfSlice(uv, PI);
    }

    void main() {
      vec2 uv = vUv;
      vec3 circleMaskOut = vec3(circle(uv,1.0));
      vec3 circleMaskIn = vec3(circle(uv,1.0-strokeWidth));
      vec3 alphaMask = (circleMaskOut-circleMaskIn);

      float angle = progress * PI * 2.0;
      float cReturn = slice(uv, angle);

      if (progress >= 1.0 && mainCircle) {
        gl_FragColor = vec4(alphaMask-(1.0-opacity), alphaMask);
      } else {
        gl_FragColor = vec4(vec3(cReturn-(1.0-opacity)), alphaMask*cReturn);
      }
      
    }
  `,
};
