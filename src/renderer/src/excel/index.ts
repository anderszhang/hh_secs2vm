import { compileToExcel } from '@renderer/compiler/compile'
import { CCODEMap, MachineTypeConfig } from '@renderer/compiler/options'

export function createExcelFile(machineType: string, secsMsg: string, ccodeMap: CCODEMap) {
  const data = compileToExcel(secsMsg, ccodeMap)
  const excelData = [
    {
      name: 'sheet1',
      data: data,
      hasHeader: true,
      hasBorder: true,
      columns: [
        {
          name: 'Body',
          width: 50
        },
        {
          name: 'Group',
          width: 10
        },
        {
          name: 'PParmName',
          width: 10
        },
        {
          name: 'Type',
          width: 10
        },
        {
          name: 'Comment',
          width: 50
        }
      ]
    }
  ]
  window.extApi.exportExcel(`${machineType}.xlsx`, excelData)
}
