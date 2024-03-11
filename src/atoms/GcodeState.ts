import { atom } from 'recoil'

export const gcodeState = atom({
  key: 'gcodeState',
  default: ""
})

export const viewerObjectsState = atom<any>({
  key: 'viewerObjectsState',
  default: []
})

export const printResultState = atom<any>({
  key: 'printResultState',
  default: {
    print_time: 0,
    filament_length: 0,
    filament_weight: 0,
  }
})