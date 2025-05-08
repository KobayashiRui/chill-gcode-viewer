import {create} from 'zustand';

type Config = {
    useFilamentId: string;
    usePrinterId: string;
    setUseFilamentId: (filamentId:string) => void;
    setUsePrinterId: (printerId:string) => void;
}

export const useConfigStore = create<Config>()((set) => ({
    useFilamentId: "default",
    usePrinterId: "default",
    setUseFilamentId: (filamentId:string) => set(() => ({useFilamentId: filamentId})),
    setUsePrinterId: (printerId:string) => set(() => ({usePrinterId: printerId})),
}))

export default useConfigStore