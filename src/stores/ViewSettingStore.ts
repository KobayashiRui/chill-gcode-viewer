import {create} from 'zustand';

type viewSettingState = {
    
    lineViewState: Record<string, boolean>;
    //moveLine: boolean;
    //extrudeLine: boolean;
    cameraMode: boolean;
    showConfigModal: boolean;
    darkMode: boolean;
    lightTheme: string;
    darkTheme: string;

    setLineViewState: (lineType: string) => void;
    setCameraMode: (cameraMode:boolean) => void;
    setShowConfigModal: (show:boolean) => void;
    setDarkMode: (mode:boolean) => void;
    getColorTheme: () => string
}

const useViewSettingStore = create<viewSettingState>()((set, get) => ({
        lineViewState: {"moveLine": true, "extrudeLine": true},
        cameraMode: false,
        showConfigModal: false,
        darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
        lightTheme: "light",
        darkTheme: "dark",
        setLineViewState: (lineType) => set((state) => {
            let new_state = {...state.lineViewState}
            new_state[lineType] = !new_state[lineType]
            return {lineViewState: new_state}
        }),
        setCameraMode: (cameraMode:boolean) => set(() => ({cameraMode:cameraMode})),
        setShowConfigModal: (show:boolean) => set(()=>({showConfigModal:show})),
        setDarkMode: (mode:boolean) => set(()=>({darkMode:mode})),
        getColorTheme: () => {
            const {darkMode, lightTheme, darkTheme} = get();
            if(darkMode){
                return darkTheme;
            }else{
                return lightTheme;
            }
        }

}))
export default useViewSettingStore