uniform vec2 resolution;

attribute vec3 pointA;
attribute vec3 pointB;

attribute vec3 instanceColor;

varying vec3 vColor;

void main() {
  float width = 8.0;
  vec4 clip0 = projectionMatrix * modelViewMatrix * vec4(pointA, 1.0);
  vec4 clip1 = projectionMatrix * modelViewMatrix * vec4(pointB, 1.0);
  
  vec2 screen0 = resolution * (0.5 * clip0.xy/clip0.w + 0.5);
  vec2 screen1 = resolution * (0.5 * clip1.xy/clip1.w + 0.5);
  
  vec2 xBasis = normalize(screen1 - screen0);
  vec2 yBasis = vec2(-xBasis.y, xBasis.x);
  
  vec2 pt0 = screen0 + width * (position.x * xBasis + position.y * yBasis);
  vec2 pt1 = screen1 + width * (position.x * xBasis + position.y * yBasis);
  
  vec2 pt = mix(pt0, pt1, position.z);
  vec4 clip = mix(clip0, clip1, position.z);
  
  gl_Position = vec4(clip.w * (2.0 * pt/resolution - 1.0), clip.z, clip.w);

  vColor = instanceColor;
}