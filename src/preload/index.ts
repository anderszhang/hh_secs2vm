import { contextBridge,ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { readFile } from 'fs'

// Custom APIs for renderer
const extApi = {

  writeFile: (fileName: string, data: string) => {
    return ipcRenderer.invoke('file:write', fileName, data)
  },
 
  readFile: (filepath: string) => {
    return ipcRenderer.invoke('file:read', filepath)
  },

  writeConfigFile:(fileName:string, data: string) => {
    const fName = 'config/'+fileName
    return ipcRenderer.invoke('file:write', fName, data)
  },
  readConfigFile: (filepath: string) => {
    const fName = 'config/'+filepath
    return ipcRenderer.invoke('file:read', fName)
  },

  getConfigList: () => {
    return ipcRenderer.invoke('file:list', 'config')
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
