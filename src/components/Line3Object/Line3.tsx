import * as React from 'react'
import { useMemo } from 'react';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { useThree, extend } from '@react-three/fiber'
import { useRecoilState, useRecoilValue } from 'recoil';

import { LineSegments3 } from './LineSegments3'
import { LineSegments3Geometry } from './LineSegments3Geometry'
import vertexShader from './shaders/vert_shader.glsl?raw'
import fragmentShader from './shaders/frag_shader.glsl?raw'

import { viewControlState, selectedRowState, enableLineSelectState} from '../../atoms/GcodeState';
import { viewSettingState } from '../../atoms/ViewSetting';

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

export const Line3 = React.forwardRef<
  LineSegments3,
  LineSegmentsPropsTypes
>(function Line3({lineSegments}, ref) {
  const [viewControl, _setViewControl] = useRecoilState(viewControlState)
  const [selectedRow, _setSelectedRow] = useRecoilState(selectedRowState)
  const enableLineSelect = useRecoilValue(enableLineSelectState)
  const viewSetting = useRecoilValue(viewSettingState)

  const size = useThree((state) => state.size)
  const line3 = useMemo(() => (new LineSegments3()), [lineSegments])
  //const [lineMaterial] = React.useState(() => new MyCustomMaterial())
  const material = useMemo(() => {
    const mat = new MyCustomMaterial();
    mat.uniforms.resolution.value.set(size.width, size.height);
    // ここで side プロパティを設定
    mat.side = THREE.DoubleSide;
    return mat;
  }, []);
  //const itemSize = (vertexColors?.[0] as number[] | undefined)?.length === 4 ? 4 : 3
  const lineGeom = React.useMemo(() => {
    const geom =  new LineSegments3Geometry()

    geom.setPositions(lineSegments, 0, lineSegments.length, selectedRow, null)

    return geom
  }, [lineSegments])


  React.useLayoutEffect(() => {
    line3.computeLineDistances()
  }, [lineSegments])

  React.useLayoutEffect(() => {
    let show_start = 0
    let show_end = lineSegments.length
    if(viewControl.mode === 1){
      show_start = viewControl.start_layer
      show_end = 1
    }else if(viewControl.mode === 2) {
      show_start = viewControl.start_layer
      show_end = viewControl.end_layer - viewControl.start_layer + 1
    }
    lineGeom.setPositions(lineSegments, show_start, show_end, selectedRow, viewSetting)
  }, [viewControl, selectedRow, viewSetting])

  //React.useLayoutEffect(() => {
  //  if (dashed) {
  //    lineMaterial.defines.USE_DASH = ''
  //  } else {
  //    // Setting lineMaterial.defines.USE_DASH to undefined is apparently not sufficient.
  //    delete lineMaterial.defines.USE_DASH
  //  }
  //  lineMaterial.needsUpdate = true
  //}, [dashed, lineMaterial])

  React.useEffect(() => {
    return () => lineGeom.dispose()
  }, [lineGeom])

  const getSelectedIndex = (click_index: number) => {
    if(viewControl.mode === 0){
      return lineSegments[click_index].index + 1
    }else if(viewControl.mode === 1){
      return lineSegments[click_index + viewControl.start_layer].index + 1
    }else if(viewControl.mode == 2){
      return lineSegments[click_index + viewControl.start_layer].index + 1
    }
  }


  const handleClick = (event:any) => {
    //console.log("handleClick")
    //console.log(event)
    //console.log("click:", getSelectedIndex(event.faceIndex))
    //console.log(lineSegments[event.faceIndex])
    const selected_index = getSelectedIndex(event.faceIndex)
    _setSelectedRow({from:selected_index, to:selected_index})
  }

  return (
    <primitive object={line3} ref={ref} onClick={enableLineSelect?handleClick:null}>
      <primitive object={lineGeom} attach="geometry" />
      <primitive
        object={material}
        attach="material"
        resolution={[size.width, size.height]}
      />
    </primitive>
  )
})