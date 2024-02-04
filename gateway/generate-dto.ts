import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import {
  InterfaceDeclaration,
  Project,
  PropertySignature,
  SourceFile,
} from 'ts-morph';

import { getCustomTypeImports, getCustomTypes, getDecoratorImports, mergeImports } from './dto-generation';


config();

const interfacesPathString = process.env.GENERATE_DTO_FOR_INTERFACES || '[]';
const nestedPropertiesString = process.env.DTO_GENERATION_PROCESS_NESTED || '[]';
const decoratorsConfigString = process.env.DTO_GENERATION_USE_DECORATORS || '[]';
const outputDir = process.env.GENERATED_DTOS_OUTPUT_PATH || './src/generated/dto';
const interfacesPaths: string[] = JSON.parse(interfacesPathString);
const nestedProperties: string[] = JSON.parse(nestedPropertiesString);
const decoratorsConfig: { decorators: string; importFrom: string }[] = JSON.parse(decoratorsConfigString);
const project = new Project();

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function isNestedProperty(propertyName: string): boolean {
  return nestedProperties.includes(propertyName);
}

function addSimpleProperty(dtoClass: any, prop: PropertySignature, firstProperty: boolean) {
  const propName = prop.getName();
  const propType = prop.getTypeNode()?.getText() || 'any';

  dtoClass.addProperty({
    name: propName,
    type: propType,
    hasQuestionToken: prop.hasQuestionToken(),
    leadingTrivia: writer => {
      if (!firstProperty) {
        writer.newLine().newLine();
      }
    },
  });
}

function addNestedProperty(dtoClass: any, prop: PropertySignature) {
  // Реализация будет добавлена позже
}

interfacesPaths.forEach(interfacePath => {
  const sourceFile: SourceFile = project.addSourceFileAtPath(interfacePath);
  const interfaces: InterfaceDeclaration[] = sourceFile.getInterfaces();
  const interfaceFileName = path.basename(interfacePath);
  const dtoFileName = interfaceFileName.replace('.interface.ts', '.dto.ts');
  const dtoFilePath = path.join(outputDir, dtoFileName);
  const dtoFile: SourceFile = project.createSourceFile(dtoFilePath, '', { overwrite: true });
  const decoratorImportsMap: Map<string, string[]> = getDecoratorImports(decoratorsConfig, outputDir);
  let customTypeImportsMap = new Map<string, string[]>();

  interfaces.forEach((interfaceDecl: InterfaceDeclaration, index) => {
    const interfaceName = interfaceDecl.getName();
    const dtoClassName = interfaceName.replace(/^I/, '') + 'Dto';
    const dtoClass = dtoFile.addClass({
      name: dtoClassName,
      isExported: true,
    });

    let firstProperty = true;

    interfaceDecl.getProperties().forEach((prop: PropertySignature) => {
      if (isNestedProperty(prop.getName())) {
        addNestedProperty(dtoClass, prop);
      } else {
        addSimpleProperty(dtoClass, prop, firstProperty);
        firstProperty = false;
      }
    });

    customTypeImportsMap = mergeImports(customTypeImportsMap, getCustomTypeImports(getCustomTypes(interfaceDecl), sourceFile, outputDir));
  });

  const finalImportsMap: Map<string, string[]> = mergeImports(decoratorImportsMap, customTypeImportsMap);

  finalImportsMap.forEach((imports, moduleSpecifier) => {
    dtoFile.addImportDeclaration({
      moduleSpecifier,
      namedImports: imports,
    });
  });

  dtoFile.saveSync();
});

console.log('DTO generation completed.');
