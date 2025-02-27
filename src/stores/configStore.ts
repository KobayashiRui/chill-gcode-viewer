import {create} from 'zustand';

type FilamentConfig = {
  filamentDiameter: string;
  filamentDensity: string;
  filamentCost: string;
  filamentReelWeight: string;
}

type Config = {
    showConfigModal: boolean;
    filamentConfig: FilamentConfig;
    setFilamentConfig: (config_key:string, new_value:string) => void;
    setShowConfigModal: (show: boolean) => void
}

export const useConfigStore = create<Config>()((set) => ({
    showConfigModal: false,
    filamentConfig: {
        filamentDiameter: '1.75', filamentDensity: '1.0', 
        filamentCost: '1000', filamentReelWeight: '1000'},
    //setFilamentConfig: (config_key, new_value) => set(()=> ({filamentConfig:filamentConfig}))
    setFilamentConfig: (config_key, new_value) => set((state)=> {
        let new_state = {...state}
        if (config_key in new_state.filamentConfig){
            new_state.filamentConfig[config_key as keyof FilamentConfig] = new_value
        }
        return new_state
    }),
    setShowConfigModal: (show) => set(()=>({showConfigModal:show}))
}))

export default useConfigStore