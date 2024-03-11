import { atom } from 'recoil'

export const gcodeState = atom({
  key: 'gcodeState',
  default: ""
})

export const viewerObjectsState = atom<any>({
  key: 'viewerObjectsState',
  default: {}
})