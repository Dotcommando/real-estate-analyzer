import { ClassDeclaration, CodeBlockWriter, PropertyDeclaration } from 'ts-morph';

import { parseDecorator } from './parse-decorator';


export function addPropertyWithDecorators(
  dtoClass: ClassDeclaration,
  propName: string,
  propType: string,
  isOptional: boolean,
  decorators: string[],
  firstProperty: boolean,
) {
  const property: PropertyDeclaration = dtoClass.addProperty({
    name: propName,
    type: propType === 'Date' ? 'string' : propType,
    hasQuestionToken: isOptional,
    decorators: [],
    leadingTrivia: (writer: CodeBlockWriter) => {
      if (!firstProperty) {
        writer.blankLine();
      }
    },
  });

  decorators.forEach(decoratorCode => {
    const [ decoratorName, decoratorArgs ] = parseDecorator(decoratorCode);

    property.addDecorator({
      name: decoratorName,
      arguments: decoratorArgs,
    });
  });
}
