import React, {useEffect, useRef, forwardRef, useImperativeHandle} from 'react';
import CodeMirror from '@uiw/react-codemirror';
//import { javascript } from '@codemirror/lang-javascript';
import { useRecoilState } from 'recoil';
import { gcodeState, selectedRowState } from '../atoms/GcodeState';

const GcodeEditor = forwardRef(({hidden, height, width}:any, ref:any) => {
  const editorRef = useRef<any>(null)

  //const [value, setValue] = useState(gcode_data);
  const [value, setValue] = useRecoilState(gcodeState)
  const [_selectedRow, setSelectedRow] = useRecoilState(selectedRowState)
  console.log(height)

  const onChange = React.useCallback((val:any, _viewUpdate:any) => {
    //console.log('val:', val);
    console.log(editorRef.current)
    setValue(val);
  }, []);

  useEffect(() => {
    const editor = editorRef.current?.editor;
    console.log(editor.current)
  }, [editorRef.current]);

  const onUpdate = React.useCallback((viewUpdate:any) => {
    if (viewUpdate.docChanged || viewUpdate.selectionSet) {
      console.log('viewUpdate:', viewUpdate);
      console.log(viewUpdate.state.selection)
      const cursorPos = viewUpdate.state.selection.main.from;
      const cursorPos_bottom = viewUpdate.state.selection.main.to;
      const line = viewUpdate.state.doc.lineAt(cursorPos).number;
      const line_bottom = viewUpdate.state.doc.lineAt(cursorPos_bottom).number;
      console.log(line, ",", line_bottom)
      setSelectedRow({from: line, to: line_bottom})
    }
  },[]);

  useImperativeHandle(ref, () => {
    return {
      goLine(lineNumber:number) {
        console.log("Go Line:", lineNumber)
        handleGoLine(lineNumber)
      }
    }
  },[])

  //指定の行に移動する
  const handleGoLine = (lineNumber:number) => {
    if(editorRef.current){
      console.log(editorRef.current)
      const view = editorRef.current.view
      const pos = view.state.doc.line(lineNumber).from;
      console.log(pos)
      view.dispatch({
        selection: { anchor: pos, head: pos },
        scrollIntoView: true
      })
      view.focus()
    }
  }


  return (
    <div>
    {
      <CodeMirror ref={editorRef} hidden={hidden} height={`${height}px`} width={`${width}px`} value={value} onChange={onChange} onUpdate={onUpdate}/>
    }
    </div>
  )
})
export default GcodeEditor;