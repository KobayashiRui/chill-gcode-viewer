import {useEffect, useState, useRef, useMemo } from "react";

import { useRecoilValue, useRecoilState } from 'recoil';
import { gcodeState, printResultState, viewerObjectsState, viewControlState } from '../atoms/GcodeState';

import GcodeEditor from "./GcodeEditor";
import GcodeViewer from "./GcodeViewer";
import FileInput from "./FileInput";
import GcodeToPath from "./GcodeToPath"

function secToDayTime(seconds:number) {
  const day = Math.floor(seconds / 86400);
  const hour = Math.floor(seconds % 86400 / 3600);
  const min = Math.floor(seconds % 3600 / 60);
  const sec = seconds % 60;
  let time = '';
  // day が 0 の場合は「日」は出力しない（hour や min も同様）
  if(day !== 0) {
    time = `${day}日${hour}時間${min}分${sec.toFixed(2)}秒`;
  }else if(hour !==0 ) {
    time = `${hour}時間${min}分${sec.toFixed(2)}秒`;
  }else if(min !==0) {
    time = `${min}分${sec.toFixed(2)}秒`;
  }else {
    time = `${sec.toFixed(2)}秒`;
  }
  return time;
}

function MainGcodeEV() {
  const editorRef = useRef<any>(null);
  const viewerRef = useRef<any>(null);
  const [editorHeight, setEditorHeight] = useState(0);
  const [editorWidth, setEditorWidth] = useState(0);
  const [viewerHeight, setViewerHeight] = useState(0);
  const [viewerWidth, setViewerWidth] = useState(0);

  const [contentsHidden, setContentsHidden] = useState(false);

  const [viewerObjects, _setViewerObjects] = useRecoilState(viewerObjectsState)
  const [viewControl, setViewControl] = useRecoilState(viewControlState)

  //const [gcodeData, setGcodeData] = useState<string>("")
  const [_gcodeData, setGcodeData] = useRecoilState(gcodeState)
  const printResult = useRecoilValue(printResultState)

  const memoPrintTime = useMemo(() => secToDayTime(printResult.print_time), [printResult])

  useEffect(() => {
    function handleResize() {
        console.log("hidden")
        setContentsHidden(true)
        setTimeout(() => {
          setEditorHeight(editorRef.current.clientHeight-5);
          setEditorWidth(editorRef.current.clientWidth-10);
          setViewerHeight(viewerRef.current.clientHeight-5);
          setViewerWidth(viewerRef.current.clientWidth-5);
          setContentsHidden(false)
        },100)
  //   if(editorRef.current && viewerRef.current) {
  //      console.log("resize window:", editorRef.current.clientHeight, ",", editorRef.current.clientWidth)
  //      setEditorHeight(editorRef.current.clientHeight-10); // 親要素の現在の高さをセット
  //      setViewHeight(viewerRef.current.clientHeight-20); // 親要素の現在の高さをセット
  //      setEditorWidth(window.innerWidth * 2.0/6.0 - 10)
  //      setViewerWidth(window.innerWidth * 4.0/6.0 - 10)
  //      console.log(window.innerWidth * 4.0/6.0)
  //    }
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // 初期サイズを設定

    return () => window.removeEventListener('resize', handleResize);
  }, []); // 空の依存配列でマウントとアンマウント時のみ実行

  //useEffect(()=>{
  //    if(contentsHidden){
  //      console.log("Show")
  //      setEditorHeight(editorRef.current.clientHeight);
  //      setEditorWidth(editorRef.current.clientWidth);
  //      setViewerHeight(viewerRef.current.clientHeight);
  //      setViewerWidth(viewerRef.current.clientWidth);
  //      setContentsHidden(false)
  //    }
  //},[contentsHidden])  


  const handleChnageFile = (event:React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (!files || files?.length === 0) return;
    const file = files[0];

    const reader = new FileReader();
    // ファイル読み込み完了時に発火するリスナー
    reader.addEventListener("load", () => {
      setGcodeData(typeof reader.result === "string" ? reader.result : "");
      event.target.value = "";
    });
    reader.readAsText(file);

  }

  //TODO: end layer以上にならないようにする
  // 以上になったらend layer側を増加させる
  const handleChangeViewStartLayer = (e:any)=>{
    setViewControl((prev:any)=>{
      const new_prev = {...prev}
      new_prev.start_layer =  parseInt(e.target.value)
      if(prev.mode === 1){
        new_prev.end_layer = parseInt(e.target.value)
      }
      return new_prev
    })

  }

  //TODO: start layer以下にならないようにする
  // 以下になったらstart layer側を減少させる
  const handleChangeViewEndLayer = (e:any)=>{
    setViewControl((prev:any)=>{
      const new_prev = {...prev}
      new_prev.end_layer =  parseInt(e.target.value)
      if(prev.mode === 1){
        new_prev.start_layer = parseInt(e.target.value)
      }
      return new_prev
    })
  }

  //TODO: modeが変わったらステータスの状態を変更する
  const handleChangeViewMode = (e:any)=>{
    console.log("changeViewMode:",e.target.value)
    console.log(typeof e.target.value)
    setViewControl((prev:any)=>{
      const new_prev = {...prev}
      new_prev.mode =  parseInt(e.target.value)
      return new_prev
    })
    

  }

  return (
    <div className="flex flex-col h-full">
      <div className="grow-0">
        <h1 className="text-sky-500 text-2xl m-3">Chill Gcode Viewer</h1>
      </div>
      <div className="grow">
        <div className="flex h-full">
          <div className="flex flex-col w-2/6">
            <div className="flex items-center border p-0.5">
              <FileInput handleChnageFile={handleChnageFile}></FileInput>
              <GcodeToPath></GcodeToPath>
            </div>
            <div className="flex items-center border p-0.5">
              <div className="flex text-black mx-3 my-1">
                <div className="bg-emerald-500 rounded-l-lg p-1">
                  造形時間
                </div>
                <div className="bg-emerald-200 rounded-r-lg p-1">
                  {memoPrintTime}
                </div>
              </div>
              <div className="flex text-black mx-3 my-1">
                <div className="bg-teal-500 rounded-l-lg p-1">
                  フィラメント長さ
                </div>
                <div className="bg-teal-200 rounded-r-lg p-1">
                  {printResult.filament_length.toFixed(2)}mm
                </div>
              </div>
            </div>
            <div className="grow w-full border p-0.5">
              <div ref={editorRef} className="h-full w-full">
              {
              //<div className="h-full w-full">Test</div>
              <GcodeEditor hidden={contentsHidden} height={editorHeight} width={editorWidth}></GcodeEditor>
              }

              </div>
            </div>
            <div className="border p-1  pb-10">
              <h2 className="text-md text-gray-200 underline underline-offset-2">View control</h2>
              <div className="flex flex-col">
                <label className="label p-0.5 cursor-pointer">
                  <span className="label-text">All mode</span> 
                  <input type="radio" name="radio-view-mode" className="radio radio-sm checked:bg-red-500" value={0}  checked={viewControl["mode"] === 0} onChange={handleChangeViewMode}/>
                </label>
                <label className="label p-0.5 cursor-pointer">
                  <span className="label-text">Single mode</span> 
                  <input type="radio" name="radio-view-mode" className="radio radio-sm checked:bg-blue-500" value={1}  checked={viewControl["mode"] === 1} onChange={handleChangeViewMode}/>
                </label>
                <label className="label p-0.5 cursor-pointer">
                  <span className="label-text">Range mode</span> 
                  <input type="radio" name="radio-view-mode" className="radio radio-sm checked:bg-green-500" value={2}  checked={viewControl["mode"] === 2} onChange={handleChangeViewMode}/>
                </label>
              </div>
              <div className="flex items-center">
                <span className="text-nowrap mr-2">start layer:</span>
                <input className="mr-2" type="number" min={0} max={viewerObjects.length-1} step="1" value={viewControl["start_layer"]} onChange={handleChangeViewStartLayer}></input>
                <input type="range" min={0} max={viewerObjects.length-1} step="1" value={viewControl["start_layer"]} className="range range-xs" onChange={handleChangeViewStartLayer} /> 
              </div>
              <span>Start Gcode Row: {viewerObjects.length > 0 ? viewerObjects[viewControl["start_layer"]]["index"]+1: 0}</span>
              <div className="flex items-center">
                <span className="text-nowrap mr-2">end layer:</span>
                <input className="mr-2" type="number" min={0} max={viewerObjects.length-1} step="1" value={viewControl["end_layer"]} onChange={handleChangeViewEndLayer}></input>
                <input type="range" min={0} max={viewerObjects.length-1} step="1" value={viewControl["end_layer"]} className="range range-xs" onChange={handleChangeViewEndLayer}/> 
              </div>
              <span>End Gcode Row: {viewerObjects.length > 0 ? viewerObjects[viewControl["end_layer"]]["index"]+1: 0}</span>
            </div>
          </div>
          <div ref={viewerRef} className="flex-1 border p-0.5">
            <div ref={viewerRef} className="h-full w-full">
            {
              //<div className="h-full w-full">Test</div>
              <GcodeViewer hidden={contentsHidden} height={viewerHeight} width={viewerWidth}></GcodeViewer>
            }
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default MainGcodeEV