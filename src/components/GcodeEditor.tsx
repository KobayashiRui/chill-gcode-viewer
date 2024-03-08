import React, {useState, useEffect} from 'react';
import CodeMirror from '@uiw/react-codemirror';
//import { javascript } from '@codemirror/lang-javascript';

function GcodeEditor({height, width, gcode_data}:any) {

  console.log("height:", height)
  const [value, setValue] = useState(gcode_data);

  useEffect(()=>{
    console.log("update!")
    setValue(gcode_data)

  }, [gcode_data])

  const onChange = React.useCallback((val, viewUpdate) => {
    console.log('val:', val);
    setValue(val);
  }, []);
  return <CodeMirror height={`${height}px`} width={`${width}px`} value={value} onChange={onChange} />;
}
export default GcodeEditor;