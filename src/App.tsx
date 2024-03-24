//import {useState} from "react";
//import { invoke } from "@tauri-apps/api/tauri";
import { RecoilRoot } from 'recoil'
import MainGcodeEV from "./components/MainGcodeEV";

function App() {
  //const [greetMsg, setGreetMsg] = useState("");
  //const [name, setName] = useState("");
  //const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  //const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  //async function greet() {
  //  // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  //  setGreetMsg(await invoke("greet", { name }));
  //}

  //useEffect(()=>{
  //  function handleResize() {
  //    console.log("resize main:",window.innerHeight,",",window.innerWidth)
  //    setWindowHeight(window.innerHeight);
  //    setWindowWidth(window.innerWidth)
  //  }
  //  window.addEventListener("resize", handleResize)
  //  handleResize();

  //  return () => window.removeEventListener('resize', handleResize);
  //},[])


  return (
    <RecoilRoot>
      {
      //<div style={{height:`${windowHeight}px`, width: `${windowWidth}px`}}>
      }
      <div className="h-screen w-screen">
          <MainGcodeEV></MainGcodeEV>
      </div>
    </RecoilRoot>
  );
}

export default App;
