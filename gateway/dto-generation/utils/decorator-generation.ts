import { toPascalCase } from './to-pascal-case';


export function generateIsOptional(isOptional: boolean): string {
  return isOptional ? '@IsOptional()' : '';
}

export function generateMaybeArray(): string {
  return '@MaybeArray()';
}

export function generateIsArray(fieldName: string): string {
  return '@IsArray({ message: "Field ' + fieldName.replace(/'/g, '') + ' must contain an array" })';
}

export function generateArrayMaxSize(fieldName: string): string {
  const field = fieldName.replace(/'/g, '').toUpperCase().replace(/-/g, '_') + '_ARRAY_MAX_SIZE';

  return '@ArrayMaxSize(getIntFromEnv(\"' + field + '\", 5))';
}


export function generateIsString(fieldName: string, isArray: boolean = false): string {
  return `@IsString({ ${isArray ? 'each: true, ' : ''}message: 'Each ${fieldName.replace(/'/g, '')} must be a string' })`;
}

export function generateMaxLength(fieldName: string, isArray: boolean = false): string {
  return `@MaxLength(getIntFromEnv(\'STRING_MAX_LENGTH\', 128), { ${isArray ? 'each: true, ' : ''}message: \`Maximum length of each ${fieldName.replace(/'/g, '')} is \${getIntFromEnv(\'STRING_MAX_LENGTH\', 128)} characters\` })`;
}

export function generateIsUrl(fieldName: string, isUrl: boolean, isArray: boolean = false): string {
  return isUrl ? `@IsUrl({}, { ${isArray ? 'each: true, ' : ''}message: 'Each URL in ${fieldName} must be a valid URL' })` : '';
}

export function generateIsInDecorator(fieldName: string, enumName: string, message?: string): string {
  const field = fieldName.replace(/'/g, '');
  const enumArrayName = toPascalCase(enumName) + 'Array';
  const errorMessage = message || `Each ${field} must be a valid value`;

  return `@IsIn(${enumArrayName}, { each: true, message: '${errorMessage}' })`;
}

