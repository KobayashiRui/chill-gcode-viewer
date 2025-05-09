import useViewSettingStore from "@/stores/ViewSettingStore"
//import useConfigStore from "@/stores/ConfigStore"

import FilamentConfig from "./FilamentConfig"
import PrinterConfig from "./PrinterConfig"
import ViewerConfig from "./ViewrConfig"

export default function ConfigModal(){

  //const [filamentConfig, setFilamentConfig] = useRecoilState(filamentConfigState)
  //const showConfigModal = useViewSettingStore((state)=>state.showConfigModal)
  const setShowConfigModal = useViewSettingStore((state)=>state.setShowConfigModal)

  const modalClose = () => {
    setShowConfigModal(false)
  }

  return (
    <dialog id="config_modal" className="modal">
      <div className="modal-box w-11/12 max-w-full h-5/6 max-h-full ">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={modalClose}>✕</button>
        </form>
        <h1 className="font-bold text-xl text-emerald-500 mb-4">Chill Gcode Viewer Config</h1>
        <div className="tabs tabs-lift">
          <input type="radio" name="my_tabs_3" className="tab" aria-label="Viewer" />
          <div className="tab-content">
            <ViewerConfig></ViewerConfig>
          </div>

          <input type="radio" name="my_tabs_3" className="tab" aria-label="Printer"  />
          <div className="tab-content">
            <PrinterConfig ></PrinterConfig>
          </div>

          <input type="radio" name="my_tabs_3" className="tab" aria-label="Filament" defaultChecked/>
          <div className="tab-content">
            <FilamentConfig></FilamentConfig>
          </div>

        </div>
      </div>
    </dialog>
  )
}
