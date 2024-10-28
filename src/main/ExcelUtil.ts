
// 使用 node-xlsx 写入excel
import * as xlsx from 'node-xlsx';
import * as fs from 'fs';


// 以下函数写入excel文件
export function writeExcel(data: xlsx.WorkSheet[], filePath: string) {
  const buffer = xlsx.build(data);
  fs.writeFileSync(filePath, buffer);
}