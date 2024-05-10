import {
  Box3,
  Float32BufferAttribute,
  InstancedBufferGeometry,
  InstancedInterleavedBuffer,
  InterleavedBufferAttribute,
  Sphere,
  Vector3,
  WireframeGeometry,
  Color,
} from 'three'

const _box = new Box3()
const _vector = new Vector3()

class LineSegments3Geometry extends InstancedBufferGeometry {
  constructor() {
    super()

    this.isLineSegmentsGeometry = true

    this.type = 'LineSegments3Geometry'

    //const positions = [-1, 2, 0, 1, 2, 0, -1, 1, 0, 1, 1, 0, -1, 0, 0, 1, 0, 0, -1, -1, 0, 1, -1, 0]
    const positions = [0, -0.5, 0, 0, -0.5, 1, 0, 0.5, 1, 0, -0.5, 0, 0, 0.5, 1, 0, 0.5, 0];
    //const uvs = [-1, 2, 1, 2, -1, 1, 1, 1, -1, -1, 1, -1, -1, -2, 1, -2]
    const index = [0, 2, 1, 2, 3, 1, 2, 4, 3, 4, 5, 3, 4, 6, 5, 6, 7, 5]

    //this.setIndex(index)
    this.setAttribute('position', new Float32BufferAttribute(positions, 3))
    //this.setAttribute('uv', new Float32BufferAttribute(uvs, 2))
  }

  applyMatrix4(matrix) {
    const start = this.attributes.instanceStart
    const end = this.attributes.instanceEnd

    if (start !== undefined) {
      start.applyMatrix4(matrix)

      end.applyMatrix4(matrix)

      start.needsUpdate = true
    }

    if (this.boundingBox !== null) {
      this.computeBoundingBox()
    }

    if (this.boundingSphere !== null) {
      this.computeBoundingSphere()
    }

    return this
  }

  setPositions(line_segments, start=0, end=null) {

    const buffer_array = new Float32Array(line_segments.length * 10);

    let show_start = start
    let show_end = end === null ? end : line_segments.length
    //if(viewControl.mode === 1){
    //  show_start = viewControl.start_layer
    //  show_end = 1
    //}else if(viewControl.mode === 2) {
    //  show_start = viewControl.start_layer
    //  show_end = viewControl.end_layer - viewControl.start_layer + 1
    //}

    for (let i = 0; i < show_end; i++) {
      // pointAの座標を設定
      buffer_array[i * 10 + 0] = line_segments[i+show_start].points[0].x;
      buffer_array[i * 10 + 1] = line_segments[i+show_start].points[0].y;
      buffer_array[i * 10 + 2] = line_segments[i+show_start].points[0].z;
      // pointBの座標を設定
      buffer_array[i * 10 + 3] = line_segments[i+show_start].points[1].x;
      buffer_array[i * 10 + 4] = line_segments[i+show_start].points[1].y;
      buffer_array[i * 10 + 5] = line_segments[i+show_start].points[1].z;

      const line_index = line_segments[i+show_start].index
      let line_color = line_segments[i+show_start].color
      //if( (selectedRow.from -1) <= line_index && line_index <= (selectedRow.to-1)){
      //  line_color = "#ffff00"
      //}
      const color = new Color(line_color);
      buffer_array[i * 10 + 6] = color.r;
      buffer_array[i * 10 + 7] = color.g;
      buffer_array[i * 10 + 8] = color.b;

      buffer_array[i * 10 + 9] = line_segments[i+show_start].width;
    }

    const instanceBuffer = new InstancedInterleavedBuffer(buffer_array, 10);

    this.setAttribute('pointA', new InterleavedBufferAttribute(instanceBuffer, 3, 0)); // オフセット0から開始
    this.setAttribute('pointB', new InterleavedBufferAttribute(instanceBuffer, 3, 3)); // オフセット3から開始
    this.setAttribute('color', new InterleavedBufferAttribute(instanceBuffer, 3, 6)); // オフセット3から開始
    this.setAttribute('width', new InterleavedBufferAttribute(instanceBuffer, 1, 9)); // オフセット3から開始


    //

    this.computeBoundingBox()
    this.computeBoundingSphere()

    return this
  }

  setColors(array, itemSize = 3) {
    let colors

    if (array instanceof Float32Array) {
      colors = array
    } else if (Array.isArray(array)) {
      colors = new Float32Array(array)
    }

    const instanceColorBuffer = new InstancedInterleavedBuffer(colors, itemSize * 2, 1) // rgb(a), rgb(a)

    this.setAttribute('instanceColorStart', new InterleavedBufferAttribute(instanceColorBuffer, itemSize, 0)) // rgb(a)
    this.setAttribute('instanceColorEnd', new InterleavedBufferAttribute(instanceColorBuffer, itemSize, itemSize)) // rgb(a)

    return this
  }

  /*
  fromWireframeGeometry(geometry) {
    this.setPositions(geometry.attributes.position.array)

    return this
  }

  fromEdgesGeometry(geometry) {
    this.setPositions(geometry.attributes.position.array)

    return this
  }

  fromMesh(mesh) {
    this.fromWireframeGeometry(new WireframeGeometry(mesh.geometry))

    // set colors, maybe

    return this
  }

  fromLineSegments(lineSegments) {
    const geometry = lineSegments.geometry

    this.setPositions(geometry.attributes.position.array) // assumes non-indexed

    // set colors, maybe

    return this
  }

  */

  computeBoundingBox() {
    if (this.boundingBox === null) {
      this.boundingBox = new Box3()
    }

    const start = this.attributes.pointA
    const end = this.attributes.pointB

    if (start !== undefined && end !== undefined) {
      this.boundingBox.setFromBufferAttribute(start)

      _box.setFromBufferAttribute(end)

      this.boundingBox.union(_box)
    }
  }

  computeBoundingSphere() {
    if (this.boundingSphere === null) {
      this.boundingSphere = new Sphere()
    }

    if (this.boundingBox === null) {
      this.computeBoundingBox()
    }

    const start = this.attributes.pointA
    const end = this.attributes.pointB

    if (start !== undefined && end !== undefined) {
      const center = this.boundingSphere.center

      this.boundingBox.getCenter(center)

      let maxRadiusSq = 0

      for (let i = 0, il = start.count; i < il; i++) {
        _vector.fromBufferAttribute(start, i)
        maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_vector))

        _vector.fromBufferAttribute(end, i)
        maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_vector))
      }

      this.boundingSphere.radius = Math.sqrt(maxRadiusSq)

      if (isNaN(this.boundingSphere.radius)) {
        console.error(
          'THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.',
          this,
        )
      }
    }
  }

  toJSON() {
    // todo
  }

  applyMatrix(matrix) {
    console.warn('THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4().')

    return this.applyMatrix4(matrix)
  }
}

export { LineSegments3Geometry }