import React, { useRef, useMemo } from 'react';
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

export default function LineSegments() {
  const meshRef = useRef<any>();
  const { size } = useThree(); // Three.jsのレンダラーからサイズを取得
  const numInstances = 100;
  const material = useMemo(() => {
    const mat = new MyCustomMaterial();
    mat.uniforms.resolution.value.set(size.width, size.height);
    // ここで side プロパティを設定
    mat.side = THREE.DoubleSide;
    return mat;
  }, []);


  const geometry = useMemo(() => {
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

    const buffer_array = new Float32Array(numInstances * 6);
    for (let i = 0; i < numInstances; i++) {
      // pointAの座標を設定
      buffer_array[i * 6 + 0] = 0.0;
      buffer_array[i * 6 + 1] = 0.0;
      buffer_array[i * 6 + 2] = Math.random() * 100 - 1;
      // pointBの座標を設定
      buffer_array[i * 6 + 3] = 100.0;
      buffer_array[i * 6 + 4] = 0.0;
      buffer_array[i * 6 + 5] = Math.random() * 100 - 1;
  }

    console.log(buffer_array);

    const interleavedBuffer = new THREE.InstancedInterleavedBuffer(buffer_array, 6);

    tempGeometry.setAttribute('pointA', new THREE.InterleavedBufferAttribute(interleavedBuffer, 3, 0)); // オフセット0から開始
    tempGeometry.setAttribute('pointB', new THREE.InterleavedBufferAttribute(interleavedBuffer, 3, 3)); // オフセット3から開始
    tempGeometry.setAttribute('instanceColor', new THREE.InstancedBufferAttribute(new Float32Array(numInstances * 3), 3));

    //// インスタンスの位置と色をランダムに設定
    //for (let i = 0; i < numInstances; i++) {
    //  tempGeometry.attributes.instancePosition.setXYZ(i, Math.random() * 100 - 1, Math.random() * 100 - 1, Math.random() * 100 - 1);
    //  tempGeometry.attributes.instanceColor.setXYZ(i, Math.random(), Math.random(), Math.random());
    //}
    // インスタンスごとにpointAとpointBのデータを設定
    for (let i = 0; i < numInstances; i++) {
        // pointAのデータ（例えば）
        tempGeometry.attributes.instanceColor.setXYZ(i, Math.random(), Math.random(), Math.random());
    }

    return tempGeometry;
  }, [numInstances, size]);

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, numInstances]}>
    </instancedMesh>
  )
}