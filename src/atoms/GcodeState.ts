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

export const enableLineSelectState = atom<boolean>({
  key: 'enableLineSelectState',
  default: false

})

export const viewControlState = atom<any>({
  key: 'viewControlState',
  default: {
    mode: 0, // 0: complete show,  1: single row, 2: range show
    start_layer: 0,
    end_layer: 0,
  }
})

export const selectedRowState = atom<any>({
  key: 'selectedRow',
  default: {
    from: 1,
    to: 1,
  }
})