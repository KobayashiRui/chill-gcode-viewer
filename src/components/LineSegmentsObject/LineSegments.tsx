import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import {useThree, extend } from '@react-three/fiber';
import vertexShader from './shaders/vert_shader.glsl?raw'
import fragmentShader from './shaders/frag_shader.glsl?raw'

const MyCustomMaterial = shaderMaterial(
  {
    resolution: new THREE.Vector2(window.innerWidth, window.innerHeight)
  },
  vertexShader,
  fragmentShader
);

extend({ MyCustomMaterial });

type LineSegmentsPropsTypes = {
  lineSegments: any
}

export default function LineSegments({lineSegments}:LineSegmentsPropsTypes) {
  const meshRef = useRef<any>();

  const { size } = useThree(); // Three.jsのレンダラーからサイズを取得


  //const numInstances = 100;
  const material = useMemo(() => {
    const mat = new MyCustomMaterial();
    mat.uniforms.resolution.value.set(size.width, size.height);
    // ここで side プロパティを設定
    mat.side = THREE.DoubleSide;
    return mat;
  }, []);


  const geometry = useMemo(() => {
    console.log("create geometry")
    console.log(lineSegments)
    console.log(size)

    const tempGeometry = new THREE.BufferGeometry();

    // 4つの頂点で平面を定義
    const vertices = new Float32Array([
      0, -0.5, 0,
      0, -0.5, 1,
      0, 0.5, 1,
      0, -0.5, 0,
      0, 0.5, 1,
      0, 0.5, 0
    ]);

    // 2つの三角形で四角形の面を構成
    const indices = [
      0, 1, 2, 
      3, 4, 5
    ];

    //tempGeometry.setIndex(indices);
    tempGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    //const instancePositions = new Float32Array(numInstances * 6);

    const buffer_array = new Float32Array(lineSegments.length * 10);
    for (let i = 0; i < lineSegments.length; i++) {
      console.log(lineSegments[i])
      // pointAの座標を設定
      buffer_array[i * 10 + 0] = lineSegments[i].points[0].x;
      buffer_array[i * 10 + 1] = lineSegments[i].points[0].y;
      buffer_array[i * 10 + 2] = lineSegments[i].points[0].z;
      // pointBの座標を設定
      buffer_array[i * 10 + 3] = lineSegments[i].points[1].x;
      buffer_array[i * 10 + 4] = lineSegments[i].points[1].y;
      buffer_array[i * 10 + 5] = lineSegments[i].points[1].z;

      const color = new THREE.Color(lineSegments[i].color);
      buffer_array[i * 10 + 6] = color.r;
      buffer_array[i * 10 + 7] = color.g;
      buffer_array[i * 10 + 8] = color.b;

      buffer_array[i * 10 + 9] = lineSegments[i].width;
  }

    console.log(buffer_array);

    const interleavedBuffer = new THREE.InstancedInterleavedBuffer(buffer_array, 10);

    tempGeometry.setAttribute('pointA', new THREE.InterleavedBufferAttribute(interleavedBuffer, 3, 0)); // オフセット0から開始
    tempGeometry.setAttribute('pointB', new THREE.InterleavedBufferAttribute(interleavedBuffer, 3, 3)); // オフセット3から開始
    tempGeometry.setAttribute('color', new THREE.InterleavedBufferAttribute(interleavedBuffer, 3, 6)); // オフセット3から開始
    tempGeometry.setAttribute('width', new THREE.InterleavedBufferAttribute(interleavedBuffer, 1, 9)); // オフセット3から開始

    tempGeometry.computeBoundingBox();
    tempGeometry.computeBoundingSphere(); 
    return tempGeometry;
  }, [lineSegments, size]);

  useEffect(() => {
    // meshRef.currentが存在する場合、frustumCulledをfalseに設定
    if (meshRef.current) {
      meshRef.current.frustumCulled = false;
    }
  }, [geometry]);

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, lineSegments.length]}>
    </instancedMesh>
  )
}