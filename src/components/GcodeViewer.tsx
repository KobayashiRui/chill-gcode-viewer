import { Vector3 , DoubleSide} from 'three'
import { Canvas} from '@react-three/fiber'
import { Grid, OrbitControls, GizmoHelper, GizmoViewport} from '@react-three/drei'

import { useRecoilState} from "recoil"
import { viewerObjectsState} from '../atoms/GcodeState';

import LineSegments from './LineSegmentsObject/LineSegments'

function GcodeViewer({height, width}:any) {
  const [viewerObjects, _setViewerObjects] = useRecoilState(viewerObjectsState)
  const canvas_size:any = [1000, 1000]
  console.log(height)

  return (
    <Canvas 
      style={{height:`${height}px`, width:`${width}px`}}
      camera={{ position: new Vector3(-500, 500, 500),  up: new Vector3(0, 0, 1), fov: 75, near:0.1, far: 10000}}
    >
      <Grid cellColor="white" cellSize={1} sectionSize={10} args={canvas_size} side={DoubleSide} fadeDistance={10000} rotation={[Math.PI/2, 0, 0]} position={new Vector3(500,500,0)} />
      <ambientLight />
      <LineSegments
        lineSegments={viewerObjects}
      ></LineSegments>
      {
      //<group >
      //  {
      //    viewerObjects.map( (vo:any, vi:number)=> {
      //      return (
      //        <LineSegmentObject key={vi} data={vo} />
      //      )
      //    })
      //  }
      //</group>
      }
      <OrbitControls makeDefault></OrbitControls>
      <axesHelper args={[5]} />
      <GizmoHelper alignment={"top-right"} margin={[80, 80]}>
        <GizmoViewport {...{ axisColors: ["#f73b3b", "#3bf751", "#3b87f7"]}} />
      </GizmoHelper>
    </Canvas>
  )
}

export default GcodeViewer