import {useEffect, useState, useRef } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import GcodeEditor from "./components/GcodeEditor";
import GcodeViewer from "./components/GcodeViewer";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const editorRef = useRef<any>(null);
  const viewerRef = useRef<any>(null);
  const [parentHeight, setParentHeight] = useState(0);
  const [viewerWidth, setViewerWidth] = useState(0);
  const [editorWidth, setEditorWidth] = useState(0);

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

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
    <div className="h-svh w-svw flex flex-col">
      <h1 className="text-sky-500 text-2xl m-3">Chill Gcode Viewer</h1>
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
    </div>
  );
}

export default App;
