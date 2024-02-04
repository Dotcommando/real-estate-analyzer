export function parseDecorator(decoratorCode: string): [string, string[]] {
  const matches = decoratorCode.match(/^@(\w+)\((.*)\)$/);

  if (!matches) {
    throw new Error(`Cannot parse decorator code: ${decoratorCode}`);
  }

  const [ , decoratorName, decoratorArgsString ] = matches;
  const decoratorArgs = decoratorArgsString.split(/,(?![^[]*\]|[^"]*"\])/).map(arg => arg.trim());

  return [ decoratorName, decoratorArgs ];
}
