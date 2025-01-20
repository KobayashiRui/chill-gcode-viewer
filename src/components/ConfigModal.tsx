import {useState, useRef, useEffect} from "react"
import useConfigStore from "../stores/configStore"
import { useShallow } from "zustand/react/shallow"
import {STLLoader} from 'three/examples/jsm/loaders/STLLoader';
import { Canvas} from '@react-three/fiber'
import { OrthographicCamera, PerspectiveCamera, Grid, OrbitControls, GizmoHelper, GizmoViewport} from '@react-three/drei'
import {Vector3, Euler, Mesh, MeshStandardMaterial} from 'three'

import useGcodeStateStore from "../stores/gcodeStore";


function STLInput({dialogOpen}: {dialogOpen: boolean}){
  const inputFileRef = useRef<HTMLInputElement>(null);

  const headMesh = useGcodeStateStore((state)=>state.headMesh)
  const setHeadMesh = useGcodeStateStore((state)=>state.setHeadMesh)

  const handleInputFile = (event:React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (!files || files?.length === 0) return;
    const file = files[0];

    const reader = new FileReader();
    // ファイル読み込み完了時に発火するリスナー
    reader.addEventListener("load", () => {
      console.log("load stl")
      console.log(reader.result)
      const stl_loader = new STLLoader()
      const geometry = stl_loader.parse(reader.result);
      console.log(geometry)
      //setGeometry(geometry)
      const mesh = new Mesh()
      mesh.geometry = geometry
      mesh.material = new MeshStandardMaterial({color:"red", wireframe:false})
      setHeadMesh(mesh)

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
          headMesh !== null &&
          <primitive object={headMesh}></primitive>
          //<mesh geometry={geometry}>
          //  <meshStandardMaterial color="orange"></meshStandardMaterial>
          //</mesh>
        }
        <ambientLight />
        <pointLight position={[100, 100, 100]} intensity={10000}/>
        <axesHelper args={[50]} />
        <OrbitControls makeDefault></OrbitControls>
      </Canvas>
    </div>
  )
}

export default function ConfigModal(){
  const [filamentConfig, setFilamentConfig] = useConfigStore(useShallow((state) => [state.filamentConfig, state.setFilamentConfig]))
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(()=>{
    const dialogElement = document.getElementById("config_modal")

    const observer = new MutationObserver(() => {
      if (dialogElement?.hasAttribute('open')) {
        console.log("show")
        setDialogOpen(true); // ダイアログが開いた
      } else {
        console.log("close")
        setDialogOpen(false); // ダイアログが閉じた
      }
    });

    // `open`属性の変更を監視
    if (dialogElement) {
      observer.observe(dialogElement, { attributes: true });
    }

    // クリーンアップ処理
    return () => {
      observer.disconnect();
    };
  },[])

  return (
      <dialog id="config_modal" className="modal">
        <div className="modal-box w-11/12 max-w-full h-5/6 max-h-full bg-neutral-200 text-neutral-800">
          <h1 className="font-bold text-2xl text-emerald-500 mb-4">Chill Gcode Viewer Config</h1>
          <div className="grid grid-cols-3">
            <div>
              {/* フィラメント設定 */}
              <h2 className="font-bold text-lg mb-2">Filament setting</h2>
              <table className="table-auto border-separate w-auto border-spacing-y-2">
                <tbody>
                  <tr className="border-b border-emerald-400">
                    <td className="font-bold">Filament diameter</td>
                    <td className="flex flex-row items-center">
                      <input className="input input-bordered input-primary input-sm w-20 max-w-xs bg-gray-200 ml-2 mr-1"
                        value={filamentConfig.filamentDiameter}
                        onChange={(e:any)=>{setFilamentConfig("filamentDiameter", e.target.value)}}
                      ></input>
                      <div>mm</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold">Filament density</td>
                    <td className="flex flex-row items-center">
                      <input className="input input-bordered input-primary input-sm w-20 max-w-xs bg-gray-200 ml-2 mr-1"
                        value={filamentConfig.filamentDensity}
                        onChange={(e:any)=>{setFilamentConfig("filamentDensity", e.target.value)}}
                      ></input>
                      <div>g/cm3</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold">Filament cost</td>
                    <td className="flex flex-row items-center">
                      <input className="input input-bordered input-primary input-sm w-20 max-w-xs bg-gray-200 ml-2 mr-1"
                        value={filamentConfig.filamentCost}
                        onChange={(e:any)=>{setFilamentConfig("filamentCost", e.target.value)}}
                      ></input>
                      <div>円/kg</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold">Filament reel weight</td>
                    <td className="flex flex-row items-center">
                      <input className="input input-bordered input-primary input-sm w-20 max-w-xs bg-gray-200 ml-2 mr-1"
                        value={filamentConfig.filamentReelWeight}
                        onChange={(e:any)=>{setFilamentConfig("filamentReelWeight", e.target.value)}}
                      ></input>
                      <div>g/reel</div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <h2 className="font-bold text-lg mb-2">Printer size</h2>
              <table className="table-auto border-separate w-auto border-spacing-y-2">
                <tbody>
                  <tr className="border-b border-emerald-400">
                    <td className="font-bold">X min</td>
                    <td className="flex flex-row items-center">
                      <input className="input input-bordered input-primary input-sm w-20 max-w-xs bg-gray-200 ml-2 mr-1"></input>
                      <div>mm</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold">X max</td>
                    <td className="flex flex-row items-center">
                      <input className="input input-bordered input-primary input-sm w-20 max-w-xs bg-gray-200 ml-2 mr-1"></input>
                      <div>mm</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold">Y min</td>
                    <td className="flex flex-row items-center">
                      <input className="input input-bordered input-primary input-sm w-20 max-w-xs bg-gray-200 ml-2 mr-1"></input>
                      <div>mm</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold">Y max</td>
                    <td className="flex flex-row items-center">
                      <input className="input input-bordered input-primary input-sm w-20 max-w-xs bg-gray-200 ml-2 mr-1"></input>
                      <div>mm</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold">Z min</td>
                    <td className="flex flex-row items-center">
                      <input className="input input-bordered input-primary input-sm w-20 max-w-xs bg-gray-200 ml-2 mr-1"></input>
                      <div>mm</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold">Z max</td>
                    <td className="flex flex-row items-center">
                      <input className="input input-bordered input-primary input-sm w-20 max-w-xs bg-gray-200 ml-2 mr-1"></input>
                      <div>mm</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h2 className="font-bold text-lg mb-2">Head model</h2>
              {
                //TODO: この方法だとラグが発生するので修正する
                dialogOpen &&
                <STLInput
                  dialogOpen={dialogOpen}
                ></STLInput>
              }

            </div>
          </div>
          <div className="mb-4 bor">
            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
  )

}
