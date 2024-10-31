import { compileToExcel } from '@renderer/compiler/compile'
import { CCODEMap } from '@renderer/compiler/options'

export function createExcelFile(eqpType: string, secsMsg: string, ccodeMap: CCODEMap) {
  const {PPID, data} = compileToExcel(secsMsg, ccodeMap)
  const excelData = [
    {
      name: PPID,
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
  window.extApi.exportExcel(`${eqpType}.xlsx`, excelData)
}
