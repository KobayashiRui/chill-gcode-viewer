import React, {useState, useEffect} from 'react';
import CodeMirror from '@uiw/react-codemirror';
//import { javascript } from '@codemirror/lang-javascript';
import { useRecoilState } from 'recoil';
import { gcodeState } from '../atoms/GcodeState';

function GcodeEditor({height, width}:any) {

  //const [value, setValue] = useState(gcode_data);
  const [value, setValue] = useRecoilState(gcodeState)
  console.log(height)

  const onChange = React.useCallback((val, viewUpdate) => {
    //console.log('val:', val);
    setValue(val);
  }, []);
  return <CodeMirror height={`${height}px`} width={`${width}px`} value={value} onChange={onChange} />;
}
export default GcodeEditor;