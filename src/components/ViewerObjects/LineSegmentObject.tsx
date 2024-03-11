import React from "react"
import {LineSegments, BufferGeometry, BufferAttribute, LineBasicMaterial, Vector4, Matrix4} from 'three';
import { Line } from "@react-three/drei";


function LineSegmentObject({data}:any){

  return (
    <Line
        points={data.points}
        color={data.color}
        lineWidth={data.width}
    >
    </Line>
  )
}

export default LineSegmentObject