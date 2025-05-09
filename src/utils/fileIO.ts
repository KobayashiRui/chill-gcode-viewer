import { save } from '@tauri-apps/api/dialog';
import { fs } from "@tauri-apps/api";

import { isTauri } from "./IsTauri";

/**
 * 
 * @param data 
 * @param filters [{name:"", extensions: ["", ]}]
 *  
 */
async function TauriExportJsonFile(data:any){
  const filePath = await save({
    filters: [{
      name: "Json",
      extensions: ['json']
    }]
  });
  console.log("selected path:", filePath);
  if(filePath !== null){
    await fs.writeTextFile(filePath, data)
  }
}

/**
 * 
 * @param data 
 * @param file_type "text/plain"
 */
async function WebExportJsonFile(data:any, init_name:string){
  try {
    const fileName = prompt("Enter file name:", init_name);
    if (!fileName) return; // キャンセル時は何もしない
    const blob = new Blob([data], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName + ".json"; // Web ではファイル名を直接指定
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    console.log("File downloaded successfully in Web.");
  } catch (error) {
    console.error("Failed to download file in Web:", error);
  }
}

export async function ExportJsonFile(data:any, init_name:string){
  if(isTauri()){
    await TauriExportJsonFile(data)
  }else{
    await WebExportJsonFile(data, init_name)
  }
}

export async function ImportJsonFile(event: React.ChangeEvent<HTMLInputElement>): Promise<any | null> {
  const files = event.currentTarget.files;
  if (!files || files.length === 0) return null; // ファイルが選択されていない場合はnullを返す
  const file = files[0];

  return new Promise((resolve) => {
    const reader = new FileReader();

    // ファイル読み込み完了時に発火するリスナー
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        try {
          const jsonData = JSON.parse(reader.result); // JSON文字列をオブジェクトに変換
          resolve(jsonData); // 成功時にオブジェクトを返す
        } catch (error) {
          console.error("Failed to parse JSON:", error);
          resolve(null); // JSONパースエラー時はnullを返す
        }
      } else {
        console.error("File content is not a valid string.");
        resolve(null); // ファイル内容が文字列でない場合はnullを返す
      }
      event.target.value = ""; // ファイル選択をリセット
    });

    // ファイル読み込みエラー時に発火するリスナー
    reader.addEventListener("error", () => {
      console.error("Failed to read file:", reader.error);
      resolve(null); // 読み込みエラー時はnullを返す
      event.target.value = ""; // ファイル選択をリセット
    });

    reader.readAsText(file); // ファイルをテキストとして読み込む
  });
}