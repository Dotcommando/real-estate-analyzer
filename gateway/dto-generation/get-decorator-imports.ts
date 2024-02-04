import * as path from 'path';


export function getDecoratorImports(
  decoratorsConfig: { decorators: string; importFrom: string }[],
  outputDir: string,
): Map<string, string[]> {
  const importsMap = new Map<string, string[]>();

  decoratorsConfig.forEach(({ decorators, importFrom }) => {
    const decoratorsToAdd = decorators.split(',').map(decorator => decorator.trim());
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
    decoratorsToAdd.forEach(decorator => {
      if (!importsMap.get(moduleSpecifier).includes(decorator)) {
        importsMap.get(moduleSpecifier).push(decorator);
      }
    });
  });

  return importsMap;
}
