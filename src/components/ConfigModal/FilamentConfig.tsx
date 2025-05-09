import { useState, useRef } from "react";
import useFilamentStore from "@/stores/FilamentStore";
import { useShallow } from "zustand/react/shallow";
import { ExportJsonFile, ImportJsonFile } from "@/utils/fileIO";

function transformData(value: number): string;
function transformData(value: string): number;
// 実装
function transformData(value: string | number): string | number {
  if (typeof value === "number") {
    // 数値を文字列に変換
    return String(value);
  }else {
    // 文字列を数値に変換
    const parsedValue = Number(value);
    if (isNaN(parsedValue)) {
      return 0.0;
    }else{
      return parsedValue; // 文字列を数値に変換
    }
  }
}

export default function FilamentConfig(){
  const {filaments, addFilament, removeFilament, updateFilament, exportFilamentJson, importFilamentJson} = useFilamentStore(
    useShallow((state) => ({
      filaments: state.filaments,
      addFilament: state.addFilament,
      removeFilament: state.removeFilament,
      updateFilament: state.updateFilament,
      exportFilamentJson: state.exportFilamentJson,
      importFilamentJson: state.importFilamentJson,
    }))
  );

  const inputJsonFileRef = useRef<HTMLInputElement>(null);

  const [filamentId, setFilamentId] = useState<string>("");
  const [filamentName, setFilamentName] = useState<string>("");
  const [filamentDiameter, setFilamentDiameter] = useState<string>("");
  const [filamentDensity, setFilamentDensity] = useState<string>("");
  const [filamentCost, setFilamentCost] = useState<string>("");
  const [filamentReelWeight, setFilamentReelWeight] = useState<string>("");

  const handleChangeFilament = (uuid:string) => {
    if(uuid !== ""){
      setFilamentId(uuid);
      setFilamentName(filaments[uuid].filamentName);
      setFilamentDiameter(transformData(filaments[uuid].filamentDiameter));
      setFilamentDensity(transformData(filaments[uuid].filamentDensity));
      setFilamentCost(transformData(filaments[uuid].filamentCost));
      setFilamentReelWeight(transformData(filaments[uuid].filamentReelWeight));
    }else{
      setFilamentId("");
      setFilamentName("");
      setFilamentDiameter("");
      setFilamentDensity("");
      setFilamentCost("");
      setFilamentReelWeight("");
    }
  }

  const handleAddFilament = () => {
    try{
      const new_filament_id = addFilament({
        filamentName,
        filamentDiameter: transformData(filamentDiameter),
        filamentDensity: transformData(filamentDensity),
        filamentCost: transformData(filamentCost),
        filamentReelWeight:transformData(filamentReelWeight)
      })
      setFilamentId(new_filament_id);
    } catch(error) {
      if (error instanceof Error) {
        console.error(error.message);
        alert(error.message); // ユーザーにエラーを通知
      }
    }
  }

  const handleUpdateFilament = () => {
    try{
      updateFilament(filamentId, {
        filamentName,
        filamentDiameter: transformData(filamentDiameter),
        filamentDensity: transformData(filamentDensity),
        filamentCost: transformData(filamentCost),
        filamentReelWeight:transformData(filamentReelWeight)
      })
    } catch(error) {
      if (error instanceof Error) {
        console.error(error.message);
        alert(error.message); // ユーザーにエラーを通知
      }
    }
  }

  const handleRemoveFilament = () => {
    removeFilament(filamentId)
    handleChangeFilament("")
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Import")
    const json_data = await ImportJsonFile(event)
    console.log(json_data)
    importFilamentJson(json_data)
  }

  const handleAllExport = () => {
    console.log("All export")
    const json_data = exportFilamentJson(null)
    console.log(json_data)
    ExportJsonFile(json_data, "all_printer")

  }

  const handleSelectedExport = () => {
    console.log("Select export")
    console.log(filaments[filamentId])
    const json_data = exportFilamentJson(filamentId)
    console.log(json_data)
    ExportJsonFile(json_data, filamentName)
  }

  
  return(
    <div className="flex w-full">
      <div className="grow flex flex-col">
        <div className="flex flex-row gap-2 my-2">
          <button className="btn btn-xs btn-soft btn-accent" onClick={()=>inputJsonFileRef.current?.click()}>Import</button>
          <button className="btn btn-xs btn-soft btn-primary" onClick={handleAllExport}>ALL Export</button>
          <button className="btn btn-xs btn-soft btn-secondary" onClick={handleSelectedExport}>Selected Export</button>
          <input type="file" ref={inputJsonFileRef} accept=".json" style={{ display: 'none' }} onChange={handleImport} />
        </div>
        <fieldset className="fieldset w-md">
          <legend className="fieldset-legend font-bold">Selet Filament</legend>
          <select
            className="select select-sm select-primary"
            value={filamentId}
            onChange={(e) => handleChangeFilament(e.target.value)}
          >
            <option value="">New Filament</option>
            {Object.keys(filaments).map((uuid) => (
              <option key={uuid} value={uuid}>
                {filaments[uuid].filamentName}
              </option>
            ))}
          </select>
        </fieldset>

        <fieldset className="fieldset w-md">
          <legend className="fieldset-legend font-bold text-lg">Filament Name</legend>
          <input
            type="text"
            className="input input-xs"
            placeholder="Filament Name"
            value={filamentName}
            onChange={(e)=> setFilamentName(e.target.value)}
          />
        </fieldset>

        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-sm border p-4">
          <legend className="fieldset-legend font-bold text-lg">Filament config</legend>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <div className="col-span-2">
              <label className="label">Filament Diameter</label>
              <input
                type="number"
                className="input input-xs"
                placeholder="1.75"
                value={filamentDiameter}
                onChange={(e) => setFilamentDiameter(e.target.value)}
              />
            </div>

            <div className="col-span-2">
              <label className="label">Filament Density</label>
              <input
                type="number"
                className="input input-xs"
                placeholder="1.0"
                value={filamentDensity}
                onChange={(e) => setFilamentDensity(e.target.value)}
              />
            </div>

            <div className="col-span-2">
              <label className="label">Filament Cost</label>
              <input
                type="number"
                className="input input-xs"
                placeholder="1.0"
                value={filamentCost}
                onChange={(e) => setFilamentCost(e.target.value)}
              />
            </div>

            <div className="col-span-2">
              <label className="label">Filament Reel Wight</label>
              <input
                type="number"
                className="input input-xs"
                placeholder="1.0"
                value={filamentReelWeight}
                onChange={(e) => setFilamentReelWeight(e.target.value)}
              />
            </div>

          </div>
        </fieldset>

        <div className="flex flex-row w-md gap-x-2 py-4">
          {filamentId !== "" && (
            <button className="btn btn-xs btn-accent" onClick={handleUpdateFilament}>
              Update Filament
            </button>
          )}
          <button className="btn btn-xs btn-success" onClick={handleAddFilament}>
            Add New Filament
          </button>
          {filamentId !== "" && (
            <button
              className="btn btn-xs btn-error"
              onClick={handleRemoveFilament}
            >
              Delete This Filament
            </button>
          )}
        </div>

      </div>
    </div>
  );
}