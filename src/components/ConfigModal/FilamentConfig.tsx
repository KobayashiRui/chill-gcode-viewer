import useFilamentStore from "../../stores/filamentStore";
import { useShallow } from "zustand/react/shallow";

export default function FilamentConfig(){
  const {filaments, addFilament, removeFilament, updateFilament} = useFilamentStore(
    useShallow((state) => ({
      filaments: state.filaments,
      addFilament: state.addFilament,
      removeFilament: state.removeFilament,
      updateFilament: state.updateFilament,
    }))
  );

  return(
    <div className="flex w-full">
      <div className="grow flex flex-col">
        <fieldset className="fieldset w-md">
          <legend className="fieldset-legend font-bold text-lg">Selet Filament</legend>
          <select
            className="select select-primary"
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
            className="input"
            placeholder="Printer Name"
          />
        </fieldset>
      </div>
    </div>
  );
}