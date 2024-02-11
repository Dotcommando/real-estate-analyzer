import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import {
  ClassDeclaration,
  CodeBlockWriter,
  EnumDeclaration,
  InterfaceDeclaration,
  Project,
  PropertyDeclaration,
  PropertySignature,
  SourceFile,
} from 'ts-morph';

import {
  addMissingEnumArrayImports,
  EnumImportDetail,
  fillEnumsMapFromImports,
  findMissingEnumArrayImports,
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

function generateDecoratorsForField(
  fieldName: string,
  fieldType: string,
  isOptional: boolean,
  isUrlField: boolean = false,
): string[] {
  const isArray = fieldType.startsWith('AG_MayBeArray');
  const isRange = fieldType.startsWith('AG_MayBeRange');
  const enumMatch = fieldType.match(/AG_MayBeArray<(.+?)>/);
  const enumName = (enumMatch && enumMatch[1] !== 'string') ? enumMatch[1] : null;
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

  if (enumName) {
    decorators.push(generateIsInDecorator(fieldName, enumName));
  }

  return decorators.filter(Boolean);
}

function addSimpleProperty(dtoClass: ClassDeclaration, prop: PropertySignature, firstProperty: boolean) {
  const propName = prop.getName();
  const propType = prop.getTypeNode()?.getText() || '';
  const isOptional = prop.hasQuestionToken();

  if (!propType.startsWith('AG_MayBeRange')) {
    const decorators = generateDecoratorsForField(propName, propType, isOptional);

    addPropertyWithDecorators(dtoClass, propName, propType, isOptional, decorators, firstProperty);
  } else {
    const typeMatch = propType.match(/AG_MayBeRange<(.+?)>/);
    const baseType = typeMatch ? typeMatch[1] : 'unknown';

    if (baseType !== 'number' && baseType !== 'Date') {
      throw new Error(`Unsupported AG_MayBeRange base type: ${baseType}`);
    }

    const rangeFields = [ '[$lte]', '[$lt]', '[$eq]', '[$gt]', '[$gte]' ];

    rangeFields.forEach(suffix => {
      const rangePropName = `'${propName.replace(/'/g, '')}${suffix}'`;
      const decorators = baseType === 'Date'
        ? [ '@IsOptional()', `@IsDateString({}, { message: "${rangePropName} must be a valid date string" })` ]
        : [ '@IsOptional()', baseType === 'number' ? `@IsNumber({}, { message: "${rangePropName} must be a valid number" })` : '' ];

      addPropertyWithDecorators(dtoClass, rangePropName, baseType, true, decorators, firstProperty);
      firstProperty = false;
    });
  }
}

function addPropertyWithDecorators(
  dtoClass: ClassDeclaration,
  propName: string,
  propType: string,
  isOptional: boolean,
  decorators: string[],
  firstProperty: boolean,
) {
  const property: PropertyDeclaration = dtoClass.addProperty({
    name: propName,
    type: propType === 'Date' ? 'string' : propType,
    hasQuestionToken: isOptional,
    decorators: [],
    leadingTrivia: (writer: CodeBlockWriter) => {
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

function addNestedProperty(
  dtoClass: ClassDeclaration,
  prop: PropertySignature,
  enumsMap: Map<string, EnumDeclaration>,
  basePath: string = '',
): void {
  const isParentOptional = prop.hasQuestionToken();
  const properties = processType(prop.getType(), prop.getName(), basePath, enumsMap, dtoClass, isParentOptional);

  properties.forEach(({ name, type, isOptional }) => {
    console.log(`Property: ${name}, Type: ${type}, Optional: ${isOptional}`);
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
