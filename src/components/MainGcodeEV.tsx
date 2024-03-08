import {useEffect, useState, useRef } from "react";
import GcodeEditor from "./GcodeEditor";
import GcodeViewer from "./GcodeViewer";
import FileInput from "./FileInput";

function MainGcodeEV() {
  const editorRef = useRef<any>(null);
  const viewerRef = useRef<any>(null);
  const [parentHeight, setParentHeight] = useState(0);
  const [viewerWidth, setViewerWidth] = useState(0);
  const [editorWidth, setEditorWidth] = useState(0);

  const [gcodeData, setGcodeData] = useState<string>("")

  useEffect(() => {
    function handleResize() {
     if(editorRef.current) {
        setParentHeight(editorRef.current.clientHeight-20); // 親要素の現在の高さをセット
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
      console.log(reader.result)
      event.target.value = "";
    });
    reader.readAsText(file);

  }
  return (
    <>
      <h1 className="text-sky-500 text-2xl m-3">Chill Gcode Viewer</h1>
      <FileInput handleChnageFile={handleChnageFile}></FileInput>
      <div className="flex h-full w-full">
        <div ref={editorRef} className="w-2/6 border p-1 rounded-lg h-full">
         {
          <GcodeEditor height={parentHeight} width={editorWidth} gcode_data={gcodeData}></GcodeEditor>
         }
        </div>
        <div ref={viewerRef} className="flex-1 border p-1 rounded-lg h-full">
          {
            <GcodeViewer height={parentHeight} width={viewerWidth} ></GcodeViewer>
          }
        </div>
      </div>
    </>

  )
}

export default MainGcodeEV