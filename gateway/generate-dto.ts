import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import {
  ClassDeclaration,
  EnumDeclaration,
  ImportDeclaration,
  ImportSpecifier,
  InterfaceDeclaration,
  Project,
  PropertySignature,
  SourceFile,
  SyntaxKind,
  Type,
} from 'ts-morph';

import {
  addMissingEnumArrayImports,
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
  getEnumFromImport,
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
  const property = dtoClass.addProperty({
    name: propName,
    type: propType === 'Date' ? 'string' : propType,
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

function addNestedProperty(
  dtoClass: ClassDeclaration,
  prop: PropertySignature,
  enumsMap: Map<string, EnumDeclaration>,
  basePath: string = '',
): void {
  const propName = prop.getName();
  const propType = prop.getType();

  processType(propType, propName, basePath, enumsMap, dtoClass);
}

function processType(
  type: Type,
  propName: string,
  basePath: string,
  enumsMap: Map<string, EnumDeclaration>,
  dtoClass: ClassDeclaration,
): void {
  function replaceEnumNames(propName: string): string {
    return propName.replace(/\[(.*?)\]/g, (match, enumName) => {
      const [ cleanEnumName, enumProp ] = enumName.split('.');
      const enumDecl: EnumDeclaration = enumsMap.get(cleanEnumName);

      return enumDecl ? enumDecl.getMember(enumProp).getValue() : enumName;
    });
  }

  const fullPropName = basePath ? `${basePath}.${propName}` : propName;
  const finalPropName = replaceEnumNames(fullPropName);
  const symbol = type.getSymbol();

  if (symbol && enumsMap.has(symbol.getName())) {
    console.log(`Enum property: ${finalPropName}`);

    return;
  }

  if (type.isObject()) {
    console.log(`Object property: ${finalPropName}`);
    type.getProperties().forEach((subPropSymbol) => {
      const subProp = subPropSymbol.getValueDeclarationOrThrow().asKindOrThrow(SyntaxKind.PropertySignature);

      processType(subProp.getType(), subProp.getName(), finalPropName, enumsMap, dtoClass);
    });

    return;
  }

  const typeArguments = type.getTypeArguments();

  if (typeArguments.length > 0) {
    console.log(`Generic property: ${finalPropName}`);
    typeArguments.forEach((typeArg, index) => {
      processType(typeArg, `${propName}<${index}>`, basePath, enumsMap, dtoClass);
    });

    return;
  }

  console.log(`Simple property: ${finalPropName}`);
}

async function fillEnumsMapFromImports(
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

    const missingImports = findMissingEnumArrayImports(dtoText, existingEnums);

    addMissingEnumArrayImports(dtoFilePath, missingImports);
  });

  console.log('DTO generation completed.');
})();
