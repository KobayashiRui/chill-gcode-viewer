import * as THREE from 'three'
import { Vector3 , DoubleSide} from 'three'
import { createRoot } from 'react-dom/client'
import React, { useRef, useState } from 'react'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import { Grid, OrbitControls, TransformControls, CameraControls, GizmoHelper, GizmoViewport} from '@react-three/drei'

import { useRecoilState} from "recoil"
import { viewerObjectsState} from '../atoms/GcodeState';

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

  return (
    <Canvas 
      style={{height:`${height}px`, width:`${width}px`}}
      camera={{ position: new Vector3(-50, 50, 50),  up: new Vector3(0, 0, 1), fov: 75, far: 1000}}
    >
      <Grid cellColor="white" cellSize={1} sectionSize={10} args={[150, 150]} side={DoubleSide} fadeDistance={1000} rotation={[Math.PI/2, 0, 0]} />
      <ambientLight />
      <pointLight position={[100, 100, 100]} intensity={10000}/>
      <spotLight position={[100, 100, 100]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />

      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
      <OrbitControls makeDefault></OrbitControls>
      <axesHelper args={[5]} />
      <GizmoHelper alignment={"top-right"} margin={[80, 80]}>
        <GizmoViewport {...{ axisColors: ["#f73b3b", "#3bf751", "#3b87f7"]}} />
      </GizmoHelper>
    </Canvas>
  )
}

export default GcodeViewer