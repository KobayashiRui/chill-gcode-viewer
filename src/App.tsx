//import {useState} from "react";
//import { invoke } from "@tauri-apps/api/tauri";
import MainGcodeEV from "./components/MainGcodeEV";
import useViewSettingStore from "./stores/ViewSettingStore";

function App() {

  const theme = useViewSettingStore((state)=>state.getColorTheme())

  return (
    <div data-theme={theme} className="h-screen w-screen">
        <MainGcodeEV></MainGcodeEV>
    </div>
  );
}

export default App;
