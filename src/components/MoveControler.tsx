import useGcodeStateStore from "../stores/gcodeStore"
import { useShallow } from "zustand/react/shallow"

function MoveControler(){
	const [enableHead, setEnableHead] = useGcodeStateStore(useShallow((state)=>[state.enableHead, state.setEnableHead]))

  return (
    <div className="absolute bottom-2 flex flex-col gap-2 bg-gray-200 m-4 rounded-md p-4 z-40">
			<h2 className="text-gray-900 font-bold">Move Controler</h2>
    	<label className="label p-0.5 cursor-pointer">
    	  <span className="label-text mr-2 text-gray-800">Show Head</span> 
    	  <input type="checkbox" className="toggle toggle-info" checked={enableHead} onChange={(e)=>{setEnableHead(e.target.checked)}}/>
    	</label>
    </div>
  )
}

export default MoveControler