import {atom} from 'recoil'

interface FilamentConfigType {
  filament_diameter: string;
  filament_density: string;
  filament_cost: string;
  filament_reel_weight: string;
}

export const filamentConfigState = atom<FilamentConfigType>({
  key: 'filamentConfigState',
  default: {
    filament_diameter: '1.75', 
    filament_density: '1.0', 
    filament_cost: '1000',
    filament_reel_weight: '1000'
  }
})