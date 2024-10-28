export enum SecsNodeType {
  List,
  Bin, // Binary
  Bool, // Boolean
  ASCII, // ASCII
  I8, // 8 byte integer (signed)
  I4, // 4 byte integer (signed)
  I2, // 2 byte integer (signed)
  I1, // 1 byte integer (signed)
  F8, // 8 byte floating point
  F4, // 5 byte floating point
  U8, // 8 byte integer
  U4, // 4 byte integer
  U2, // 2 byte integer
  U1 // 1 byte integer
}

export type ASTNode = SecsList | SecsNode

export interface SecsList {
  type: SecsNodeType.List
  length: number
  tag: string
  children: ASTNode[]
}

export interface SecsNode {
  type: SecsNodeType
  length: number
  tag: string
  value: string | number | boolean
}

export const SecsTags = {
  L: ['L'],
  A: ['A'],
  Bin: ['Bin'],
  Boolean: ['Boolean'],
  I1: ['I1'],
  I2: ['I2'],
  I4: ['I4'],
  I8: ['I8'],
  U1: ['U1'],
  U2: ['U2'],
  U4: ['U4', 'UINT_4'],
  U8: ['U8'],
  F4: ['F4', 'FT_4'],
  F8: ['F8', 'FT_8']
}

/**
 * 判断是否为指定的SECS TAG
 * @param tag
 * @param tags
 * @returns
 */
export function isSecsTag(tag: string, tags: string[]): boolean {
  return tags.indexOf(tag) >= 0
}

export function secsNodeType2DataType(nodeType: SecsNodeType): string {
  switch (nodeType) {
    case SecsNodeType.ASCII:
      return 'ASCII'
    case SecsNodeType.Bool:
      return 'boolean'
    case SecsNodeType.Bin:
      return 'Buffer'
    case SecsNodeType.I1:
    case SecsNodeType.I2:
    case SecsNodeType.I4:
      return 'INT4'
    case SecsNodeType.I8:
      return 'INT8'
    case SecsNodeType.U1:
    case SecsNodeType.U2:
    case SecsNodeType.U4:
      return 'UINT4'
    case SecsNodeType.U8:
      return 'UINT8'
    case SecsNodeType.F4:
      return 'FLOAT4'
    case SecsNodeType.F8:
      return 'FLOAT8'
    default:
      return ''
  }
}
