import {useRef} from "react"

interface FileInputType {
  handleChnageFile : any
}

export default function FileInput({handleChnageFile}:FileInputType) {
  const inputFileRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <button className="btn btn-primary btn-xs m-1" onClick={() => inputFileRef.current?.click()} >
        ファイルを選択
      </button>
      <input type="file" ref={inputFileRef} style={{ display: 'none' }} onChange={handleChnageFile} />
    </>
  )
}

