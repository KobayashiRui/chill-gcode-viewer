import { useRecoilState } from 'recoil';
import { viewSettingState, viewCameraSettingState} from '../atoms/ViewSetting';

import Orthographic from '../assets/orthographic.svg'
import Perspective from '../assets/perspective.svg'


function ShowlineButton({line_type, title}:{line_type:string, title:string}) {
  const [viewSetting, setViewSetting] = useRecoilState(viewSettingState)
  
  const handleClick = () => {
    console.log('handleClick')
    setViewSetting((prev:any)=>{
      let new_value = {...prev}
      new_value[line_type] = !new_value[line_type]
      return new_value
    })
  }

  return (
    <>
      {
        viewSetting[line_type] ?
          <button className="btn btn-sm" onClick={handleClick}>{title}</button>
        :
          <button className="btn btn-sm btn-ghost border border-white" onClick={handleClick}>{title}</button>
      }
    </>
  )

}

export default function ViewSetting(){
  const [cameraSetting, setCameraSetting] = useRecoilState(viewCameraSettingState)

  return (
    <div className="absolute flex flex-col gap-2 bg-gray-200 m-4 rounded-md p-4 z-40">
      <div className="flex items-center">
      <img src={Perspective} className="w-8 h-8"></img>
      <input type="checkbox" className="toggle toggle-sm toggle-info" checked={cameraSetting} onChange={(e)=>{setCameraSetting(e.target.checked)}}/>
      <img src={Orthographic} className="w-8 h-8"></img>
      </div>
      <ShowlineButton line_type="move_line" title="Move line"></ShowlineButton>
      <ShowlineButton line_type="extrude_line" title="Extrude line"></ShowlineButton>
    </div>
  )

}