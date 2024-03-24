import React, {useState, useEffect, useRef} from 'react';
import CodeMirror, {ReactCodeMirrorRef} from '@uiw/react-codemirror';
//import { javascript } from '@codemirror/lang-javascript';
import { useRecoilState } from 'recoil';
import { gcodeState } from '../atoms/GcodeState';

function GcodeEditor({height, width}:any) {
  const editorRef = useRef<any>(null)

  //const [value, setValue] = useState(gcode_data);
  const [value, setValue] = useRecoilState(gcodeState)
  console.log(height)

  const onChange = React.useCallback((val, viewUpdate) => {
    //console.log('val:', val);
    console.log(editorRef.current)
    setValue(val);
  }, []);

  useEffect(() => {
    const editor = editorRef.current?.editor;
    if (editor) {
    }
  }, [editorRef]);


  return <CodeMirror ref={editorRef} height={`${height}px`} width={`${width}px`} value={value} onChange={onChange} />;
}
export default GcodeEditor;