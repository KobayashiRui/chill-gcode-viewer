import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

type FilamentConfig = {
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

const useFilamentStore = create<FilamentStore>((set) => ({
  filaments: {},
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
}));

export default useFilamentStore;