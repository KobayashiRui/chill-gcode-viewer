import {useRef, useState, useEffect, useMemo} from 'react'
import { Vector3, Euler, DoubleSide} from 'three'
import { Canvas} from '@react-three/fiber'
import { OrthographicCamera, PerspectiveCamera, Grid, OrbitControls, GizmoHelper, GizmoViewport} from '@react-three/drei'
import { Bvh } from '@react-three/drei'

//import { viewerObjectsState} from '../atoms/GcodeState';
//import {viewCameraSettingState} from '../atoms/ViewSettingState';

import usePrinterStore from '@/stores/PrinterStore'
//import useFilamentStore from '@/stores/FilamentStore'
import useConfigStore from '@/stores/ConfigStore'

import useGcodeStateStore from '@/stores/GcodeStore'
import useViewSettingStore from '@/stores/ViewSettingStore'

import {Line3} from './Line3Object/Line3'

function GcodeViewer({hidden, height, width}:any) {
  //const [viewerObjects, _setViewerObjects] = useRecoilState(viewerObjectsState)
  const viewerObjects = useGcodeStateStore((state)=> state.viewerObjects)
  const cameraMode = useViewSettingStore((state)=>state.cameraMode)
  const headGeometry = useGcodeStateStore((state)=>state.headGeometry)
  const enableHead = useGcodeStateStore((state)=> state.enableHead)
  const headPosition = useGcodeStateStore((state)=> state.headPosition)

  //const canvas_size:any = [1000, 1000] //mm単位

  const cameraRef = useRef<any>(null);

  const [cameraType, setCameraType] = useState(false)
  const [cameraPosition, setCameraPosition] = useState(new Vector3(450, -560, 580))
  const [cameraRotation, setCameraRotation] = useState(new Euler(1.0, 0.13, 0.08))

  const printerList = usePrinterStore((state) => state.printers)
  //const filamentList = useFilamentStore((state) => state.filaments)
  const usePrinterId = useConfigStore((state) => state.usePrinterId)
  //const useFilamentId = useConfigStore((state) => state.useFilamentId)

  const printer = useMemo(()=> printerList[usePrinterId], [printerList, usePrinterId])

  const bed_size:any = useMemo(()=>[printer.bedConfig.xWidth, printer.bedConfig.yWidth], [printer])

  const bed_origin_pos = useMemo(()=>{
    const pos_x = printer.bedConfig.xWidth / 2;
    const pos_y = printer.bedConfig.yWidth / 2;
    const x_offset = printer.bedConfig.xOffset;  
    const y_offset = printer.bedConfig.yOffset;

    return new Vector3(pos_x - x_offset, pos_y - y_offset, 0)
  }, [printer])


  useEffect(()=>{
    console.log("viewer objects:")
    console.log(viewerObjects)

  }, [viewerObjects])

  useEffect(()=>{
    if(cameraRef.current !== null){
      const {position, rotation} = cameraRef.current;
      setCameraPosition(position.clone())
      setCameraRotation(rotation.clone())
      console.log("pos:",position)
      console.log("rot:", rotation)
      setCameraType(cameraMode)
    }
  }, [cameraMode])

  return (
      <Canvas 
        hidden={hidden}
        gl={{ logarithmicDepthBuffer: true, antialias: true }}
        style={{height:`${height}px`, width:`${width}px`}}
        //style={{height:`100%`, width:`100%`}}
        //resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
      >
        <Bvh firstHitOnly>
        {
          cameraType ? 
            <OrthographicCamera ref={cameraRef} makeDefault up={[0,0,1]} position={cameraPosition} rotation={cameraRotation} zoom={1} near={10} far={10000} />
            :
            <PerspectiveCamera ref={cameraRef} makeDefault up={[0,0,1]} fov={75} position={cameraPosition} rotation={cameraRotation} near={10} far={10000} />
        }

        <Grid cellColor="white" cellSize={10} sectionSize={100} args={bed_size} side={DoubleSide} fadeDistance={10000} rotation={[Math.PI/2, 0, 0]} position={bed_origin_pos} />
        <ambientLight />
        <Line3
          lineSegments={viewerObjects}
        ></Line3>
        {
          (enableHead && headGeometry) &&
          <mesh geometry={headGeometry} position={headPosition}>
            <meshStandardMaterial color="orange"></meshStandardMaterial>
          </mesh>
        }
        <OrbitControls makeDefault></OrbitControls>
        <axesHelper args={[50]} />
        <GizmoHelper alignment={"top-right"} margin={[80, 80]}>
          <GizmoViewport {...{ axisColors: ["#f73b3b", "#3bf751", "#3b87f7"]}} />
        </GizmoHelper>
        </Bvh>
      </Canvas>
  )
}

export default GcodeViewer