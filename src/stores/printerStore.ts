import { create } from 'zustand';
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
  addPrinter: (printerConfig: PrinterConfig) => void;
  removePrinter: (uuid: string) => void;
  updatePrinter: (uuid: string, printerConfig: PrinterConfig) => void;
};

const usePrinterStore = create<PrinterStore>((set) => ({
  printers: {},
  addPrinter: (printerConfig) =>
    set((state) => {
      const uuid = uuidv4(); // UUIDを生成
      return {
        printers: {
          ...state.printers,
          [uuid]: printerConfig,
        },
      };
    }),
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
}));

export default usePrinterStore;

