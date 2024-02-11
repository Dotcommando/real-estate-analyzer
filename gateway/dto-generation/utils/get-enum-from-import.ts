import * as fs from 'fs';
import * as path from 'path';
import { EnumDeclaration, ExportDeclaration, Project, SourceFile } from 'ts-morph';


export function getEnumFromImport(
  currentFilePath: string,
  importPath: string,
  enumName: string,
): EnumDeclaration | null {
  const project = new Project();
  let absoluteImportPath = path.resolve(path.dirname(currentFilePath), importPath);

  if (!fs.existsSync(absoluteImportPath) && fs.existsSync(path.join(absoluteImportPath, 'index.ts'))) {
    absoluteImportPath = path.join(absoluteImportPath, 'index.ts');
  } else if (!absoluteImportPath.endsWith('.ts')) {
    absoluteImportPath += '.ts';
  }

  // Пытаемся добавить файл в проект
  const sourceFile = project.addSourceFileAtPathIfExists(absoluteImportPath);

  if (!sourceFile) {
    console.error(`File not found: ${absoluteImportPath}`);

    return null;
  }

  // Пытаемся найти объявление enum напрямую
  let enumDeclaration = sourceFile.getEnum(enumName);

  if (!enumDeclaration) {
    // Если не нашли, ищем в экспортах index файла
    const exportPaths = parseExportsFromIndexFile(sourceFile);

    for (const exportPath of exportPaths) {
      const exportSourceFile = project.addSourceFileAtPathIfExists(
        path.resolve(path.dirname(absoluteImportPath), exportPath + '.ts'),
      );

      enumDeclaration = exportSourceFile?.getEnum(enumName);
      if (enumDeclaration) break; // Выходим из цикла, если нашли enum
    }
  }

  if (!enumDeclaration) {
    console.error(`Enum ${enumName} not found in ${absoluteImportPath}`);

    return null;
  }

  return enumDeclaration;
}

function parseExportsFromIndexFile(sourceFile: SourceFile): string[] {
  const exports: string[] = [];

  sourceFile.getExportDeclarations().forEach((exportDecl: ExportDeclaration) => {
    const moduleSpecifier = exportDecl.getModuleSpecifierValue();

    if (moduleSpecifier) {
      exports.push(moduleSpecifier);
    }
  });

  return exports;
}
