export default function ConfigModal(){

  return (
    <>
      <dialog id="config_modal" className="modal">
        <div className="modal-box w-11/12 max-w-full h-5/6 max-h-full bg-neutral-200 text-neutral-800">
          <h1 className="font-bold text-2xl text-emerald-500 mb-4">Chill Gcode Viewer Config</h1>
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
