import type { ExcelNode } from './ast';
import { generate } from './codegen';
import { CCODEMap } from './options';
import { secsParse } from './parse';
import { transform } from './transform';
import { transformExcel } from './transformExcel';

export function compile(source: string, options: CCODEMap) {
  const ast = secsParse(source);
  const vNodeAst = transform(ast, options);
  const code = generate(vNodeAst);
  return code;
}


export function compileToExcel(source: string, options: CCODEMap):any[][] {
  const ast = secsParse(source);
  const excelAst:ExcelNode = transformExcel(ast, options);
  const data: any[][] = []
  excelAst.children!.forEach((row) => {
    const rowData: any[] = []
    row.children!.forEach((cell) => {
      rowData.push(cell.value)
    })
    data.push(rowData)
  })
  return data;
}