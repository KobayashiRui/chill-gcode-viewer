import {useRef} from "react"

interface FileInputType {
  handleChnageFile : any
}

function FileInput({handleChnageFile}:FileInputType) {
  const inputFileRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <button className="btn btn-primary btn-sm m-1" onClick={() => inputFileRef.current?.click()} >
        ファイルを選択
      </button>
      <input type="file" ref={inputFileRef} style={{ display: 'none' }} onChange={handleChnageFile} />
    </>
  )
}

export default FileInput

