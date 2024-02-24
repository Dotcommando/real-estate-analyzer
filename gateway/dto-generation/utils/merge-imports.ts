export function mergeImports(sourceMap: Map<string, string[]>, finalImportsMap: Map<string, string[]>): Map<string, string[]> {
  sourceMap.forEach((imports, moduleSpecifier) => {
    if (!finalImportsMap.has(moduleSpecifier)) {
      finalImportsMap.set(moduleSpecifier, Array.from(new Set(imports)));
    } else {
      const existingImports: string[] = finalImportsMap.get(moduleSpecifier);

      imports.forEach((importName: string) => existingImports.push(importName));
    }
  });

  return new Map([ ...finalImportsMap ]);
}
