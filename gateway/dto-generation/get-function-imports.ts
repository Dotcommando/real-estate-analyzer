import * as path from 'path';


export function getFunctionImports(
  functionsConfig: { functions: string; importFrom: string }[],
  outputDir: string,
): Map<string, string[]> {
  const importsMap = new Map<string, string[]>();

  functionsConfig.forEach(({ functions, importFrom }) => {
    const functionsToAdd = functions.split(',').map(func => func.trim());
    let moduleSpecifier = importFrom;

    if (importFrom.startsWith('./')) {
      const scriptDirPath = path.resolve(__dirname).replace(/\/dist\/dto-generation$/, '');
      const absolutePath = path.resolve(scriptDirPath, importFrom);
      const relativePathFromOutputDir = path.relative(outputDir, absolutePath).split(path.sep).join('/');

      moduleSpecifier = relativePathFromOutputDir.replace(/index\.(ts)?$/, '');

      if (!moduleSpecifier.startsWith('.')) {
        moduleSpecifier = './' + moduleSpecifier;
      }
    }

    if (!importsMap.has(moduleSpecifier)) {
      importsMap.set(moduleSpecifier, []);
    }

    functionsToAdd.forEach(func => {
      if (!importsMap.get(moduleSpecifier).includes(func)) {
        importsMap.get(moduleSpecifier).push(func);
      }
    });
  });

  return importsMap;
}
