import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
//import { javascript } from '@codemirror/lang-javascript';

function GcodeEditor({height}:any) {

  console.log("height:", height)
  const [value, setValue] = React.useState("console.log('hello world!');");
  const onChange = React.useCallback((val, viewUpdate) => {
    console.log('val:', val);
    setValue(val);
  }, []);
  return <CodeMirror height={`${height}px`} value={value} onChange={onChange} />;
}
export default GcodeEditor;