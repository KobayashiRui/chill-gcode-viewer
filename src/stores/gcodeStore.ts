import {create} from 'zustand';

type PrintResult = {
    printTime: number;
    filamentLength: number;
    filamentWeight: number;
}

type ViewControl = {
    mode: number; //0: complete show, 1: sigle row, 2: range show
    startLayer: number;
    endLayer: number;
}

type SelectedRow = {
    from: number;
    to: number;
}

type GcodeState = {
    gcodeData : string;
    viewerObjects: any[];
    printResult: PrintResult;
    enableLineSelect: boolean;
    viewControl: ViewControl;
    selectedRow: SelectedRow;
    headGeometry: any;
    enableHead: boolean;
    headPosition: [number, number, number];

    setGcodeData: (gcodeData: string) => void;
    setViewerObjects: (viewerObjects:any[]) => void;
    setPrintResult: (printResult: PrintResult) => void;
    setEnableLineSelect: (enableLineSelect: boolean) => void;
    setViewControl: ( updater: (prev:ViewControl) => ViewControl) => void;
    resetViewControl : () => void;
    setSelectedRow: (selectedRow: SelectedRow) => void;
    setHeadGeometry: (headGeometry: any) => void;
    setEnableHead: (enableHead:boolean) => void;
    setHeadPosition: (headPosition: [number, number, number]) => void;
}

const useGcodeStateStore = create<GcodeState>()((set) => ({
    gcodeData: "",
    viewerObjects: [],
    printResult: {printTime: 0, filamentLength: 0, filamentWeight: 0},
    enableLineSelect: false,
    viewControl: {mode:0, startLayer:0, endLayer:0},
    selectedRow: {from:1, to:1},
    headGeometry: null,
    enableHead: false,
    headPosition: [0.0, 0.0, 0.0],

    setGcodeData: (gcodeData) => set(() => ({gcodeData:gcodeData})),
    setViewerObjects: (viewerObjects) => set(() => ({viewerObjects:viewerObjects})),
    setPrintResult: (printResult) => set(() => ({printResult:printResult})),
    setEnableLineSelect: (enableLineSelect) => set(() => ({enableLineSelect: enableLineSelect})),
    setViewControl: (updater) => set((state) => ({viewControl: updater(state.viewControl)})),
    resetViewControl: () => set(() => ({viewControl: {mode:0, startLayer:0, endLayer:0}})),
    setSelectedRow: (selectedRow) => set(() => ({selectedRow: selectedRow})),
    setHeadGeometry: (headGometry) => set(() => ({headGeometry: headGometry})),
    setEnableHead: (enableHead) => set(() => ({enableHead:enableHead})),
    setHeadPosition: (headPosition) => set(() => ({headPosition: headPosition})),
}))

export default useGcodeStateStore;