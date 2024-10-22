import { SecsNodeType } from './secs2';

export function createGetFun(type: SecsNodeType, index: number): string {
  switch (type) {
    case SecsNodeType.ASCII:
      return `$params.getAscii(${index})`;
    case SecsNodeType.Bool:
      return `$params.getBoolean(${index})`;
    case SecsNodeType.I1:
    case SecsNodeType.I2:
    case SecsNodeType.I4:
    case SecsNodeType.I8:
    case SecsNodeType.U1:
    case SecsNodeType.U2:
    case SecsNodeType.U4:
    case SecsNodeType.U8:
      return `$params.getInt(${index})`;
    case SecsNodeType.F4:
    case SecsNodeType.F8:
      return `$params.getFloat(${index})`;
    case SecsNodeType.Bin:
      return `$params.getBinary(${index})`;
    default:
      break;
  }
  return '';
}
