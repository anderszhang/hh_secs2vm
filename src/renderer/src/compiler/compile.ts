import { generate } from './codegen';
import { CCODE, CCODEConfig } from './options';
import { secsParse } from './parse';
import { transform } from './transform';

export function compile(source: string, options: CCODE) {
  const ast = secsParse(source);
  const vNodeAst = transform(ast, options);
  const code = generate(vNodeAst);
  return code;
}
