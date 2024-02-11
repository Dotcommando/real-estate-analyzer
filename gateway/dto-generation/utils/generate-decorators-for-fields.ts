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


export function generateDecoratorsForField(
  fieldName: string,
  fieldType: string,
  isOptional: boolean,
  isUrlField: boolean = false,
): string[] {
  const isArray = fieldType.startsWith('AG_MayBeArray');
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
