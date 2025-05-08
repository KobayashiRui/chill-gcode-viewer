import {Vector3} from 'three';
import { useMemo } from 'react';
//import { useRecoilValue, useRecoilState} from "recoil"
//import { gcodeState, viewerObjectsState, printResultState, viewControlState} from '../atoms/GcodeState';
import useGcodeStateStore from '@/stores/GcodeStore';
import useConfigStore from '@/stores/ConfigStore';

import usePrinterStore from '@/stores/PrinterStore';
import useFilamentStore from '@/stores/FilamentStore';
import usePrintResultStore, {BoundingBox} from '@/stores/PrintResultStore';
import useViewSettingStore from '@/stores/ViewSettingStore';


//TODO: support Z, E
class ArcSupport{
  resolution: number;
  constructor(){
    this.resolution = 1.0
  }
  arcToSegments(start_pos: Vector3, target_pos:Vector3, offset:[number, number], clockwise=true): Vector3[][]{
    const r_p = -offset[0]
    const r_q = -offset[1]
    const center_p = start_pos.x - r_p
    const center_q = start_pos.y - r_q

    const rt_p = target_pos.x - center_p
    const rt_q = target_pos.y - center_q

    let angular_travel = Math.atan2(r_p * rt_q - r_q * rt_p, 
                                      r_p * rt_p + r_q * rt_q)
    if (angular_travel < 0.0) {
      angular_travel += 2.0 * Math.PI
    }

    if (clockwise) {
      angular_travel -= 2.0 * Math.PI
    }

    if(angular_travel === 0.0 
        && start_pos.x === target_pos.x 
        && start_pos.y === target_pos.y)
    {
        angular_travel = 2.0 * Math.PI

    }
    
    const radius = Math.hypot(r_p, r_q)
    if(radius != 6){
      console.log(`r_p:${r_p}, r_q:${r_q} `)
      console.log(radius)
    }
    const flat_mm = radius * angular_travel
    const mm_of_travel = Math.abs(flat_mm)

    const segment_num = Math.max(1., Math.floor(mm_of_travel / this.resolution))
    const theta_per_segment = angular_travel / segment_num;

    const segment_list = []
    let current_pos = start_pos.clone();
    for(let i=1; i<segment_num+1; i++){
      const c_theta = i * theta_per_segment
      const cos_ti = Math.cos(c_theta)
      const sin_ti = Math.sin(c_theta)
      const _r_p = -offset[0] * cos_ti + offset[1] * sin_ti
      const _r_q = -offset[0] * sin_ti - offset[1] * cos_ti

      let next_pos = current_pos.clone()
      if(i === segment_num){
        next_pos = target_pos.clone()
      }else{
        next_pos.x = center_p + _r_p
        next_pos.y = center_q + _r_q
      }
      segment_list.push([current_pos.clone(), next_pos.clone()])
      current_pos = next_pos
    }
    return segment_list
  }
}


function GcodeToPath(){
  //const gcodeData = useRecoilValue(gcodeState)
  const gcodeData = useGcodeStateStore((state)=> state.gcodeData)
  //const [_viewerObjects, setViewerObjects] = useRecoilState(viewerObjectsState)
  //const [_printResult, setPrintResult] = useRecoilState(printResultState)
  //const [_viewControl, setViewControl] = useRecoilState(viewControlState)

  const setViewerObjects = useGcodeStateStore((state) => state.setViewerObjects)
  //const setPrintResult = useGcodeStateStore((state) => state.setPrintResult)
  const setPrintResult = usePrintResultStore((state) => state.setPrintResult)
  const resetViewControl = useGcodeStateStore((state) => state.resetViewControl)

  const printerList = usePrinterStore((state) => state.printers)
  const usePrinterId = useConfigStore((state) => state.usePrinterId)
  const printer = useMemo(() => printerList[usePrinterId], [printerList, usePrinterId])

  const filamentList = useFilamentStore((state) => state.filaments)
  const useFilamentId = useConfigStore((state) => state.useFilamentId)
  const filament = useMemo(() => filamentList[useFilamentId], [filamentList, useFilamentId])



  const handleLoadGcodeToPath = () => {
    console.log("start gcode to path")

    //reset viewer control
    resetViewControl()

    let new_lines:any = []

    //let row_index = 0;
    let now_pos = new Vector3(0.0, 0.0, 0.0)
    let now_e = 0.0

    let now_speed = 0.0
    let all_time = 0.0 //プリント造形時間(秒)
    let filament_length = 0.0
    let pos_absolute = true // 0: absolute, 1: relative
    let e_absolute = true 

    let bounding_box = new BoundingBox()

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
            const line_width = new_e > 0.0 ? 2.0 : 0.5
            const type = new_e > 0.0 ? 1 : 0
            new_lines.push({"index": i, "type": type, "points": [[now_pos.clone(), target_pos.clone()]], "color": line_color, "width": line_width })
            now_pos.copy(target_pos);

            //TODO: check bounding box
            bounding_box.updatePoint(now_pos)

            break;
          }
          case "G2": {
            //G2 X-369.398 Y612.496 I-6.0 J-0.0 F3000.0 
            const start_pos = now_pos.clone();
            let target_pos = now_pos.clone();
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

            const offsets:[number,number] = [0.0, 0.0]
            const find_offset_i = gcode.find((e:string) => e.includes("I"));
            if(find_offset_i) {
              offsets[0] = Number(find_offset_i.replace("I", ""))
            }
            const find_offset_j = gcode.find((e:string) => e.includes("J"));
            if(find_offset_j) {
              offsets[1] = Number(find_offset_j.replace("J", ""))
            }

            const find_f = gcode.find((e:string) => e.includes("F"));
            if(find_f){
              now_speed = Number(find_f.replace("F", "")) / 60.0
            }

            const arc_support = new ArcSupport()
            const line_segments= arc_support.arcToSegments(start_pos, target_pos, offsets, true)

            for(let j=0; j<line_segments.length; j++) {
              const move_vec = new Vector3();
              const segment = line_segments[j];
              move_vec.subVectors(segment[1], segment[0])
              let move_length = move_vec.length();
              let time = move_length / now_speed; // time sec
              all_time += time;
            }

            const line_color =  "#ff69b4"
            const line_width =  0.5
            const type = 0
            console.log("G2 index:",i)
            new_lines.push({"index": i, "type": type, "points": line_segments, "color": line_color, "width": line_width })

            //now_pos.copy(target_pos);
            now_pos.copy(target_pos)

            //TODO: check bounding box
            bounding_box.updatePoint(now_pos)
            
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
    setViewerObjects(new_lines)
    //setPrintResult({printTime: all_time, filamentLength: filament_length, filamentWeight: 0})
    setPrintResult(
      printer, filament,
      all_time, filament_length, bounding_box
    )
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