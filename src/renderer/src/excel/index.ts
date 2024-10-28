import { VNode } from "vue";


 type CodegenNode = { name: string };

 interface ExcelCodegenContext {
    source: string;
    data: [];
    line: number;
    column: number;
    offset: number;
    indentLevel: number;
    helper(key: symbol): string;
    push(code: string, newlineIndex?: number, node?: CodegenNode): void;
    indent(): void;
    deIndent(withoutNewLine?: boolean): void;
    newline(): void;
  }
  
export function generateExcel(ast:VNode) {
    
}

