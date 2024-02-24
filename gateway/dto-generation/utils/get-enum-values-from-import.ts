import * as fs from 'fs';
import * as path from 'path';
import { EnumDeclaration, EnumMember, ExportDeclaration, Project, SourceFile } from 'ts-morph';


export function getEnumValuesFromImport(
  currentFilePath: string,
  importPath: string,
  enumName: string,
): (string | number)[] | null {
  const project: Project = new Project();
  let absoluteImportPath = path.resolve(path.dirname(currentFilePath), importPath);

  if (!fs.existsSync(absoluteImportPath) && fs.existsSync(path.join(absoluteImportPath, 'index.ts'))) {
    absoluteImportPath = path.join(absoluteImportPath, 'index.ts');
  } else if (!absoluteImportPath.endsWith('.ts')) {
    absoluteImportPath += '.ts';
  }

  const sourceFile: SourceFile = project.addSourceFileAtPathIfExists(absoluteImportPath);

  if (!sourceFile) {
    console.error(`File not found: ${absoluteImportPath}`);

    return null;
  }

  let enumDeclaration: EnumDeclaration = sourceFile.getEnum(enumName);

  if (!enumDeclaration) {
    const exportPaths: string[] = parseExportsFromIndexFile(sourceFile);

    for (const exportPath of exportPaths) {
      const exportSourceFile: SourceFile = project.addSourceFileAtPathIfExists(
        path.resolve(path.dirname(absoluteImportPath), exportPath + '.ts'),
      );

      enumDeclaration = exportSourceFile?.getEnum(enumName);
      if (enumDeclaration) break;
    }
  }

  if (!enumDeclaration) {
    console.error(`Enum ${enumName} not found in ${absoluteImportPath}`);

    return null;
  }

  return enumDeclaration.getMembers().map((member: EnumMember) => member.getValue());
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
