
import { useRecoilValue, useRecoilState } from 'recoil';
import { viewSettingState } from '../atoms/ViewSetting';


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

  return (
    <div className="absolute flex flex-col gap-2 bg-gray-200 m-4 rounded-md p-4 z-40">
      <ShowlineButton line_type="move_line" title="Move line"></ShowlineButton>
      <ShowlineButton line_type="extrude_line" title="Extrude line"></ShowlineButton>
    </div>
  )

}