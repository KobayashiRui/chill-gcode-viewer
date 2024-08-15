import {useRef, useState, useEffect} from 'react'
import { Vector3, Euler, DoubleSide} from 'three'
import { Canvas} from '@react-three/fiber'
import { OrthographicCamera, PerspectiveCamera, Grid, OrbitControls, GizmoHelper, GizmoViewport} from '@react-three/drei'

import { useRecoilState, useRecoilValue} from "recoil"
import { viewerObjectsState} from '../atoms/GcodeState';
import {viewCameraSettingState} from '../atoms/ViewSetting';

import {Line3} from './Line3Object/Line3'

function GcodeViewer({hidden, height, width}:any) {
  const [viewerObjects, _setViewerObjects] = useRecoilState(viewerObjectsState)
  const cameraSetting = useRecoilValue(viewCameraSettingState)
  const canvas_size:any = [1000, 1000] //mm単位

  const cameraRef = useRef<any>(null);

  const [cameraType, setCameraType] = useState(false)
  const [cameraPosition, setCameraPosition] = useState(new Vector3(450, -560, 580))
  const [cameraRotation, setCameraRotation] = useState(new Euler(1.0, 0.13, 0.08))

  useEffect(()=>{
    if(cameraRef.current !== null){
      const {position, rotation} = cameraRef.current;
      setCameraPosition(position.clone())
      setCameraRotation(rotation.clone())
      console.log("pos:",position)
      console.log("rot:", rotation)
      setCameraType(cameraSetting)
    }
  }, [cameraSetting])


  

  //useEffect(() => {
  //  function handleResize() {
  //    if(!canvasHidden){
  //      setCanvasHidden(true)
  //    }
  //   //if(canvasContainerRef.current) {
  //    //console.log("H:",canvasContainerRef.current.clientHeight)
  //    //setCanvasHeight(canvasContainerRef.current.clientHeight)
  //    //}
  //  }

  //  window.addEventListener('resize', handleResize);
  //  handleResize(); // 初期サイズを設定

  //  return () => window.removeEventListener('resize', handleResize);
  //}, []); 

  //useEffect(() => {
  //  if(canvasHeight){
  //    setCanvasHeight(canvasContainerRef.current.clientHeight)
  //    setCanvasWidth(canvasContainerRef.current.clientWidth)
  //    setCanvasHidden(false)
  //  }
  //},[canvasHidden])

  return (
      <Canvas 
        hidden={hidden}
        gl={{ logarithmicDepthBuffer: true, antialias: true }}
        style={{height:`${height}px`, width:`${width}px`}}
        //style={{height:`100%`, width:`100%`}}
        //resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
      >
        {
          cameraType ? 
            <OrthographicCamera ref={cameraRef} makeDefault up={[0,0,1]} position={cameraPosition} rotation={cameraRotation} zoom={1} near={10} far={10000} />
            :
            <PerspectiveCamera ref={cameraRef} makeDefault up={[0,0,1]} fov={75} position={cameraPosition} rotation={cameraRotation} near={10} far={10000} />
        }

        <Grid cellColor="white" cellSize={10} sectionSize={100} args={canvas_size} side={DoubleSide} fadeDistance={10000} rotation={[Math.PI/2, 0, 0]} position={new Vector3(500,500,0)} />
        <ambientLight />
        <Line3
          lineSegments={viewerObjects}
        ></Line3>
        <OrbitControls makeDefault></OrbitControls>
        <axesHelper args={[50]} />
        <GizmoHelper alignment={"top-right"} margin={[80, 80]}>
          <GizmoViewport {...{ axisColors: ["#f73b3b", "#3bf751", "#3b87f7"]}} />
        </GizmoHelper>
      </Canvas>
  )
}

export default GcodeViewer