import { Mesh, ShaderMaterial } from 'three'
import { LineSegments3Geometry } from './LineSegments3Geometry'

export class LineSegments3 extends Mesh {
  geometry: LineSegments3Geometry
  material: ShaderMaterial

  constructor(geometry?: LineSegmentsGeometry, material?: ShaderMaterial)
  readonly isLineSegments3: true

  computeLineDistances(): this
}