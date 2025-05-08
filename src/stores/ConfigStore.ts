import {create} from 'zustand';
import { persist } from "zustand/middleware"

type Config = {
    useFilamentId: string;
    usePrinterId: string;
    setUseFilamentId: (filamentId:string) => void;
    setUsePrinterId: (printerId:string) => void;
}

export const useConfigStore = create<Config>()(
    persist((set) => ({
        useFilamentId: "default",
        usePrinterId: "default",
        setUseFilamentId: (filamentId:string) => set(() => ({useFilamentId: filamentId})),
        setUsePrinterId: (printerId:string) => set(() => ({usePrinterId: printerId})),
        }),
        {
            name: "config-storage"
        }
    )
);

export default useConfigStore