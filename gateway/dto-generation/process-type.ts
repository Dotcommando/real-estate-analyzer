import { ClassDeclaration, EnumDeclaration, SyntaxKind, Type, TypeFormatFlags } from 'ts-morph';


export function processType(
  type: Type,
  propName: string,
  basePath: string,
  enumsMap: Map<string, EnumDeclaration>,
  dtoClass: ClassDeclaration,
  isParentOptional: boolean,
): { name: string; type: string; isOptional: boolean }[] {
  const properties = [];

  function replaceEnumNames(propName: string): string {
    return propName.replace(/\[(.*?)\]/g, (match, enumName) => {
      const [ cleanEnumName, enumProp ] = enumName.split('.');
      const enumDecl: EnumDeclaration = enumsMap.get(cleanEnumName);

      return enumDecl ? enumDecl.getMember(enumProp).getValue() : enumName;
    });
  }

  function addProperty(name: string, type: string, isOptional: boolean) {
    properties.push({ name, type, isOptional: isOptional || isParentOptional });
  }

  const fullPropName = basePath ? `${basePath}.${propName}` : propName;
  const finalPropName = replaceEnumNames(fullPropName);

  if (type.isObject()) {
    type.getProperties().forEach((subPropSymbol) => {
      const subProp = subPropSymbol.getValueDeclarationOrThrow().asKindOrThrow(SyntaxKind.PropertySignature);
      const subProperties = processType(subProp.getType(), subProp.getName(), finalPropName, enumsMap, dtoClass, isParentOptional);

      properties.push(...subProperties);
    });

    return properties;
  }

  const typeArguments = type.getTypeArguments();

  if (typeArguments.length > 0) {
    typeArguments.forEach((typeArg, index) => {
      const subProperties = processType(typeArg, `${propName}<${index}>`, basePath, enumsMap, dtoClass, isParentOptional);

      properties.push(...subProperties);
    });

    return properties;
  }

  const isOptional = type.isNullable() || isParentOptional;
  const typeText = type.getText(undefined, TypeFormatFlags.NoTruncation);

  addProperty(finalPropName, typeText, isOptional);

  return properties;
}
