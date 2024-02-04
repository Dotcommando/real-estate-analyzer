import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import {
  InterfaceDeclaration,
  Project,
  PropertySignature,
  SourceFile,
} from 'ts-morph';

import {
  generateArrayMaxSize,
  generateIsArray,
  generateIsInDecorator,
  generateIsOptional,
  generateIsString,
  generateIsUrl,
  generateMaxLength,
  generateMaybeArray,
  getCustomTypeImports,
  getCustomTypes,
  getDecoratorImports,
  getFunctionImports,
  mergeImports,
  parseDecorator,
} from './dto-generation';


config();

const interfacesPathString = process.env.GENERATE_DTO_FOR_INTERFACES || '[]';
const nestedPropertiesString = process.env.DTO_GENERATION_PROCESS_NESTED || '[]';
const decoratorsConfigString = process.env.DTO_GENERATION_USE_DECORATORS || '[]';
const functionsConfigString = process.env.DTO_GENERATION_USE_FUNCTIONS || '[]';
const outputDir = process.env.GENERATED_DTOS_OUTPUT_PATH || './src/generated/dto';
const interfacesPaths: string[] = JSON.parse(interfacesPathString);
const nestedProperties: string[] = JSON.parse(nestedPropertiesString);
const decoratorsConfig: { decorators: string; importFrom: string }[] = JSON.parse(decoratorsConfigString);
const functionsConfig: { functions: string; importFrom: string }[] = JSON.parse(functionsConfigString);
const project = new Project();

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function isNestedProperty(propertyName: string): boolean {
  return nestedProperties.includes(propertyName);
}

function generateDecoratorsForField(
  fieldName: string,
  fieldType: string,
  isOptional: boolean,
  isUrlField: boolean = false,
): string[] {
  const isArray = fieldType.startsWith('AG_MayBeArray');
  const isRange = fieldType.startsWith('AG_MayBeRange');
  const isEnum = !fieldType.includes('string') && !isRange;
  const decorators = [
    generateIsOptional(isOptional),
    generateMaybeArray(),
  ];

  if (isArray) {
    decorators.push(
      generateIsArray(fieldName),
      generateArrayMaxSize(fieldName),
    );
  }

  if (isArray && fieldType.includes('string')) {
    decorators.push(
      generateIsString(fieldName, isArray),
      generateMaxLength(fieldName, isArray),
    );
  }

  if (isUrlField) {
    decorators.push(generateIsUrl(fieldName, true, isArray));
  }

  if (isEnum) {
    decorators.push(generateIsInDecorator(fieldName));
  }

  return decorators.filter(Boolean);
}

function addSimpleProperty(dtoClass: any, prop: PropertySignature, firstProperty: boolean) {
  const propName = prop.getName();
  const propType = prop.getTypeNode()?.getText() || 'any';
  const isOptional = prop.hasQuestionToken();
  const isUrlField = propName === 'url';
  const decorators = generateDecoratorsForField(propName, propType, isOptional, isUrlField);
  const property = dtoClass.addProperty({
    name: propName,
    type: propType,
    hasQuestionToken: isOptional,
    decorators: [],
    leadingTrivia: writer => {
      if (!firstProperty) {
        writer.blankLine();
      }
    },
  });

  decorators.forEach(decoratorCode => {
    const [ decoratorName, decoratorArgs ] = parseDecorator(decoratorCode);

    property.addDecorator({
      name: decoratorName,
      arguments: decoratorArgs,
    });
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
  const functionImportsMap: Map<string, string[]> = getFunctionImports(functionsConfig, outputDir);
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

  let finalImportsMap: Map<string, string[]> = mergeImports(decoratorImportsMap, customTypeImportsMap);

  finalImportsMap = mergeImports(finalImportsMap, functionImportsMap);

  finalImportsMap.forEach((imports, moduleSpecifier) => {
    dtoFile.addImportDeclaration({
      moduleSpecifier,
      namedImports: imports,
    });
  });

  dtoFile.saveSync();
});

console.log('DTO generation completed.');
