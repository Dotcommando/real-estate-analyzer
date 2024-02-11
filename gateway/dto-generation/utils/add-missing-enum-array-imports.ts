import * as fs from 'fs';

import { EnumImportDetail } from './enum-import-detail.interface';


export function addMissingEnumArrayImports(dtoFilePath: string, missingEnums: EnumImportDetail[]): void {
  const fileContent = fs.readFileSync(dtoFilePath, 'utf8');
  const lines = fileContent.split('\n');

  missingEnums.forEach(({ importPath, enums }) => {
    const importIndex = lines.findIndex(line => line.includes(importPath));

    if (importIndex !== -1) {
      enums.forEach(enumName => {
        const regex = new RegExp(`\\b${enumName}\\b(?!Array)`, 'g');

        lines[importIndex] = lines[importIndex].replace(regex, match => `${match}, ${match}Array`);
      });
    }
  });

  fs.writeFileSync(dtoFilePath, lines.join('\n'), 'utf8');
}
