import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const extApi = {
  // 保存session
  writeFile: (fileName: string, data: string) => {
    return ipcRenderer.invoke('file:write', fileName, data)
  },
  // 读取session列表
  readFile: (filepath: string) => {
    return ipcRenderer.invoke('file:read', filepath)
  }

}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('extApi', extApi)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.extApi = extApi
}
