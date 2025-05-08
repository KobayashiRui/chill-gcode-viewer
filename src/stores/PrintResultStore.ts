import type { PrinterConfig } from '@/stores/PrinterStore';
import type { FilamentConfig } from '@/stores/FilamentStore';
import {create} from 'zustand';
import {Vector3} from 'three';


export class BoundingBox{
  min: Vector3;
  max: Vector3;
  constructor(){
    this.min = new Vector3(0, 0, 0)
    this.max = new Vector3(0, 0, 0)
  }

  updatePoint(point: Vector3){
    this.min.x = Math.min(this.min.x, point.x)
    this.min.y = Math.min(this.min.y, point.y)
    this.min.z = Math.min(this.min.z, point.z)

    this.max.x = Math.max(this.max.x, point.x)
    this.max.y = Math.max(this.max.y, point.y)
    this.max.z = Math.max(this.max.z, point.z)
  }

}

type RangeError = {
  xRangeError: [boolean, boolean]; // "OK", "Min Error, Max Error" "Min OK, Max Error", 
  yRangeError: [boolean, boolean]; // "OK", "Min Error, Max Error" "Min OK, Max Error",
  zRangeError: [boolean, boolean]; // "OK", "Min Error, Max Error" "Min OK, Max Error",
}

type PrintResult = {
    printTime: number;
    filamentLength: number;
    filamentWeight: number;
    filamentReel: number;
    rangeError: RangeError;
    setPrintResult: (printer: PrinterConfig, filament: FilamentConfig, print_time:number, filament_length:number, move_bounding_box: BoundingBox) => void;
}


function moveRangeCheck(gcode_min:number, gcode_max:number, printer_min:number, printer_max:number): [boolean, boolean]{
  let min_error = false;
  let max_error = false;
  if(gcode_min < printer_min){
    min_error = true;
  }

  if(gcode_max > printer_max){
    max_error = true;
  }

  return [min_error, max_error]
}

const usePrintResultStore = create<PrintResult>()((set)=> ({
  printTime:0,
  filamentLength:0,
  filamentWeight:0,
  filamentReel: 0,
  rangeError: {xRangeError: [false, false], yRangeError: [false, false], zRangeError: [false, false]},
  setPrintResult: (printer, filament, print_time, filament_length, move_bounding_box) => {
    const filament_weight = (filament_length * filament.filamentDensity * Math.PI * Math.pow(filament.filamentDiameter / 2, 2)) / 1000;
    const filament_reel = filament_weight / filament.filamentReelWeight;
    const xrange_error = moveRangeCheck(move_bounding_box.min.x, move_bounding_box.max.x, printer.moveConfig.xMin, printer.moveConfig.xMax);
    const yrange_error = moveRangeCheck(move_bounding_box.min.y, move_bounding_box.max.y, printer.moveConfig.yMin, printer.moveConfig.yMax);
    const zrange_error = moveRangeCheck(move_bounding_box.min.z, move_bounding_box.max.z, printer.moveConfig.zHeight, printer.moveConfig.zHeight);

    set(() => ({
      printTime: print_time,
      filamentLength: filament_length,
      filamentWeight: filament_weight,
      filamentReel: filament_reel,
      rangeError: {
        xRangeError: xrange_error,
        yRangeError: yrange_error,
        zRangeError: zrange_error,
      }
    }))
  }

}))

export default usePrintResultStore