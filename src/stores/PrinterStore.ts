import { create } from 'zustand';
import { persist } from "zustand/middleware"
import { v4 as uuidv4 } from 'uuid';

export type BedConfig = {
  xWidth: number;
  yWidth: number;
  xOffset: number;
  yOffset: number;
};

export type MoveConfig = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  zHeight: number;
};


export type PrinterConfig = {
  printerName: string; 
  bedConfig: BedConfig;
  moveConfig: MoveConfig;
  headModel: ArrayBuffer | null;
};

type PrinterStore = {
  printers: Record<string, PrinterConfig>; // UUIDをキーにしたプリンターの管理
  addPrinter: (printerConfig: PrinterConfig) => string;
  removePrinter: (uuid: string) => void;
  updatePrinter: (uuid: string, printerConfig: PrinterConfig) => void;
  exportPrinterJson: (uuid: string | null) => string;
  importPrinterJson: (printers:any) => void;
};

const defaultPrinterConfig: PrinterConfig = {
  printerName: 'Default Printer',
  bedConfig: {
    xWidth: 100,
    yWidth: 100,
    xOffset: 0,
    yOffset: 0,
  },
  moveConfig: {
    xMin: 0,
    xMax: 100,
    yMin: 0,
    yMax: 100,
    zHeight: 100,
  },
  headModel: null,
}

const usePrinterStore = create<PrinterStore>()(
  persist((set, get) => ({
    printers: {
      "default": defaultPrinterConfig, // デフォルトのプリンター設定を追加
    },
    addPrinter: (printerConfig) => {
      const uuid = uuidv4(); // UUIDを生成
      set((state) => {
        return {
          printers: {
            ...state.printers,
            [uuid]: printerConfig,
          },
        };
      })
      return uuid
    },
    removePrinter: (uuid) =>
      set((state) => {
        const { [uuid]: _, ...rest } = state.printers; // 指定したUUIDを除外
        return { printers: rest };
      }),
    updatePrinter: (uuid, printerConfig) =>
      set((state) => ({
        printers: {
          ...state.printers,
          [uuid]: printerConfig,
        },
      })),
    exportPrinterJson: (uuid) => {
      const {printers} = get();
      if(uuid === null){
        return JSON.stringify(printers)
      }else{
        return JSON.stringify({[uuid]:printers[uuid]})
      }
    },
    importPrinterJson: (printers)=> {
      set((state)=>({
        printers:{
          ...state.printers,
          ...printers,
        }
      }))
    },
    }),
    {
      name: "printers-storage"
    }
  )
);

export default usePrinterStore;

