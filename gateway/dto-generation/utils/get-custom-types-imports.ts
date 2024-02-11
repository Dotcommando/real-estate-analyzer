import * as fs from 'fs';
import * as path from 'path';
import { ImportDeclaration, ImportSpecifier, SourceFile } from 'ts-morph';


export function getCustomTypeImports(
  customTypes: Set<string>,
  sourceFile: SourceFile,
  outputDir: string,
): Map<string, string[]> {
  const importsMap = new Map<string, string[]>();

  sourceFile.getImportDeclarations().forEach((sourceImport: ImportDeclaration) => {
    const namedImports = sourceImport.getNamedImports().map((ni: ImportSpecifier) => ni.getName());
    const intersection = namedImports.filter(name => customTypes.has(name));

    if (intersection.length > 0) {
      const moduleSpecifier = sourceImport.getModuleSpecifier().getLiteralValue();
      const absolutePath = path.resolve(path.dirname(sourceFile.getFilePath()), moduleSpecifier);
      let relativePath = path.relative(outputDir, absolutePath);

      relativePath = relativePath
        .split(path.sep)
        .join('/')
        .replace(/\.ts$/, '');

      if (!relativePath.startsWith('.') && !relativePath.startsWith('..')) {
        relativePath = './' + relativePath;
      }

      if (relativePath.endsWith('/index')) {
        relativePath = relativePath.substring(0, relativePath.length - 6);
      }

      const pathParts = relativePath.split('/');

      if (pathParts.length > 1) {
        const checkPath = pathParts.slice(0, -1).join('/');
        const indexPath = path.join(outputDir, checkPath, 'index.ts');

        if (fs.existsSync(indexPath)) {
          relativePath = checkPath;
        }
      }

      if (!importsMap.has(relativePath)) {
        importsMap.set(relativePath, []);
      }

      intersection.forEach(type => {
        if (!importsMap.get(relativePath).includes(type)) {
          importsMap.get(relativePath).push(type);
        }
      });
    }
  });

  return importsMap;
}
