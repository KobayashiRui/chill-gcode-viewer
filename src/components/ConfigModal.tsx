//import { useRecoilState } from "recoil"
//import { filamentConfigState } from "../atoms/ConfigState"
import useConfigStore from "../stores/configStore"
import { useShallow } from "zustand/react/shallow"

export default function ConfigModal(){

  //const [filamentConfig, setFilamentConfig] = useRecoilState(filamentConfigState)
  const [filamentConfig, setFilamentConfig] = useConfigStore(useShallow((state) => [state.filamentConfig, state.setFilamentConfig]))

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
