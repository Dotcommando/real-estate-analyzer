import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import {
  ClassDeclaration,
  EnumDeclaration,
  InterfaceDeclaration,
  Project,
  PropertySignature,
  SourceFile,
} from 'ts-morph';

import {
  addMissingEnumArrayImports,
  addPropertyWithDecorators,
  EnumImportDetail,
  fillEnumsMapFromImports,
  findMissingEnumArrayImports,
  generateDecoratorsForField,
  getCustomTypeImports,
  getCustomTypes,
  getDecoratorImports,
  getFunctionImports,
  mergeImports,
  processType,
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

function addSimpleProperty(dtoClass: ClassDeclaration, prop: PropertySignature | { name: string; type: string; isOptional: boolean }, firstProperty: boolean) {
  const propName = 'getName' in prop ? prop.getName() : prop.name;
  const isOptional = 'hasQuestionToken' in prop ? prop.hasQuestionToken() : prop.isOptional;
  const propType = 'getTypeNode' in prop ? (prop.getTypeNode()?.getText() || '') : prop.type;
  const formattedPropName = propName.includes('.') || propName.includes('[') ? `'${propName.replace(/'/g, '')}'` : propName;

  if (propType.startsWith('AG_MayBeRange')) {
    const typeMatch = propType.match(/AG_MayBeRange<(.+?)>/);
    const baseType = typeMatch ? typeMatch[1] : 'unknown';

    processMayBeRange(dtoClass, formattedPropName, baseType, isOptional, firstProperty);
  } else if (propType.startsWith('AG_MayBeArray')) {
    processMayBeArray(dtoClass, formattedPropName, propType, isOptional, firstProperty);
  } else {
    const decorators = generateDecoratorsForField(formattedPropName, propType, isOptional);

    addPropertyWithDecorators(dtoClass, formattedPropName, propType, isOptional, decorators, firstProperty);
  }
}

function processMayBeRange(dtoClass: ClassDeclaration, propName: string, baseType: string, isOptional: boolean, firstProperty: boolean) {
  const rangeFields = [ '[$lte]', '[$lt]', '[$eq]', '[$gt]', '[$gte]' ];

  rangeFields.forEach(suffix => {
    const rangePropName = `'${propName.replace(/'/g, '')}${suffix}'`;
    const decorators = baseType === 'Date'
      ? [ '@IsOptional()', `@IsDateString({}, { message: "${rangePropName} must be a valid date string" })` ]
      : [ '@IsOptional()', `@IsNumber({}, { message: "${rangePropName} must be a valid number" })` ];

    addPropertyWithDecorators(dtoClass, rangePropName, baseType, isOptional, decorators, firstProperty);
    firstProperty = false;
  });
}

function processMayBeArray(dtoClass: ClassDeclaration, propName: string, propType: string, isOptional: boolean, firstProperty: boolean) {
  const decorators = generateDecoratorsForField(propName, propType, isOptional, false);

  addPropertyWithDecorators(dtoClass, propName, propType, isOptional, decorators, firstProperty);
}

function addNestedProperty(
  dtoClass: ClassDeclaration,
  prop: PropertySignature,
  enumsMap: Map<string, EnumDeclaration>,
  basePath: string = '',
): void {
  const isParentOptional = prop.hasQuestionToken();
  const nestedProperties = processType(prop.getType(), prop.getName(), basePath, enumsMap, dtoClass, isParentOptional);

  let firstProperty = true;

  nestedProperties.forEach(nestedProp => {
    addSimpleProperty(dtoClass, nestedProp, firstProperty);
    firstProperty = false;
  });
}

(async (): Promise<void> => {
  const enumsMap = new Map<string, EnumDeclaration>();

  for (const interfacePath of interfacesPaths) {
    const sourceFile: SourceFile = project.addSourceFileAtPath(interfacePath);

    await fillEnumsMapFromImports(sourceFile, interfacePath, enumsMap);
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
          addNestedProperty(dtoClass, prop, enumsMap);
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

    const dtoText = fs.readFileSync(dtoFilePath, 'utf8');
    const existingEnums = new Set<string>();
    const importRegex = /import { ([^}]+) } from ['"]([^'"]*constants)['"]/g;
    let match;

    while ((match = importRegex.exec(dtoText)) !== null) {
      match[1].split(',').forEach(enumOrArray => {
        existingEnums.add(enumOrArray.trim());
      });
    }

    const missingImports: EnumImportDetail[] = findMissingEnumArrayImports(dtoText, existingEnums);

    addMissingEnumArrayImports(dtoFilePath, missingImports);
  });

  console.log('DTO generation completed.');
})();
