import React from "react"
import { Vector3} from "three";
import { useRecoilValue, useRecoilState} from "recoil"
import { gcodeState, viewerObjectsState} from '../atoms/GcodeState';


function GcodeToPath(){
  const gcodeData = useRecoilValue(gcodeState)
  const [viewerObjects, setViewerObjects] = useRecoilState(viewerObjectsState)

  const handleLoadGcodeToPath = () => {
    console.log("start gcode to path")

    let new_lines:any = {}

    let row_index = 0;
    const now_pos = new Vector3(0.0, 0.0, 0.0)
    let now_speed = 0.0
    let all_time = 0.0 //プリント造形時間(秒)

    const gcode_lines = gcodeData.split('\n')
    for(let i =0; i < gcode_lines.length; i++){
      const origin_line = gcode_lines[i].replace("\r","")
      if(origin_line.length != 0 ){
        //コメントの削除
        const comment_pos = origin_line.indexOf(';');
        const line = (comment_pos !== -1) ? origin_line.slice(0, comment_pos) : origin_line;
        if(line.length == 0){
          continue
        }
        
        //gコードの解析
        let gcode = line.split(' ')
        switch(gcode[0]){
          case "G1": {
            let target_pos = now_pos.clone() 
            let new_e = 0.0;

            const find_x = gcode.find((e:string) => e.includes("X"));
            if(find_x) {
              target_pos = target_pos.setX(Number(find_x.replace("X", "")))
            }

            const find_y = gcode.find((e:string) => e.includes("Y"));
            if(find_y) {
              target_pos = target_pos.setY(Number(find_y.replace("Y", "")))
            }
            const find_z = gcode.find((e:string) => e.includes("Z"));
            if(find_z) {
              target_pos = target_pos.setZ(Number(find_z.replace("Z", "")))
            }
            const find_e = gcode.find((e:string) => e.includes("E"));
            if(find_e) {
              new_e = Number(find_e.replace("E", ""))
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
            new_lines[i] = {"type": 0, "data": [now_pos.clone(), target_pos.clone()]}
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
        }
      }
    }

    console.log("new lines: ", new_lines)
    setViewerObjects(new_lines)
    console.log("All time: " + all_time)
    console.log("end gcode to path")

  }

  return (
    <button className="btn btn-secondary btn-sm m-1" onClick={handleLoadGcodeToPath}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
      Load Path
    </button>
  )
}

export default GcodeToPath