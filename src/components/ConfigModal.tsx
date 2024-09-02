import { useRecoilState } from "recoil"
import { filamentConfigState } from "../atoms/ConfigState"

export default function ConfigModal(){

  const [filamentConfig, setFilamentConfig] = useRecoilState(filamentConfigState)

  const handleChangeFilamentConfig = (fkey: string, value:any) =>{
    setFilamentConfig((prov:any)=>{
      const new_value = {...prov}
      new_value[fkey] = value
      return new_value
    })

  }


  return (
    <>
      <dialog id="config_modal" className="modal">
        <div className="modal-box w-11/12 max-w-full h-5/6 max-h-full bg-neutral-200 text-neutral-800">
        <div className="mb-4 bor">
          <h1 className="font-bold text-2xl text-emerald-500 mb-4">Chill Gcode Viewer Config</h1>
          {/* フィラメント設定 */}
          <h2 className="font-bold text-lg mb-2">Filament setting</h2>
          <table className="table-auto border-separate w-auto border-spacing-y-2">
            <tbody>
              <tr className="border-b border-emerald-400">
                <td className="font-bold">Filament diameter</td>
                <td className="flex flex-row items-center">
                  <input className="input input-bordered input-primary input-sm w-20 max-w-xs bg-gray-200 ml-2 mr-1"
                    value={filamentConfig.filament_diameter}
                    onChange={(e:any)=>{handleChangeFilamentConfig("filament_diameter", e.target.value)}}
                  ></input>
                  <div>mm</div>
                </td>
              </tr>
              <tr>
                <td className="font-bold">Filament density</td>
                <td className="flex flex-row items-center">
                  <input className="input input-bordered input-primary input-sm w-20 max-w-xs bg-gray-200 ml-2 mr-1"
                    value={filamentConfig.filament_density}
                    onChange={(e:any)=>{handleChangeFilamentConfig("filament_density", e.target.value)}}
                  ></input>
                  <div>g/cm3</div>
                </td>
              </tr>
              <tr>
                <td className="font-bold">Filament cost</td>
                <td className="flex flex-row items-center">
                  <input className="input input-bordered input-primary input-sm w-20 max-w-xs bg-gray-200 ml-2 mr-1"
                    value={filamentConfig.filament_cost}
                    onChange={(e:any)=>{handleChangeFilamentConfig("filament_cost", e.target.value)}}
                  ></input>
                  <div>円/kg</div>
                </td>
              </tr>
              <tr>
                <td className="font-bold">Filament reel weight</td>
                <td className="flex flex-row items-center">
                  <input className="input input-bordered input-primary input-sm w-20 max-w-xs bg-gray-200 ml-2 mr-1"
                    value={filamentConfig.filament_reel_weight}
                    onChange={(e:any)=>{handleChangeFilamentConfig("filament_reel_weight", e.target.value)}}
                  ></input>
                  <div>g/reel</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

          {/* プリンター設定の選択 */}
          {/* プリンターサイズの設定 */}
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

          <p className="py-4">Click the button below to close</p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  )

}
