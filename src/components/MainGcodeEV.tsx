import {useEffect, useState, useRef } from "react";
import GcodeEditor from "./GcodeEditor";
import GcodeViewer from "./GcodeViewer";
import FileInputLoader from "./FileInputLoader";

function MainGcodeEV() {
  const editorRef = useRef<any>(null);
  const viewerRef = useRef<any>(null);
  const [parentHeight, setParentHeight] = useState(0);
  const [viewerWidth, setViewerWidth] = useState(0);
  const [editorWidth, setEditorWidth] = useState(0);

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

  return (
    <>
      <h1 className="text-sky-500 text-2xl m-3">Chill Gcode Viewer</h1>
      <input type="file" className="file-input file-input-bordered file-input-sm w-full max-w-sm mt-1 ml-2 mb-2" />
      <FileInputLoader></FileInputLoader>
      <div className="flex h-full w-full">
        <div ref={editorRef} className="w-2/6 border p-1 rounded-lg h-full">
         {
          <GcodeEditor height={parentHeight} width={editorWidth}></GcodeEditor>
         }
        </div>
        <div ref={viewerRef} className="flex-1 border p-1 rounded-lg h-full">
          {
            <GcodeViewer height={parentHeight} width={viewerWidth}></GcodeViewer>
          }
        </div>
      </div>
    </>

  )
}

export default MainGcodeEV