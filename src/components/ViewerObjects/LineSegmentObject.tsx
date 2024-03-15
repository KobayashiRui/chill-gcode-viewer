import React, {useRef} from "react"
import {LineSegments, BufferGeometry, BufferAttribute, LineBasicMaterial, Vector4, Matrix4} from 'three';
import { Line, useBVH } from "@react-three/drei";


function LineSegmentObject({data}:any){
  const lineRef:any = useRef(null)

  useBVH(lineRef)

  const handleLineClick = () => {
    console.log("Click:", data)
  }

  return (
    <Line
        ref={lineRef}
        points={data.points}
        color={data.color}
        lineWidth={data.width}
        onClick={handleLineClick}
    >
    </Line>
  )
}

export default LineSegmentObject