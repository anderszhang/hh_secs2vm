import { ExcelNode, ExcelNodeType } from './ast'
import type { CCODEMap, CCODEConfig } from './options'
import { ASTNode, SecsList, SecsNode, SecsNodeType, } from './secs2'


type CellValue = string | number | boolean | null

let currentCCodeConfig: CCODEConfig

interface TransformExcelContext  {
  ast: ExcelNode
  indentLevel: number
  addRow: (cells: CellValue[]) => void
  addEndRow: () => void
  indent: () => void
  deIndent: () => void
}

export function transformExcel(ast: ASTNode, options: CCODEMap) {
  if (ast.type !== SecsNodeType.List || ast.length < 4) {
    throw new Error('Invalid AST')
  }
  const context = createTransformContext()

  const root = ast as SecsList
  // first row
  const rootCell = getSecsCellValue(root,context)
  context.addRow([rootCell])

  context.indent()
  transformRecipeHead(root.children!, context)
  transformRecipeBody(root.children![3] as SecsList,  context, options)
  context.addEndRow()
  return  context.ast
}




function transformRecipeHead(children: ASTNode[], context: TransformExcelContext) {
  // 前三个子节点
  const ppIdCellValue = getSecsCellValue(children![0],context)
  context.addRow([ppIdCellValue, 'head', 'PPID', '','Process Program ID'])

  const mdlnCell = getSecsCellValue(children![1],context)
  context.addRow([mdlnCell, 'head', 'MDLN', '','Model Name'])

  const softVerCell = getSecsCellValue(children![2],context)
  context.addRow([softVerCell, 'head', 'SOFTVER', '', 'Software Version'])
}

function transformRecipeBody(paramSets: SecsList, context: TransformExcelContext, options: CCODEMap) {
  const cellValue = getSecsCellValue(paramSets,context)
  context.addRow([cellValue])
  context.indent()
  paramSets.children.forEach((paramSet) => {
    const recipeNode = paramSet as SecsList
    const cellValue = getSecsCellValue(paramSet,context)
    context.addRow([cellValue])
    context.indent()
    // 取ccode
    const cCode = (recipeNode.children![0] as SecsNode).value
    currentCCodeConfig = options[cCode as string]
    const cCodeCell = getSecsCellValue(recipeNode.children![0] as SecsNode,context)
    context.addRow([cCodeCell])
    // 参数
    transformParamSet(recipeNode.children![1] as SecsList, context)
    context.addEndRow()
  })
  context.addEndRow()
}

function transformParamSet(paramSet: SecsList,  context: TransformExcelContext) {
  const cellValue = getSecsCellValue(paramSet,context)
  context.addRow([cellValue])
  context.indent()
  paramSet.children.forEach((param, index: number) => {
    const cellValue = getSecsCellValue(param,context)
    const { name,comment } = currentCCodeConfig.paramSet[index]
    context.addRow([cellValue, 'body', name, param.tag, comment ? comment:''])

  })
  context.addEndRow()
}


function getSecsCellValue(ast: ASTNode,context:TransformExcelContext): CellValue {
  const { tag, length, value,type } = ast as SecsNode

  const v = type === SecsNodeType.ASCII ? `"${value}"` : value
  // 根据indentNum拼接几个空格
  let str = `${' '.repeat(context.indentLevel)}<${tag}[${length}]${v ? ' ' + v : ''}`
  if (ast.type !== SecsNodeType.List) {
    str += ' >'
  }
  return str
}

function createTransformContext() {
  const context: TransformExcelContext = {
    ast: {
      type: ExcelNodeType.Root,
      children: []
    },
    indentLevel: 0,

    addRow(cells) {
      const children: ExcelNode[] = cells.map((cell) => {
        return {
          type: ExcelNodeType.Cell,
          value: cell?.toString()
        }
      })
      const row:ExcelNode = {
        type: ExcelNodeType.Row,
        children
      }
      context.ast.children!.push(row)
    },

    addEndRow() {
      this.deIndent()
      const v = ' '.repeat(context.indentLevel) + '>'
      this.addRow([v])
    },

    indent() {
      context.indentLevel +=2
    },
    deIndent() {
      context.indentLevel -=2
    },

  }

  return context
}
