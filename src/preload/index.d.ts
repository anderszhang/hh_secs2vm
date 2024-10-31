import { ElectronAPI } from '@electron-toolkit/preload'

interface ExtAPI {
  writeFile: (path: string, content: string) => Promise<void>
  readFile: (path: string) => Promise<string>
  writeEqpConfigFile: (path: string, content: string) => Promise<void>
  readEqpConfigFile: (path: string) => Promise<string>
  getEqpTypeList: () => Promise<string[]>
  exportExcel(fileName:string, data: ExcelWorkbook[]): Promise<void>
}


declare global {
  interface Window {
    electron: ElectronAPI
    extApi: ExtAPI
  }
}
