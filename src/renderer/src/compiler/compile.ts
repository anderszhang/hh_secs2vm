import { generate } from './codegen';
import { secsParse } from './parse';
import { transform } from './transform';

export function compile(source: string) {
  const ast = secsParse(source);
  const vNodeAst = transform(ast, {});
  const code = generate(vNodeAst);
  return code;
}
