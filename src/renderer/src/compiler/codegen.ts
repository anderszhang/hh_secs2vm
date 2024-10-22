import {
  AssignmentExpression,
  ForeachExpression,
  IfStatement,
  NodeType,
  vNode,
} from './ast';

enum NewlineType {
  Start = 0,
  End = -1,
  None = -2,
  Unknown = -3,
}

export type CodegenNode = { name: string };

export interface CodegenContext {
  source: string;
  code: string;
  line: number;
  column: number;
  offset: number;
  indentLevel: number;
  pure: boolean;
  helper(key: symbol): string;
  push(code: string, newlineIndex?: number, node?: CodegenNode): void;
  indent(): void;
  deIndent(withoutNewLine?: boolean): void;
  newline(): void;
}

const endTag = '#end';
export function generate(ast: vNode): string {
  const context = createContext();
  genNode(ast, context);
  return context.code;
}

function genNode(node: vNode, context: CodegenContext) {
  const { type } = node;
  if (type === NodeType.Element) {
    genElement(node, context);
  } else if (type === NodeType.Text) {
    genText(node, context);
  } else if (type === NodeType.AssignmentExpression) {
    genAssignmentExpression(node, context);
  } else if (type === NodeType.IfStatement) {
    genIfStatement(node, context);
  } else if (type === NodeType.ForeachExpression) {
    genForeachExpression(node, context);
  }
}

function genElement(node: vNode, context: CodegenContext) {
  const { tag, props, children } = node;
  context.push(`<${tag}`);
  if (props) {
    for (const key in props) {
      const value = props[key];
      context.push(` ${key}="${value}"`);
    }
  }

  if (children) {
    context.push('>');

    children.forEach((child, index: number) => {
      // 子节点不是文本，才缩进
      if (child.type !== NodeType.Text) {
        // 第一行缩进，其他子节点无需再增加缩进
        if (index == 0) {
          context.indent();
        } else {
          context.newline();
        }
      }
      genNode(child, context);
    });

    if (
      children.length > 0 &&
      children[children.length - 1].type != NodeType.Text
    ) {
      context.deIndent();
    }
    context.push(`</${tag}>`);
  } else {
    context.push(` />`);
  }
}

function genText(node: vNode, context: CodegenContext) {
  const { content } = node;
  context.push(content);
}

function genAssignmentExpression(node: vNode, context: CodegenContext) {
  const { left, right } = node.statement as AssignmentExpression;
  context.push(`#set(${left} = ${right})`);
}
function genForeachExpression(node: vNode, context: CodegenContext) {
  const { children, statement } = node;
  const { obj, item } = statement as ForeachExpression;
  context.push(`#foreach(${item} in ${obj})`);
  genChildren(children, context);
  context.push(endTag);
}

function genIfStatement(node: vNode, context: CodegenContext) {
  const { children, statement } = node;
  const { left, right, call, operator } = statement as IfStatement;
  if (call) {
    context.push(`#if(${call}(${left} , ${right}))`);
  } else {
    context.push(`#if(${left} ${operator} ${right})`);
  }

  genChildren(children, context);
  context.push(endTag);
}

function genChildren(children: vNode[], context: CodegenContext) {
  if (children) {
    context.indent();
    // 遍历children
    for (let i = 0; i < children.length; i++) {
      genNode(children[i], context);
      // 如果是最后一个元素，则取消缩进
      if (i !== children.length - 1) {
        context.newline();
      } else {
        context.deIndent();
      }
    }
  }
}

function createContext(): CodegenContext {
  const context: CodegenContext = {
    code: ``,
    column: 1,
    line: 1,
    offset: 0,
    indentLevel: 0,
    pure: false,

    push(code, newlineIndex = NewlineType.None, node) {
      context.code += code;
    },
    indent() {
      newline(++context.indentLevel);
    },
    deIndent(withoutNewLine = false) {
      if (withoutNewLine) {
        --context.indentLevel;
      } else {
        newline(--context.indentLevel);
      }
    },
    newline() {
      newline(context.indentLevel);
    },
    source: '',
    helper: function (key: symbol): string {
      throw new Error('Function not implemented.');
    },
  };

  function newline(n: number) {
    context.push('\n' + `  `.repeat(n), NewlineType.Start);
  }

  return context;
}
