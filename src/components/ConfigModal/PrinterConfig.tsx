import type { PrinterConfig, BedConfig, MoveConfig } from "@/stores/PrinterStore";
import usePrinterStore from "@/stores/PrinterStore";

import STLInput from "./STLInput";
import { useState, useReducer } from "react";
import { useShallow } from "zustand/react/shallow";
//import { remove } from "three/examples/jsm/libs/tween.module.js";

type BedConfigState = {
  xWidth: string;
  yWidth: string;
  xOffset: string;
  yOffset: string;
};
type BedConfigAction = 
  | {type: keyof BedConfigState, payload: string}
  | {type: "set", payload: BedConfigState}
  | {type: "reset"};

const initialBedConfig = {
  xWidth: "100",
  yWidth: "100",
  xOffset: "0",
  yOffset: "0",
};
function bedConfigReducer(
  state: BedConfigState,
  action: BedConfigAction
): BedConfigState {

  switch(action.type){
    case "reset":
      return initialBedConfig;
    case "set":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return {
        ...state,
        [action.type]: action.payload,
      };
  }
}

type MoveConfigState = {
  xMin: string;
  xMax: string;
  yMin: string;
  yMax: string;
  zHeight: string;
};
type MoveConfigAction = 
  | {type: keyof MoveConfigState, payload: string}
  | {type: "set", payload: MoveConfigState}
  | {type: "reset"};

const initialMoveConfig = {
  xMin: "0",
  xMax: "100",
  yMin: "0",
  yMax: "100",
  zHeight: "100",
};
function moveConfigReducer(
  state: MoveConfigState,
  action: MoveConfigAction
): MoveConfigState {
  switch(action.type){
    case "reset":
      return initialMoveConfig;
    case "set":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return {
        ...state,
        [action.type]: action.payload,
      };
  }
}

//TODO : 型の定義をもっとシンプルに
function transformData<T extends Record<string, string | number>>(
  config: Record<keyof T, string | number>
): T {
  const convertedConfig = {} as T;

  for (const key in config) {
    const value = config[key as keyof T];
    let new_value = (() => {
      switch(typeof value){
        case "number":{
          let new_value = String(config[key]);
          return new_value
        }
        case "string":{
          let new_value = Number(config[key]);
          if (isNaN(new_value)) {
            return 0.0;
          }
          return new_value
        }
      }
    })()
    convertedConfig[key as keyof T] = new_value as T[keyof T];
  }
  return convertedConfig;
}


export default function PrinterConfig() {
  const { printers, addPrinter, removePrinter, updatePrinter } = usePrinterStore(
    useShallow((state) => ({
      printers: state.printers,
      addPrinter: state.addPrinter,
      removePrinter: state.removePrinter,
      updatePrinter: state.updatePrinter,
    }))
  );

  const [printerId, setPrinterId] = useState<string>("");
  const [printerName, setPrinterName] = useState<string>("");
  const [headModel, setHeadModel] = useState<ArrayBuffer | null>(null);
  const [bedConfig, dispatchBedConfig] = useReducer(bedConfigReducer, initialBedConfig);
  const [moveConfig, dispatchMoveConfig] = useReducer(moveConfigReducer, initialMoveConfig);

  const handleChangePrinter = (uuid:string) => {
    console.log(uuid)
    if(uuid !== "") {
      try{
        const bed_config_state = transformData<BedConfigState>(printers[uuid].bedConfig);
        const move_config_state = transformData<MoveConfigState>(printers[uuid].moveConfig);

        setPrinterId(uuid)
        setHeadModel(printers[uuid].headModel);
        setPrinterName(printers[uuid].printerName);
        dispatchBedConfig({type: "set", payload: bed_config_state});
        dispatchMoveConfig({type: "set", payload: move_config_state});

      }catch(error){
        if(error instanceof Error) {
          console.error(error.message);
          alert(error.message); // ユーザーにエラーを通知
        }
      }
    }else{
      setPrinterId("");
      setPrinterName("");
      setHeadModel(null);
      dispatchBedConfig({type: "reset"});
      dispatchMoveConfig({type: "reset"});
    }
  }

  const handleAddPrinter = () => {
    try {
      // BedConfigとMoveConfigを検証してnumberに変換
      const validatedBedConfig = transformData<BedConfig>(bedConfig);
      const validatedMoveConfig = transformData<MoveConfig>(moveConfig);
      console.log(validatedBedConfig)
      console.log(validatedMoveConfig)

      // プリンターを追加
      const new_printer_id = addPrinter({
        printerName,
        bedConfig: validatedBedConfig,
        moveConfig: validatedMoveConfig,
        headModel: headModel,
      });
      console.log("Printer add successfully: ", new_printer_id);
      setPrinterId(new_printer_id);

    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        alert(error.message); // ユーザーにエラーを通知
      }
    }
  };

  const handleUpdatePrinter = () => {
    try {
      // BedConfigとMoveConfigを検証してnumberに変換
      const validatedBedConfig = transformData<BedConfig>(bedConfig);
      const validatedMoveConfig = transformData<MoveConfig>(moveConfig);
      console.log(validatedBedConfig)
      console.log(validatedMoveConfig)

      // プリンターを更新
      updatePrinter(printerId, {
        printerName,
        bedConfig: validatedBedConfig,
        moveConfig: validatedMoveConfig,
        headModel: headModel,
      })

      console.log("Printer update successfully!");
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        alert(error.message); // ユーザーにエラーを通知
      }
    }
  };

  const handleRemovePrinter = () => {
    removePrinter(printerId);
    setPrinterId("");
  }

  return (
    <div className="flex flex-row w-full">
      <div className="grow flex flex-col">
        <fieldset className="fieldset w-md">
          <legend className="fieldset-legend font-bold text-lg">Select Printer</legend>
          <select
            className="select select-primary"
            value={printerId}
            onChange={(e) => handleChangePrinter(e.target.value)}
          >
            <option value="">New Printer</option>
            {Object.keys(printers).map((uuid) => (
              <option key={uuid} value={uuid}>
                {printers[uuid].printerName}
              </option>
            ))}
          </select>
        </fieldset>

        <fieldset className="fieldset w-md">
          <legend className="fieldset-legend font-bold text-lg">Printer Name</legend>
          <input
            type="text"
            className="input"
            placeholder="Printer Name"
            value={printerName}
            onChange={(e) => setPrinterName(e.target.value)}
          />
        </fieldset>

        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-md w-border p-4">
          <legend className="fieldset-legend font-bold text-lg">Bed size</legend>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <div>
              <label className="label">X width</label>
              <input
                type="number"
                className="input"
                placeholder="100"
                value={bedConfig.xWidth}
                onChange={(e) =>
                  dispatchBedConfig({ type: "xWidth", payload: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label">Y width</label>
              <input
                type="number"
                className="input"
                placeholder="100"
                value={bedConfig.yWidth}
                onChange={(e) =>
                  dispatchBedConfig({ type: "yWidth", payload: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label">X Offset</label>
              <input
                type="number"
                className="input"
                placeholder="0"
                value={bedConfig.xOffset}
                onChange={(e) =>
                  dispatchBedConfig({ type: "xOffset", payload: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label">Y Offset</label>
              <input
                type="number"
                className="input"
                placeholder="0"
                value={bedConfig.yOffset}
                onChange={(e) =>
                  dispatchBedConfig({ type: "yOffset", payload: e.target.value })
                }
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-md border p-4">
          <legend className="fieldset-legend font-bold text-lg">Move size</legend>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <div>
              <label className="label">X Min</label>
              <input
                type="number"
                className="input"
                placeholder="0"
                value={moveConfig.xMin}
                onChange={(e) =>
                  dispatchMoveConfig({ type: "xMin", payload: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label">X Max</label>
              <input
                type="number"
                className="input"
                placeholder="100"
                value={moveConfig.xMax}
                onChange={(e) =>
                  dispatchMoveConfig({ type: "xMax", payload: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label">Y Min</label>
              <input
                type="number"
                className="input"
                placeholder="0"
                value={moveConfig.yMin}
                onChange={(e) =>
                  dispatchMoveConfig({ type: "yMin", payload: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label">Y Max</label>
              <input
                type="number"
                className="input"
                placeholder="100"
                value={moveConfig.yMax}
                onChange={(e) =>
                  dispatchMoveConfig({ type: "yMax", payload: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label">Z Height</label>
              <input
                type="number"
                className="input"
                placeholder="100"
                value={moveConfig.zHeight}
                onChange={(e) =>
                  dispatchMoveConfig({ type: "zHeight", payload: e.target.value })
                }
              />
            </div>
          </div>
        </fieldset>

        <div className="flex flex-row w-md gap-x-2 py-4">
          {printerId !== "" && (
            <button className="btn btn-accent" onClick={handleUpdatePrinter}>
              Update Printer
            </button>
          )}
          <button className="btn btn-success" onClick={handleAddPrinter}>
            Add New Printer
          </button>
          {printerId !== "" && (
            <button
              className="btn btn-error"
              onClick={handleRemovePrinter}
            >
              Delete This Printer
            </button>
          )}
        </div>
      </div>
      <div className="grow">
        <fieldset className="fieldset w-md">
          <legend className="fieldset-legend font-bold text-lg">Head Model</legend>
          <STLInput 
            headModel={headModel}
            setHeadModel={setHeadModel}
          ></STLInput>
        </fieldset>
      </div>
    </div>
  );
}