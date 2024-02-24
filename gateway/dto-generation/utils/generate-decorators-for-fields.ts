import {
  generateArrayMaxSize,
  generateIsArray,
  generateIsInDecorator,
  generateIsOptional,
  generateIsString,
  generateIsUrl,
  generateMaxLength,
  generateMaybeArray,
} from './decorator-generation';


const nonEnumTypes = [ 'string', 'number', 'boolean', 'Date', 'RegExp' ];

export function generateDecoratorsForField(
  fieldName: string,
  fieldType: string,
  isOptional: boolean,
  isUrlField: boolean = false,
): string[] {
  const isArray = fieldType.endsWith('[]');
  const baseType = isArray ? fieldType.slice(0, -2) : fieldType;
  const isEnum = !nonEnumTypes.includes(baseType);
  const enumName = baseType;

  const decorators = [
    generateIsOptional(isOptional),
    generateMaybeArray(),
  ];

  if (isArray) {
    decorators.push(
      generateIsArray(fieldName),
      generateArrayMaxSize(fieldName),
    );

    if (baseType === 'string') {
      decorators.push(
        generateIsString(fieldName, isArray),
        generateMaxLength(fieldName, isArray),
      );
    } else if (enumName) {
      decorators.push(generateIsInDecorator(fieldName, enumName));
    }
  }

  if (isUrlField) {
    decorators.push(generateIsUrl(fieldName, true, isArray));
  }

  return decorators.filter(Boolean);
}
