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

  calcLineSegmentsBuffer(line_segments){
    let count_buffer = 0
    for(let i=0; i<line_segments.length; i++){
      count_buffer += line_segments[i].points.length
    }
    return count_buffer
  }

  setPositions(line_segments, start=0, end=null, selected_row, view_setting=null) {

    const buffer_size = this.calcLineSegmentsBuffer(line_segments)

    const buffer_array = new Float32Array(buffer_size * 11);

    let show_start = start
    if(show_start >= line_segments.length){
      show_start = line_segments
    }
    let show_end = end === null ? line_segments.length : end
    if(show_end >= line_segments.length){
      show_end = line_segments.length
    }

    console.log(line_segments)
    console.log("view_setting:", view_setting)
  
    let type_show = [true, true]
    if(view_setting !== null){
      if(!view_setting.moveLine){
        type_show[0] = false
      }
      if(!view_setting.extrudeLine){
        type_show[1] = false
      }
    }

    let buffer_count = 0
    for (let i = 0; i < show_end; i++) {
      if(!type_show[line_segments[i+show_start].type]){
        continue
      }
      const line_segment = line_segments[i+show_start]
      for(let p_index = 0; p_index < line_segment.points.length; p_index++) {
        const line_point = line_segment.points[p_index]

        // pointAの座標を設定
        const buffer_attr =  buffer_count * 11
        buffer_array[buffer_attr + 0] = line_point[0].x;
        buffer_array[buffer_attr + 1] = line_point[0].y;
        buffer_array[buffer_attr + 2] = line_point[0].z;
        // pointBの座標を設定
        buffer_array[buffer_attr + 3] = line_point[1].x;
        buffer_array[buffer_attr + 4] = line_point[1].y;
        buffer_array[buffer_attr + 5] = line_point[1].z;

        const line_index = line_segment.index
        let line_color = line_segment.color
        let line_width = line_segment.width
      
        if(selected_row && (selected_row.from -1) <= line_index && line_index <= (selected_row.to-1)){
          line_color = "#ffff00"
          line_width = 8
        }
        const color = new Color(line_color);
        buffer_array[buffer_attr + 6] = color.r;
        buffer_array[buffer_attr + 7] = color.g;
        buffer_array[buffer_attr + 8] = color.b;

        buffer_array[buffer_attr + 9] = line_width;
        buffer_array[buffer_attr + 10] = i
        buffer_count += 1
      }
    }

    const instanceBuffer = new InstancedInterleavedBuffer(buffer_array, 11);

    this.setAttribute('pointA', new InterleavedBufferAttribute(instanceBuffer, 3, 0)); // オフセット0から開始
    this.setAttribute('pointB', new InterleavedBufferAttribute(instanceBuffer, 3, 3)); // オフセット3から開始
    this.setAttribute('color', new InterleavedBufferAttribute(instanceBuffer, 3, 6)); // オフセット3から開始
    this.setAttribute('width', new InterleavedBufferAttribute(instanceBuffer, 1, 9)); // オフセット3から開始
    this.setAttribute('lineIndex', new InterleavedBufferAttribute(instanceBuffer, 1, 10)); // オフセット3から開始


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