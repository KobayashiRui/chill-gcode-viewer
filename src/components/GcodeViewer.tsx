import * as THREE from 'three'
import { Vector3 , DoubleSide} from 'three'
import { createRoot } from 'react-dom/client'
import React, { useRef, useState } from 'react'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import { Grid, OrbitControls, TransformControls, CameraControls, GizmoHelper, GizmoViewport} from '@react-three/drei'

import { useRecoilState} from "recoil"
import { viewerObjectsState} from '../atoms/GcodeState';

import LineSegmentObject from './LineSegmentObject/LineSegmentObject'
import LineSegments from './LineSegmentsObject/LineSegments'

function Box(props: ThreeElements['mesh']) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  useFrame((state, delta) => (meshRef.current.rotation.x += delta))
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

function GcodeViewer({height, width}:any) {
  const [viewerObjects, setViewerObjects] = useRecoilState(viewerObjectsState)
  const canvas_size:any = [1000, 1000]

  return (
    <Canvas 
      style={{height:`${height}px`, width:`${width}px`}}
      camera={{ position: new Vector3(-500, 500, 500),  up: new Vector3(0, 0, 1), fov: 75, far: 10000}}
    >
      <Grid cellColor="white" cellSize={1} sectionSize={10} args={canvas_size} side={DoubleSide} fadeDistance={10000} rotation={[Math.PI/2, 0, 0]} position={new Vector3(500,500,0)} />
      <ambientLight />
      <pointLight position={[100, 100, 100]} intensity={10000}/>
      <spotLight position={[100, 100, 100]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <LineSegments></LineSegments>
      <group >
        {
          viewerObjects.map( (vo:any, vi:number)=> {
            return (
              <LineSegmentObject key={vi} data={vo} />
            )
          })
        }
      </group>
      <OrbitControls makeDefault></OrbitControls>
      <axesHelper args={[5]} />
      <GizmoHelper alignment={"top-right"} margin={[80, 80]}>
        <GizmoViewport {...{ axisColors: ["#f73b3b", "#3bf751", "#3b87f7"]}} />
      </GizmoHelper>
    </Canvas>
  )
}

export default GcodeViewer