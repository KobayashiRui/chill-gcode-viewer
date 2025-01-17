//import {useState} from "react";
//import { invoke } from "@tauri-apps/api/tauri";
import { RecoilRoot } from 'recoil'
import MainGcodeEV from "./components/MainGcodeEV";

function App() {

  return (
    <RecoilRoot>
      <div className="h-screen w-screen">
          <MainGcodeEV></MainGcodeEV>
      </div>
    </RecoilRoot>
  );
}

export default App;
