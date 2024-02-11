import { EnumImportDetail } from './enum-import-detail.interface';


export function findMissingEnumArrayImports(dtoText: string, existingEnums: Set<string>): EnumImportDetail[] {
  const missingEnums: EnumImportDetail[] = [];

  existingEnums.forEach(enumName => {
    if (dtoText.includes(enumName + 'Array') && !existingEnums.has(enumName + 'Array')) {
      const regex = new RegExp(`import {([^}]*\\b${enumName}\\b[^}]*)} from ['"]([^'"]+)['"]`, 'g');
      const match = regex.exec(dtoText);

      if (match) {
        const [ , imports, importPath ] = match;
        const existingImport = missingEnums.find((detail: EnumImportDetail) => detail.importPath === importPath);

        if (existingImport) {
          existingImport.enums.push(enumName);
        } else {
          missingEnums.push({ importPath, enums: [ enumName ]});
        }
      }
    }
  });

  return missingEnums;
}
