export enum NodeType {
  Element,
  Text,
  Comment,
  AssignmentExpression,
  IfStatement,
  ForeachExpression,
}

export type vNode = {
  type: NodeType;
  tag?: string;
  content?: string;
  props?: Record<string, unknown>;
  statement?: AssignmentExpression | IfStatement | ForeachExpression;
  children?: vNode[];
};

export type AssignmentExpression = {
  left: string;
  right: string;
};

export type IfStatement = {
  left: string;
  right: string;
  operator: string;
  call?: string;
};

export type ForeachExpression = {
  obj: string;
  item: string;
};

export enum ExcelNodeType  {
  Root = 'root',
  Row = 'row',
  Cell= 'cell',
}

export type ExcelNode = {
  type: ExcelNodeType;
  value?: string|number|boolean;
  props?: Record<string, unknown>;
  children?: ExcelNode[];
};
