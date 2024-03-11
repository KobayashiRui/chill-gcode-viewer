import {useEffect, useState, useRef } from "react";

import { useRecoilState } from 'recoil';
import { gcodeState } from '../atoms/GcodeState';

import GcodeEditor from "./GcodeEditor";
import GcodeViewer from "./GcodeViewer";
import FileInput from "./FileInput";
import GcodeToPath from "./GcodeToPath"

function MainGcodeEV() {
  const editorRef = useRef<any>(null);
  const viewerRef = useRef<any>(null);
  const [viewHeight, setViewHeight] = useState(0);
  const [editorHeight, setEditorHeight] = useState(0);
  const [viewerWidth, setViewerWidth] = useState(0);
  const [editorWidth, setEditorWidth] = useState(0);

  const [startLayerNum, setStartLayerNum] = useState(0);
  const [endLayerNum, setEndLayerNum] = useState(0);

  //const [gcodeData, setGcodeData] = useState<string>("")
  const [gcodeData, setGcodeData] = useRecoilState(gcodeState)

  useEffect(() => {
    function handleResize() {
     if(editorRef.current) {
        setEditorHeight(editorRef.current.clientHeight-10); // 親要素の現在の高さをセット
        setViewHeight(viewerRef.current.clientHeight-20); // 親要素の現在の高さをセット
        setEditorWidth(window.innerWidth * 2.0/6.0 - 10)
        setViewerWidth(window.innerWidth * 4.0/6.0 - 10)
        console.log(window.innerWidth * 4.0/6.0)
      }
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // 初期サイズを設定

    return () => window.removeEventListener('resize', handleResize);
  }, []); // 空の依存配列でマウントとアンマウント時のみ実行


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
            <div ref={editorRef} className="grow w-full border p-0.5">
              <GcodeEditor height={editorHeight} width={editorWidth}></GcodeEditor>
            </div>
            <div className="border p-1  pb-10">
              <h2>view control</h2>
              <label>
                start layer:
                <input type="range" min={0} max="100" step="1" value={startLayerNum} className="range range-xs" onChange={(e:any)=>{setStartLayerNum(parseInt(e.target.value))}} /> 
              </label>
                end layer:
                <input type="range" min={0} max="100" step="1" value={endLayerNum} className="range range-xs" onChange={(e:any)=>{setEndLayerNum(parseInt(e.target.value))}}/> 
            </div>
          </div>
          <div ref={viewerRef} className="flex-1 border p-0.5">
            {
              <GcodeViewer height={viewHeight} width={viewerWidth} ></GcodeViewer>
            }
          </div>

        </div>
      </div>
    </div>
  )
}

export default MainGcodeEV