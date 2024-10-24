import { AssignmentExpression, NodeType, vNode } from './ast';
import type { CCODE, CCODEConfig, CCODEParam } from './options';
import {
  ASTNode,
  SecsList,
  SecsNode,
  SecsNodeType,
  secsNodeType2DataType,
} from './secs2';
import { createGetFun } from './transformHelper';

interface TransformContext {
  ast: vNode;
}
export function transform(ast: ASTNode, options: CCODE) {
  if (ast.type !== SecsNodeType.List || ast.length < 4) {
    throw new Error('Invalid AST');
  }
  const root = createRoot();
  // 目前只处理mainRecipe
  const recipe = createRecipe(ast, options);
  root.children!.push(recipe);
  return root;
}

function createRoot(): vNode {
  return {
    type: NodeType.Element,
    tag: 'recipes',
    children: [],
  };
}

function createRecipe(ast: ASTNode, options: CCODE): vNode {
  const recipe:vNode = {
    type: NodeType.Element,
    tag: 'recipe',
    children: [],
  };
  const head:vNode = createRecipeHead();
  // 查看有几个recipe
  const recipeList = (ast as SecsList).children[3] as SecsList;
  if (recipeList.type !== SecsNodeType.List) {
    throw new Error('Invalid AST');
  }
  const body = createRecipeBody(recipeList, options);
  recipe.children!.push(head);
  recipe.children!.push(body);

  return recipe;
}

function createRecipeHead(): vNode {
  const head:vNode = {
    type: NodeType.Element,
    tag: 'head',
    children: [],
  };
  const ppId:vNode = {
    type: NodeType.Element,
    tag: 'ppId',
    children: [
      {
        type: NodeType.Text,
        content: '$root.getAscii(0)',
      },
    ],
  };

  const mdln:vNode = {
    type: NodeType.Element,
    tag: 'mdln',
    children: [
      {
        type: NodeType.Text,
        content: '$root.getAscii(1)',
      },
    ],
  };

  const softRev:vNode = {
    type: NodeType.Element,
    tag: 'softRev',
    children: [
      {
        type: NodeType.Text,
        content: '$root.getAscii(2)',
      },
    ],
  };
  head.children!.push(ppId, mdln, softRev);
  return head;
}

function createRecipeBody(recipeList: SecsList, options: CCODE): vNode {
  const body:vNode = {
    type: NodeType.Element,
    tag: 'body',
    children: [],
  };
  // 生成生成几个控制语句
  const setBodyStatement: vNode = {
    type: NodeType.AssignmentExpression,
    statement: {
      left: '$body',
      right: '$root.get(3))',
    },
  };

  const forStatement: vNode = {
    type: NodeType.ForeachExpression,
    statement: {
      item: '$step',
      obj: '$body',
    },
    children: [],
  };
  for (const recipe of recipeList.children) {
    const ccIdNode = (recipe as SecsList).children[0] as SecsNode;
    const ccId = ccIdNode.value;
    const paramList = (recipe as SecsList).children[1] as SecsList;
    // 检查有没有配置CCODE
    if (options[ccId as string] === undefined) {
      throw new Error(`CCODE:${ccId} not found`);
    }
    const paramSetConfig = options[ccId as string]?.paramSet
    // 检查配置的参数是否一致
    if (paramList.children.length !== paramSetConfig.length) {
      throw new Error(`CCODE:${ccId} paramSet length not match`);
    }

    const ifStatement: vNode = {
      type: NodeType.IfStatement,
      statement: {
        left: '$step.getAscii(0)',
        right: `"${ccId}"`,
        call: '$StringUtils.equals',
      },
      children: [],
    };
    const paramsAssignment: vNode = {
      type: NodeType.AssignmentExpression,
      statement: {
        left: '$params',
        right: '$step.get(1))',
      },
      children: [],
    };
    ifStatement.children!.push(paramsAssignment);

    const paramSet = createParamSet(paramList, paramSetConfig);
    ifStatement.children!.push(paramSet);
    forStatement.children!.push(ifStatement);
  }

  body.children!.push(setBodyStatement);
  body.children!.push(forStatement);

  return body;
}

function createParamSet(paramList: SecsList, paramOptions: CCODEParam[]): vNode {
  const paramSet:vNode = {
    type: NodeType.Element,
    tag: 'paramSet',
    children: [],
  };

  for (let i = 0; i < paramList.children.length; i++) {
    const node = paramList.children[i];
    const paramNode = {
      type: NodeType.Element,
      tag: 'param',
      props: {
        name: paramOptions[i].name,
        value: createGetFun(node.type, i),
        type: secsNodeType2DataType(node.type),
      },
    };
    paramSet.children!.push(paramNode);
  }

  return paramSet;
}
