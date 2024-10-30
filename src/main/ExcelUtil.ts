// 使用 exceljs 写入excel
import ExcelJS from 'exceljs'
import { ExcelWorkbook } from '../share'
// 以下函数写入excel文件
export function writeExcel(workbooksData: ExcelWorkbook[], filePath: string) {
  const workbook = new ExcelJS.Workbook()
  workbooksData.forEach((item) => {
    const { name, data, columns, hasHeader, hasBorder } = item
    const worksheet = workbook.addWorksheet(name)
    if (hasHeader) {
      const header = columns.map((item) => item.name)
      worksheet.addRow(header)
    }

    if (hasBorder) {
      data.forEach((row) => {
        const colNum = columns!.length
        const diff = colNum - row.length
        if (diff > 0) {
          for (let i = 0; i < diff; i++) {
            row!.push('')
          }
        }
      })
    }

    worksheet.addRows(data)
    worksheet.columns = columns
    if (hasBorder) {
      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
          if(hasHeader && rowNumber === 1){
            //设置背景色
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFC0C0C0' },
              bgColor: { argb: 'FFEEECE1' }
            }
          }
          cell.border = {
            top: { style: 'thin', color: { argb: 'FF000000' } }, // 顶部边框
            left: { style: 'thin', color: { argb: 'FF000000' } }, // 左侧边框
            bottom: { style: 'thin', color: { argb: 'FF000000' } }, // 底部边框
            right: { style: 'thin', color: { argb: 'FF000000' } } // 右侧边框
          }
        })
      })
    }
  })
  workbook.xlsx.writeFile(filePath)
}
