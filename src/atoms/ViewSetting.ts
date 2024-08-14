import { atom } from 'recoil'

export const viewSettingState = atom<any>({
  key: 'viewSettingState',
  default: {move_line: true, extrude_line: true}
})