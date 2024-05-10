import { EdgesGeometry, InstancedBufferGeometry, LineSegments, Matrix4, Mesh, WireframeGeometry } from 'three'

export class LineSegments3Geometry extends InstancedBufferGeometry {
  constructor()
  readonly isLineSegments3Geometry: true

  applyMatrix4(matrix: Matrix4): this
  computeBoundingBox(): void
  computeBoundingSphere(): void
  //fromEdgesGeometry(geometry: EdgesGeometry): this
  //fromLineSegments(lineSegments: LineSegments): this
  //fromMesh(mesh: Mesh): this
  //fromWireframeGeometry(geometry: WireframeGeometry): this
  setColors(array: number[] | Float32Array, itemSize?: 3 | 4): this
  setPositions(array: number[] | Float32Array, start:number, end:number): this
}