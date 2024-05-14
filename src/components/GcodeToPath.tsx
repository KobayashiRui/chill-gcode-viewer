import {Vector3} from 'three';
import { useRecoilValue, useRecoilState} from "recoil"
import { gcodeState, viewerObjectsState, printResultState, viewControlState} from '../atoms/GcodeState';

//function getPositions(pos_list: Vector3[]){
//  let new_positions:number[] = []
//  for(let i = 0; i < pos_list.length; i++){
//    new_positions = new_positions.concat(pos_list[i].toArray())
//  }
//
//  return new Float32Array(new_positions)
//}

function GcodeToPath(){
  const gcodeData = useRecoilValue(gcodeState)
  const [_viewerObjects, setViewerObjects] = useRecoilState(viewerObjectsState)
  const [_printResult, setPrintResult] = useRecoilState(printResultState)
  const [_viewControl, setViewControl] = useRecoilState(viewControlState)

  const handleLoadGcodeToPath = () => {
    console.log("start gcode to path")

    //reset viewer control
    setViewControl({mode:0, start_layer:0, end_layer:0})

    let new_lines:any = []

    //let row_index = 0;
    let now_pos = new Vector3(0.0, 0.0, 0.0)
    let now_e = 0.0

    let now_speed = 0.0
    let all_time = 0.0 //プリント造形時間(秒)
    let filament_length = 0.0
    let pos_absolute = true // 0: absolute, 1: relative
    let e_absolute = true 

    const gcode_lines = gcodeData.split('\n')
    for(let i =0; i < gcode_lines.length; i++){
      const origin_line = gcode_lines[i].replace("\r","")
      if(origin_line.length != 0 ){
        //コメントの削除
        const comment_pos = origin_line.indexOf(';');
        const line = (comment_pos !== -1) ? origin_line.slice(0, comment_pos) : origin_line;
        if(line.length === 0){
          continue
        }
        
        //gコードの解析
        let gcode = line.split(' ')
        switch(gcode[0]){
          case "G0":
          case "G1": {
            let target_pos = now_pos.clone() 
            let new_e = 0.0;

            const find_x = gcode.find((e:string) => e.includes("X"));
            if(find_x) {
              if(pos_absolute){
                target_pos = target_pos.setX(Number(find_x.replace("X", "")))
              }else{
                target_pos = target_pos.setX( now_pos.x + Number(find_x.replace("X", "")))
              }
            }

            const find_y = gcode.find((e:string) => e.includes("Y"));
            if(find_y) {
              if(pos_absolute){
                target_pos = target_pos.setY(Number(find_y.replace("Y", "")))
              }else{
                target_pos = target_pos.setY( now_pos.y + Number(find_y.replace("Y", "")))
              }
            }
            const find_z = gcode.find((e:string) => e.includes("Z"));
            if(find_z) {
              if(pos_absolute){
                target_pos = target_pos.setZ(Number(find_z.replace("Z", "")))
              }else{
                target_pos = target_pos.setZ(now_pos.z + Number(find_z.replace("Z", "")))
              }
            }
            const find_e = gcode.find((e:string) => e.includes("E"));
            if(find_e) {
              if(e_absolute){
                new_e = Number(find_e.replace("E", "")) - now_e
              }else{
                new_e = Number(find_e.replace("E", ""))
              }
            }
            const find_f = gcode.find((e:string) => e.includes("F"));
            if(find_f){
              now_speed = Number(find_f.replace("F", "")) / 60.0
            }

            //移動がなく、エクストルードのみの場合
            if(target_pos.x==now_pos.x && target_pos.y==now_pos.y && target_pos.z==now_pos.z && new_e != 0.0){
                all_time += (new_e / now_speed);
                break;
            }

            const move_vec = new Vector3();
            move_vec.subVectors(target_pos, now_pos)
            let move_length = move_vec.length();
            let time = move_length / now_speed; // time sec
            all_time += time;
            filament_length += new_e
            now_e += new_e

            const line_color = new_e > 0.0 ? "#3cb371" : "#ff69b4"
            const line_width = new_e > 0.0 ? 5.0 : 1.0
            new_lines.push({"index": i, "type": 0, "points": [now_pos.clone(), target_pos.clone()], "color": line_color, "width": line_width })
            now_pos.copy(target_pos);
          break;
          }
          case "G4": {
            let p = 0.0
            let s = 0.0

            const find_p = gcode.find((e:string) => e.includes("P"));
            if(find_p) {
              p = Number(find_p.replace("P", ""))
            }
            const find_s = gcode.find((e:string) => e.includes("S"));
            if(find_s) {
              p = Number(find_s.replace("S", ""))
            }
            all_time += (p*0.001) + s;
            break;
          }
          case "G90": { //absolute position mode
            pos_absolute = true
            e_absolute = true
            break;
          }
          case "G91": { //relative position mode
            pos_absolute = false
            e_absolute = false
            break;
          }
          case "G92":{ //座標のリセット
            const find_x = gcode.find((e:string) => e.includes("X"));
            if(find_x) {
              now_pos = now_pos.setX(Number(find_x.replace("X", "")))
            }

            const find_y = gcode.find((e:string) => e.includes("Y"));
            if(find_y) {
              now_pos = now_pos.setY(Number(find_y.replace("Y", "")))
            }

            const find_z = gcode.find((e:string) => e.includes("Z"));
            if(find_z) {
              now_pos = now_pos.setZ(Number(find_z.replace("Z", "")))
            }

            const find_e = gcode.find((e:string) => e.includes("E"));
            if(find_e) {
              now_e = Number(find_e.replace("E", ""))
            }
            break;
          }
          case "M82": { //E Absolute
            e_absolute = true
            break;
          }
          case "M83": { //E Relative
            e_absolute = false
            break;
          }
          default: {
            break;
          }
        }
      }
    }
    //console.log("new lines: ", new_lines)
    setViewerObjects(new_lines)
    //console.log("All time: " + all_time)
    setPrintResult({print_time: all_time, filament_length: filament_length, filament_weight: 0})
    console.log("end gcode to path")


  }

  return (
    <button className="btn btn-ghost btn-xs m-1" onClick={handleLoadGcodeToPath}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
      Load Path
    </button>
  )
}

export default GcodeToPath