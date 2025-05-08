
import { useRef, useEffect } from "react"
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { Canvas} from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei'
import { Vector3, Euler} from 'three'

import useGcodeStateStore from "../../stores/GcodeStore";

type STLInputProps = {
  headModel: ArrayBuffer | null;
  setHeadModel: (model: ArrayBuffer | null) => void;
}
export default function STLInput(props: STLInputProps){
  const {headModel, setHeadModel} = props

  const inputFileRef = useRef<HTMLInputElement>(null);

  const geometry = useGcodeStateStore((state)=>state.headGeometry)
  const setGeometry = useGcodeStateStore((state)=>state.setHeadGeometry)

  useEffect(()=>{
    if(headModel !== null){
      const stl_loader = new STLLoader()
      const geometry = stl_loader.parse(headModel);
      setGeometry(geometry)
    }else{
      setGeometry(null)
    }

  }, [headModel])

  const handleInputFile = (event:React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (!files || files?.length === 0) return;
    const file = files[0];

    const reader = new FileReader();
    // ファイル読み込み完了時に発火するリスナー
    reader.addEventListener("load", () => {
      console.log("load stl")
      console.log(reader.result)
      if(reader.result != null){
        setHeadModel(reader.result as ArrayBuffer)
        //const stl_loader = new STLLoader()
        //const geometry = stl_loader.parse(reader.result);
        //setGeometry(geometry)
      }

      event.target.value = "";
    });
    reader.readAsArrayBuffer(file)
  }

  

  return (
    <div>
      <button className="btn btn-ghost btn-sm m-1" onClick={() => inputFileRef.current?.click()} >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
        Load model
      </button>
      <input type="file" ref={inputFileRef} style={{ display: 'none' }} onChange={handleInputFile} />
      <Canvas 
          className="border-2 border-sky-500 rounded-md"
          style={{height: '500px', width: '80%'}}
        >

        <PerspectiveCamera makeDefault up={[0,0,1]} fov={75} position={new Vector3(100, 100, 100)} rotation={new Euler(1.0, 0.13, 0.08)} near={10} far={10000} />
        {
          geometry !== null &&
          <mesh geometry={geometry}>
            <meshStandardMaterial color="orange"></meshStandardMaterial>
          </mesh>
        }
        <ambientLight />
        <pointLight position={[100, 100, 100]} intensity={10000}/>
        <axesHelper args={[50]} />
        <OrbitControls makeDefault></OrbitControls>
      </Canvas>
    </div>
  )
}