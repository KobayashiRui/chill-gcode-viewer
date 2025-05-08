import useFilamentStore from "@/stores/FilamentStore";
import usePrinterStore from "@/stores/PrinterStore";
import useConfigStore from "@/stores/ConfigStore";
import { useShallow } from "zustand/react/shallow";

export default function ViewerConfig() {
  const filamentList = useFilamentStore((state) => state.filaments)
  const printerList = usePrinterStore((state) => state.printers)

  const { usePrinterId, setUsePrinterId } = useConfigStore(
    useShallow((state)=>({
      usePrinterId: state.usePrinterId,
      setUsePrinterId: state.setUsePrinterId,
    }))
  );

  const { useFilamentId, setUseFilamentId } = useConfigStore(
    useShallow((state)=>({
      useFilamentId: state.useFilamentId,
      setUseFilamentId: state.setUseFilamentId,
    }))
  );


  return (
    <div className="flex flex-col w-full">
      <fieldset className="fieldset w-md">
        <legend className="fieldset-legend font-bold text-lg">Printer</legend>
        <select
          className="select select-primary"
          value={usePrinterId}
          onChange={(e) => setUsePrinterId(e.target.value)}
        >
          <option value="">New Printer</option>
          {Object.keys(printerList).map((uuid) => (
            <option key={uuid} value={uuid}>
              {printerList[uuid].printerName}
            </option>
          ))}
        </select>
      </fieldset>

      <fieldset className="fieldset w-md">
        <legend className="fieldset-legend font-bold text-lg">Filament</legend>
        <select
          className="select select-primary"
          value={useFilamentId}
          onChange={(e) => setUseFilamentId(e.target.value)}
        >
          <option value="">New Printer</option>
          {Object.keys(filamentList).map((uuid) => (
            <option key={uuid} value={uuid}>
              {filamentList[uuid].filamentName}
            </option>
          ))}
        </select>
      </fieldset>

    </div>
  )
}