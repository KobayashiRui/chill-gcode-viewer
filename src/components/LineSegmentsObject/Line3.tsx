import * as React from 'react'
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { useThree, extend } from '@react-three/fiber'
import { LineSegments3 } from './LineSegments3'
import { LineSegments3Geometry } from './LineSegments3Geometry'
import vertexShader from './shaders/vert_shader.glsl?raw'
import fragmentShader from './shaders/frag_shader.glsl?raw'

import { viewControlState, selectedRowState } from '../../atoms/GcodeState';

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

    geom.setPositions(lineSegments, 0, 100)

    //if (vertexColors) {
    //  // using vertexColors requires the color value to be white see #1813
    //  color = 0xffffff
    //  const cValues = vertexColors.map((c) => (c instanceof Color ? c.toArray() : c))
    //  geom.setColors(cValues.flat(), itemSize)
    //}

    return geom
  }, [LineSegments3])

  React.useLayoutEffect(() => {
    line3.computeLineDistances()
  }, [lineSegments])

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
    console.log(lineGeom)
    return () => lineGeom.dispose()
  }, [lineGeom])


  const handleClick = (event:any) => {
    console.log("handleClick")
    console.log(event)
  }

  return (
    <primitive object={line3} ref={ref} onClick={handleClick}>
      <primitive object={lineGeom} attach="geometry" />
      <primitive
        object={material}
        attach="material"
        resolution={[size.width, size.height]}
      />
    </primitive>
  )
})