import React, {useState, useRef} from "react"

function FileInputLoader() {
  const inputFileRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {/* クリック時に input[type="file"] を発火 */}
      <button onClick={() => inputFileRef.current?.click()} >
        ファイルを選択
      </button>
      <input ref={inputFileRef} style={{ display: 'none' }} />
    </>
  )
}

export default FileInputLoader

