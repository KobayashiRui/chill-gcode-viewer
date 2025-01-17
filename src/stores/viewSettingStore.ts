import {create} from 'zustand';



type viewSettingState = {
    
    lineViewState: Record<string, boolean>;
    //moveLine: boolean;
    //extrudeLine: boolean;
    cameraMode: boolean;

    setLineViewState: (lineType: string) => void;
    setCameraMode: (cameraMode:boolean) => void;
}


const useViewSettingStore = create<viewSettingState>()((set) => ({
    lineViewState: {"moveLine": true, "extrudeLine": true},
    cameraMode: false,
    setLineViewState: (lineType) => set((state) => {
        let new_state = {...state.lineViewState}
        new_state[lineType] = !new_state[lineType]
        return {lineViewState: new_state}
    }),
    setCameraMode: (cameraMode:boolean) => set(() => ({cameraMode:cameraMode}))
}))

export default useViewSettingStore