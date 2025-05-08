import { create } from 'zustand';
import { persist } from "zustand/middleware"
import { v4 as uuidv4 } from 'uuid';

export type FilamentConfig = {
  filamentName: string;
  filamentDiameter: number;
  filamentDensity: number;
  filamentCost: number;
  filamentReelWeight: number;
};

type FilamentStore = {
  filaments: Record<string, FilamentConfig>; // UUIDをキーにしたフィラメントの管理
  addFilament: (filament_config: Omit<FilamentConfig, 'filamentName'> & { filamentName: string }) => void;
  removeFilament: (uuid: string) => void;
  updateFilament: (uuid: string, filament_config: FilamentConfig) => void;
};

const defaultFilamentConfig: FilamentConfig = {
  filamentName: 'Default Filament',
  filamentDiameter: 1.75,
  filamentDensity: 1.0,
  filamentCost: 1000,
  filamentReelWeight: 1000,
};

const useFilamentStore = create<FilamentStore>()(
  persist((set) => ({
    filaments: {
      "default": defaultFilamentConfig, // デフォルトのフィラメント設定を追加
    },
    addFilament: (filament_config) =>
      set((state) => {
        const uuid = uuidv4(); // UUIDを生成
        return {
          filaments: {
            ...state.filaments,
            [uuid]: filament_config,
          },
        };
      }),
    removeFilament: (uuid) =>
      set((state) => {
        const { [uuid]: _, ...rest } = state.filaments; // 指定したUUIDを除外
        return { filaments: rest };
      }),
    updateFilament: (uuid, filament_config) =>
      set((state) => ({
        filaments: {
          ...state.filaments,
          [uuid]: filament_config,
        },
      })),
    }),
    {
      name: "filaments-storage"
    }
  )
);

export default useFilamentStore;