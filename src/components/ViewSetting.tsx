//import { viewSettingState, viewCameraSettingState} from '../atoms/ViewSettingState';
import useViewSettingStore from '../stores/viewSettingStore';

import Orthographic from '../assets/orthographic.svg'
import Perspective from '../assets/perspective.svg'

import { useShallow } from 'zustand/react/shallow'


function ShowlineButton({line_type, title}:{line_type:string, title:string}) {
  const [lineViewState, setLineViewState] = useViewSettingStore(useShallow((state)=> [state.lineViewState, state.setLineViewState]))
  //const [cameraMode, setCameraMode] = useViewSettingStore((state)=> [state.cameraMode, state.setCameraMode])
  //const [viewSetting, setViewSetting] = useRecoilState(viewSettingState)
  //const [viewSetting, setViewSetting] = useViewSettingStore((state)=>[viewSettingState)
  
  const handleClick = () => {
    console.log('handleClick:', line_type)
    console.log(lineViewState[line_type])
    setLineViewState(line_type)
    //setViewSetting((prev:any)=>{
    //  let new_value = {...prev}
    //  new_value[line_type] = !new_value[line_type]
    //  return new_value
    //})
  }

  return (
    <>
      {
        lineViewState[line_type] ?
          <button className="btn btn-sm" onClick={handleClick}>{title}</button>
        :
          <button className="btn btn-sm btn-ghost border border-white" onClick={handleClick}>{title}</button>
      }
    </>
  )

}

export default function ViewSetting(){
  //const [cameraSetting, setCameraSetting] = useRecoilState(viewCameraSettingState)
  const [cameraMode, setCameraMode] = useViewSettingStore(useShallow((state)=> [state.cameraMode, state.setCameraMode]))

  return (
    <div className="absolute flex flex-col gap-2 bg-gray-200 m-4 rounded-md p-4 z-40">
      <div className="flex items-center">
      <img src={Perspective} className="w-8 h-8"></img>
      <input type="checkbox" className="toggle toggle-sm toggle-info" checked={cameraMode} onChange={(e)=>{setCameraMode(e.target.checked)}}/>
      <img src={Orthographic} className="w-8 h-8"></img>
      </div>
      <ShowlineButton line_type="moveLine" title="Move line"></ShowlineButton>
      <ShowlineButton line_type="extrudeLine" title="Extrude line"></ShowlineButton>
    </div>
  )

}