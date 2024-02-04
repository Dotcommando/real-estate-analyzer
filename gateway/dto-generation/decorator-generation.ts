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
  return `@MaxLength(getIntFromEnv(\'STRING_MAX_LENGTH\', 64), { ${isArray ? 'each: true, ' : ''}message: 'Maximum length of each ${fieldName.replace(/'/g, '')} is \${process.env.STRING_MAX_LENGTH} characters' })`;
}

export function generateIsUrl(fieldName: string, isUrl: boolean, isArray: boolean = false): string {
  return isUrl ? `@IsUrl({}, { ${isArray ? 'each: true, ' : ''}message: 'Each URL in ${fieldName} must be a valid URL' })` : '';
}
