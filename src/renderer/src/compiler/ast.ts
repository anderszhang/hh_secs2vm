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
