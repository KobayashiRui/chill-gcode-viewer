import {useEffect, useState, useRef} from "react"
import useGcodeStateStore from "@/stores/GcodeStore"
import { useShallow } from "zustand/react/shallow"

function MoveControler({width}:any){

	const [enableHead, setEnableHead] = useGcodeStateStore(useShallow((state)=>[state.enableHead, state.setEnableHead]))

	useEffect(()=>{
		console.log("MoveControler width:", width)
	},[width])


	const setViewControl = useGcodeStateStore((state)=> state.setViewControl)
  	const viewerObjects = useGcodeStateStore((state)=> state.viewerObjects)
	const setHeadPosition = useGcodeStateStore((state)=> state.setHeadPosition)

	const [nowIndex, setNowIndex] = useState("0")
	//const [minIndex, setMinIndex] = useState("0")
	const [maxIndex, setMaxIndex] = useState("0")

  const [isRunning, setIsRunning] = useState(false); // タイマーの状態
  const intervalRef = useRef<number | null>(null); // タイマーIDを保持

	const [simSpeed, setSimSpeed] = useState("1") // 1s毎に更新

	useEffect(()=>{
		if (viewerObjects) {
			setMaxIndex(viewerObjects.length.toString())
		}
	}, [viewerObjects])


	const handleChangeIndex = (e:any) => {
		setNowIndex(e.target.value)
	}

	useEffect(()=>{
		if(viewerObjects && viewerObjects.length > 0){
			console.log(viewerObjects)
			let index = parseInt(nowIndex)
			console.log("index:",index)
			console.log(viewerObjects[index])
			//const edge_end = viewerObjects[index].points[1]
			const edge_end = viewerObjects[index].points.slice(-1)[0][1]
			setHeadPosition([edge_end.x, edge_end.y, edge_end.z])
			setViewControl((prev:any)=>{
  	    const new_prev = {...prev}
				new_prev.endLayer = index
  	    return new_prev
  	  })
		}

	}, [nowIndex])

	const handleCheckHeadMode = (e:any) => {
		setEnableHead(e.target.checked)
		if(e.target.checked === true) {
    	setViewControl((prev:any)=>{
    	  const new_prev = {...prev}
				new_prev.startLayer = 0.0
				new_prev.endLayer = 0.0
    	  new_prev.mode =  2
    	  return new_prev
    	})
		}

	}

  useEffect(() => {
    if (isRunning) {
      handleStopSimulator();
    	handleStartSimulator();
    }
  }, [simSpeed]); // intervalが変わったら再実行

	const handleStartSimulator = () => {
    if (!isRunning) {
      setIsRunning(true); // タイマーを開始
			let interval = Number(simSpeed) * 1000 //s to ms
			if(Number.isNaN(interval)){
				window.alert("Update Speedに正しい数字を入れてください")
			}
      intervalRef.current = window.setInterval(() => {
				setNowIndex((prev) => {
					let pv = parseInt(prev)
					if(pv + 1 >= parseInt(maxIndex)) {
						handleStopSimulator()
						return maxIndex
					}
					return (pv + 1).toString()
				})
      }, interval); // 1秒ごとに実行
    }
	}

	const handleStopSimulator = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
	}

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  //const IntersectionCheck = () => {
  //}


  return (
    <div 
			className="absolute bottom-2 flex flex-col gap-2 bg-gray-200 p-2 rounded-md z-40"
			style={{width:`${width+5}px`}}
		>
		<h2 className="text-gray-900 font-bold">Move Controler</h2>
    	<div className="flex justify-between">
        <div className="flex flex-col">
          <div className="flex items-center">
    	     <div className="mr-2 text-gray-800">Show Head</div> 
    	     <input type="checkbox" className="toggle toggle-info" checked={enableHead} onChange={handleCheckHeadMode}/>
          </div>
		      <div className="flex items-center">
          	  <span className="mr-2 text-gray-800">Move simulator</span> 
		      		<button className="btn btn-sm btn-circle mx-2" onClick={handleStartSimulator}>
		      			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className="size-5">
		      			  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
		      			</svg>
		      		</button>
		      		<button className="btn btn-sm btn-squre mx-2" onClick={handleStopSimulator}>
		      			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className="size-5">
		      			  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
		      			</svg>
		      		</button>
		      		<div>
		      			<span className="ml-2 mr-2 text-gray-800">Update Speed</span>
		      			<input type="number" className="input input-bordered input-sm w-24" step={0.1} value={simSpeed} onChange={(e:any) => setSimSpeed(e.target.value)} />
		      			<span className="mr-2 text-gray-800">[s]</span>
		      		</div>
		      </div>
        </div>

        <div className="border  border-sky-800 rounded p-2">
          <div className="flex items-center">
    	      <div className="text-gray-800 mr-4">Intersection Check</div> 
            <button className="btn btn-sm">Check Start</button>
          </div>
          <div>
            <span className="text-gray-700 mr-4">Check Result:</span>

          </div>

        </div>
    	</div>
		<input type="range" min="0" max={maxIndex} value={nowIndex} className="range" onChange={handleChangeIndex} />
    </div>
  )
}

export default MoveControler