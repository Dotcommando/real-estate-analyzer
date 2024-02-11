import * as fs from 'fs';
import * as path from 'path';
import { EnumDeclaration, ImportDeclaration, ImportSpecifier, SourceFile } from 'ts-morph';

import { getEnumFromImport } from './get-enum-from-import';


export async function fillEnumsMapFromImports(
  sourceFile: SourceFile,
  currentFilePath: string,
  enumsMap: Map<string, EnumDeclaration>,
): Promise<void> {
  const importDeclarations: ImportDeclaration[] = sourceFile.getImportDeclarations();

  for (const importDeclaration of importDeclarations) {
    const moduleSpecifierValue = importDeclaration.getModuleSpecifierValue();
    let importPath = path.resolve(path.dirname(currentFilePath), moduleSpecifierValue);

    if (fs.existsSync(importPath + '.ts')) {
      importPath += '.ts';
    } else if (fs.existsSync(path.join(importPath, 'index.ts'))) {
      importPath = path.join(importPath, 'index.ts');
    } else {
      continue;
    }

    const namedImports: ImportSpecifier[] = importDeclaration.getNamedImports();

    for (const namedImport of namedImports) {
      const importName = namedImport.getName();
      const alias = namedImport.getAliasNode()?.getText();
      const enumName = alias || importName;
      const enumFromImport = getEnumFromImport(currentFilePath, importPath, importName);

      enumsMap.set(enumName, enumFromImport);
    }
  }
}
