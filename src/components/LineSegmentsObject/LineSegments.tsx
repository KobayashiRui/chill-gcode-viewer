import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import {useThree, extend } from '@react-three/fiber';
import vertexShader from './shaders/vert_shader.glsl?raw'
import fragmentShader from './shaders/frag_shader.glsl?raw'
import { Box3Helper } from 'three';
import { useRecoilState } from 'recoil';
import { viewControlState, selectedRowState } from '../../atoms/GcodeState';

const MyCustomMaterial = shaderMaterial(
  {
    resolution: new THREE.Vector2(window.innerWidth, window.innerHeight)
  },
  vertexShader,
  fragmentShader
);

extend({ MyCustomMaterial });
extend({ Box3Helper });

//function BoundingBoxHelper({ objectRef }:any) {
//  const { scene } = useThree();
//  console.log(objectRef)
//
//  useEffect(() => {
//    if (objectRef.current) {
//      // バウンディングボックスを計算
//      const box = new Box3().setFromObject(objectRef.current);
//      
//      // バウンディングボックスのヘルパーを作成
//      const helper = new Box3Helper(box, 0xffff00); // 黄色のバウンディングボックス
//      
//      // ヘルパーをシーンに追加
//      scene.add(helper);
//
//      const sphere = objectRef.current.geometry.boundingSphere
//      const sphereGeometry = new THREE.SphereGeometry(sphere.radius, 32, 32);
//      const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
//      const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
//      sphereMesh.position.copy(sphere.center);
//      scene.add(sphereMesh);
//
//      // クリーンアップ関数
//      return () => {
//        scene.remove(helper);
//      };
//    }
//  }, [objectRef.current, scene]);
//
//  return null;
//}

function computeBoundingBox(segments:any[]) {
  let min = new THREE.Vector3(Infinity, Infinity, Infinity);
  let max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
  for(let i = 0; i < segments.length; i++){
    for(let j = 0; j < segments[i].points.length; j++){
      const vertex = segments[i].points[j]
      min.min(vertex)
      max.max(vertex)
    }
  }

  console.log("min:", min, ", max:",max)

  return new THREE.Box3(min, max);
}



type LineSegmentsPropsTypes = {
  lineSegments: any
}

export default function LineSegments({lineSegments}:LineSegmentsPropsTypes) {
  const meshRef = useRef<any>(null);
  const [viewControl, _setViewControl] = useRecoilState(viewControlState)
  const [selectedRow, setSelectedRow] = useRecoilState(selectedRowState)

  //const { size, gl, camera, raycaster, pointer} = useThree(); // Three.jsのレンダラーからサイズを取得
  const { size} = useThree(); // Three.jsのレンダラーからサイズを取得

  //useEffect(() => {
  //  if (!meshRef.current) return;

  //  // オリジナルの raycast メソッドを保存
  //  const originalRaycast = meshRef.current.raycast;

  //  // カスタム raycast メソッド
  //  meshRef.current.raycast = (raycaster:any, intersects:any) => {
  //    three_raycast.setFromCamera( mouse, camera );
  //    const intersection = three_raycast.intersectObject( meshRef.current );
  //    console.log("intersection:",intersection)

  //    const testIntersect = {
  //      distance: 10, // 仮の距離
  //      point: new THREE.Vector3(0, 0, 0), // 仮の交差点
  //      object: meshRef.current // 当該オブジェクト
  //    };

  //    intersects.push(testIntersect);
  //  };

  //  return () => {
  //    // コンポーネントのアンマウント時にオリジナルのraycastに戻す
  //    if (meshRef.current) {
  //      meshRef.current.raycast = originalRaycast;
  //    }
  //  };

  //}, [meshRef.current]);
  // レイキャストとインスタンスIDの検出ロジック
  //useEffect(() => {
  //  const handleMouseDown = (event:any) => {
  //    console.log("mouse down!!")
  //    console.log(pointer)
  //    raycaster.setFromCamera(pointer, camera);

  //    const intersects = raycaster.intersectObject(meshRef.current, true);
  //    console.log(intersects)

  //    if (intersects.length > 0) {
  //      console.log("Clicked on InstancedMesh");
  //      const instanceId = intersects[0].instanceId;
  //      console.log("Instance ID:", instanceId);
  //    }
  //  };

  //  gl.domElement.addEventListener('mousedown', handleMouseDown);

  //  return () => {
  //    gl.domElement.removeEventListener('mousedown', handleMouseDown);
  //  };
  //}, [gl, camera]);



  //const numInstances = 100;
  const material = useMemo(() => {
    const mat = new MyCustomMaterial();
    mat.uniforms.resolution.value.set(size.width, size.height);
    // ここで side プロパティを設定
    mat.side = THREE.DoubleSide;
    return mat;
  }, []);


  const geometry = useMemo(() => {
    //console.log("create geometry")
    //console.log(lineSegments)
    //console.log(size)
    if(lineSegments.length <= 0) {
      return
    }

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
    //const indices = [
    //  0, 1, 2, 
    //  3, 4, 5
    //];

    //tempGeometry.setIndex(indices);
    tempGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    //const instancePositions = new Float32Array(numInstances * 6);

    const buffer_array = new Float32Array(lineSegments.length * 10);

    let show_start = 0
    let show_end = lineSegments.length
    if(viewControl.mode === 1){
      show_start = viewControl.start_layer
      show_end = 1
    }else if(viewControl.mode === 2) {
      show_start = viewControl.start_layer
      show_end = viewControl.end_layer - viewControl.start_layer + 1
    }

    for (let i = 0; i < show_end; i++) {
      // pointAの座標を設定
      buffer_array[i * 10 + 0] = lineSegments[i+show_start].points[0].x;
      buffer_array[i * 10 + 1] = lineSegments[i+show_start].points[0].y;
      buffer_array[i * 10 + 2] = lineSegments[i+show_start].points[0].z;
      // pointBの座標を設定
      buffer_array[i * 10 + 3] = lineSegments[i+show_start].points[1].x;
      buffer_array[i * 10 + 4] = lineSegments[i+show_start].points[1].y;
      buffer_array[i * 10 + 5] = lineSegments[i+show_start].points[1].z;

      const line_index = lineSegments[i+show_start].index
      let line_color = lineSegments[i+show_start].color
      if( (selectedRow.from -1) <= line_index && line_index <= (selectedRow.to-1)){
        line_color = "#ffff00"
      }
      const color = new THREE.Color(line_color);
      buffer_array[i * 10 + 6] = color.r;
      buffer_array[i * 10 + 7] = color.g;
      buffer_array[i * 10 + 8] = color.b;

      buffer_array[i * 10 + 9] = lineSegments[i+show_start].width;
    }

    //console.log(buffer_array);

    const interleavedBuffer = new THREE.InstancedInterleavedBuffer(buffer_array, 10);

    tempGeometry.setAttribute('pointA', new THREE.InterleavedBufferAttribute(interleavedBuffer, 3, 0)); // オフセット0から開始
    tempGeometry.setAttribute('pointB', new THREE.InterleavedBufferAttribute(interleavedBuffer, 3, 3)); // オフセット3から開始
    tempGeometry.setAttribute('color', new THREE.InterleavedBufferAttribute(interleavedBuffer, 3, 6)); // オフセット3から開始
    tempGeometry.setAttribute('width', new THREE.InterleavedBufferAttribute(interleavedBuffer, 1, 9)); // オフセット3から開始

    const get_bounding_box = computeBoundingBox(lineSegments)
    tempGeometry.boundingBox = get_bounding_box
    const get_bounding_sphere = new THREE.Sphere();
    get_bounding_box.getBoundingSphere(get_bounding_sphere)
    tempGeometry.boundingSphere = get_bounding_sphere

    return tempGeometry;
  }, [lineSegments, size, viewControl ,selectedRow]);

  const handleClick = (event:any) => {
    console.log("handleClick")
    console.log(event)
  }

  return (
    <>
    <instancedMesh ref={meshRef} args={[geometry, material, lineSegments.length]} onClick={handleClick}>
    </instancedMesh>
    </>
  )
}