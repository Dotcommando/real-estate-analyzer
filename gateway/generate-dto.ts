import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { ImportDeclaration, ImportDeclarationStructure, InterfaceDeclaration, Project, SourceFile } from 'ts-morph';


config();

const interfacesPathString = process.env.GENERATE_DTO_FOR_INTERFACES || '[]';
const outputDir = process.env.GENERATED_DTOS_OUTPUT_PATH || './src/generated/dto';
const interfacesPaths: string[] = JSON.parse(interfacesPathString);
const project = new Project();

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

interfacesPaths.forEach(interfacePath => {
  const sourceFile: SourceFile = project.addSourceFileAtPath(interfacePath);
  const imports: ImportDeclaration[] = sourceFile.getImportDeclarations();
  const interfaces: InterfaceDeclaration[] = sourceFile.getInterfaces();
  const interfaceFileName = path.basename(interfacePath);
  const dtoFileName = interfaceFileName.replace('.interface.ts', '.dto.ts');
  const dtoFilePath = path.join(outputDir, dtoFileName);
  const dtoFile: SourceFile = project.createSourceFile(dtoFilePath, '', { overwrite: true });

  imports.forEach((importDeclaration: ImportDeclaration) => {
    const importClause: ImportDeclarationStructure = importDeclaration.getStructure();

    if (importClause.moduleSpecifier.startsWith('.')) {
      const newModuleSpecifier = path.relative(
        path.dirname(dtoFilePath),
        path.resolve(path.dirname(interfacePath), importClause.moduleSpecifier),
      );

      importClause.moduleSpecifier = newModuleSpecifier.split(path.sep).join('/');
      if (!importClause.moduleSpecifier.startsWith('.')) {
        importClause.moduleSpecifier = './' + importClause.moduleSpecifier;
      }
    }

    dtoFile.addImportDeclaration(importClause);
  });

  interfaces.forEach((interfaceDecl: InterfaceDeclaration) => {
    const interfaceName = interfaceDecl.getName();
    const dtoClassName = interfaceName.replace(/^I/, '') + 'Dto';

    dtoFile.addClass({
      name: dtoClassName,
      isExported: true,
      // Здесь можно добавить свойства и методы, если это необходимо
    });
  });

  dtoFile.saveSync();
});

console.log('DTO generation completed.');
