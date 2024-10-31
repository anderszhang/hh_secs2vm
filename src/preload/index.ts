import { contextBridge,ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import {FILE_PATH} from '../share/constant'
// Custom APIs for renderer
const extApi = {

  writeFile: (fileName: string, data: string) => {
    return ipcRenderer.invoke('file:write', fileName, data)
  },
 
  readFile: (filepath: string) => {
    return ipcRenderer.invoke('file:read', filepath)
  },

  writeEqpConfigFile:(fileName:string, data: string) => {
    const fName = FILE_PATH.EQP_TYPE_DIR +fileName
    return ipcRenderer.invoke('file:write', fName, data)
  },
  readEqpConfigFile: (filepath: string) => {
    const fName = FILE_PATH.EQP_TYPE_DIR +filepath
    return ipcRenderer.invoke('file:read', fName)
  },

  exportExcel: (fileName:string, data:any)=>{
    const fName = FILE_PATH.EXPORT_DIR+fileName
    return ipcRenderer.invoke('excel:write', fName, data)
  },

  getEqpTypeList: () => {
    return ipcRenderer.invoke('file:list', FILE_PATH.EQP_TYPE_DIR)
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
