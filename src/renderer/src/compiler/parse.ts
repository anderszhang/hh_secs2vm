import { ASTNode, isSecsTag, SecsNodeType, SecsTags } from './secs2';

export function secsParse(message: string): ASTNode {
  let index = 0;

  function parse(): ASTNode {
    const token = getNextToken();
    const meta = extractToken(token);
    if (!meta) {
      throw new Error('Invalid token');
    }
    const { tag, length, value } = meta;

    if (isSecsTag(tag, SecsTags.L)) {
      // 处理列表节点;
      const children: ASTNode[] = [];

      for (let i = 0; i < length; i++) {
        children.push(parse());
      }

      return {
        type: SecsNodeType.List,
        length,
        children,
      };
    } else if (isSecsTag(tag, SecsTags.A)) {
      return {
        type: SecsNodeType.ASCII,
        length,
        value,
      };
    } else if (isSecsTag(tag, SecsTags.U1)) {
      return {
        type: SecsNodeType.U1,
        length,
        value,
      };
    } else if (isSecsTag(tag, SecsTags.U2)) {
      return {
        type: SecsNodeType.U2,
        length,
        value,
      };
    } else if (isSecsTag(tag, SecsTags.U4)) {
      return {
        type: SecsNodeType.U4,
        length,
        value,
      };
    } else if (isSecsTag(tag, SecsTags.F4)) {
      return {
        type: SecsNodeType.F4,
        length,
        value,
      };
    } else if (isSecsTag(tag, SecsTags.F8)) {
      return {
        type: SecsNodeType.F8,
        length,
        value,
      };
    } else if (isSecsTag(tag, SecsTags.Bin)) {
      return {
        type: SecsNodeType.Bin,
        length,
        value,
      };
    } else if (isSecsTag(tag, SecsTags.I1)) {
      return {
        type: SecsNodeType.I1,
        length,
        value,
      };
    } else if (isSecsTag(tag, SecsTags.I2)) {
      return {
        type: SecsNodeType.I2,
        length,
        value,
      };
    } else if (isSecsTag(tag, SecsTags.I4)) {
      return {
        type: SecsNodeType.I4,
        length,
        value,
      };
    } else if (isSecsTag(tag, SecsTags.I8)) {
      return {
        type: SecsNodeType.I8,
        length,
        value,
      };
    } else {
      throw new Error(`Unknown token type: ${token}`);
    }
  }

  function getNextToken(): string {
    // 跳过空格， 换行符，>
    while (
      index < message.length &&
      (/\s/.test(message[index]) ||
        isNewline(message[index]) ||
        message[index] === '>')
    ) {
      index++;
    }

    if (index >= message.length) {
      throw new Error('Unexpected end of message');
    }
    let token = '';
    // 查找 token 开始位置
    if (message[index] === '<' || message[index] === '>') {
      // 找到下一个 '>' 或者 '<',作为 token 的结束
      index++;
      const start = index;
      while (index < message.length) {
        if (message[index] === '<' || message[index] === '>') {
          token = message.slice(start, index);
          break;
        }
        index++;
      }
      return token;
    }

    throw new Error(`Unexpected character: ${message[index]}`);
  }

  function extractToken(token: string): {
    tag: string;
    length: number;
    value: string | number;
  } | null {
    const regexN = /([\w]+)(?:\[(\d+)\])?\s+(?:"([^"]+)"|(\d+))/;
    const regexL = /([\w])+\[(\d+)\]/;
    const isListToken = token.startsWith('L');
    const regex = isListToken ? regexL : regexN;
    const match = token.match(regex);

    if (match) {
      const tag = match[1];
      const length = match[2] ? parseInt(match[2], 10) : 0;
      const value = isListToken
        ? ''
        : match[3]
        ? match[3]
        : parseInt(match[4], 10);
      return {
        tag,
        length,
        value,
      };
    }

    return null;
  }

  function isNewline(char: string): boolean {
    return /\r?\n/.test(char);
  }

  return parse();
}
