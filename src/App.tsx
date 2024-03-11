import {useEffect, useState, useRef } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import { RecoilRoot } from 'recoil'
import MainGcodeEV from "./components/MainGcodeEV";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }


  return (
    <RecoilRoot>
      <div className="h-svh w-svw">
          <MainGcodeEV></MainGcodeEV>
      </div>
    </RecoilRoot>
  );
}

export default App;
