import { ElectronAPI } from '@electron-toolkit/preload'

interface ExtAPI {
  writeFile: (path: string, content: string) => Promise<void>
  readFile: (path: string) => Promise<string>
  writeConfigFile: (path: string, content: string) => Promise<void>
  readConfigFile: (path: string) => Promise<string>
  getConfigList: () => Promise<string[]>
}

declare global {
  interface Window {
    electron: ElectronAPI
    extApi: ExtAPI
  }
}
