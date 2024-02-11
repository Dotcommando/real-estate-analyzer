import { InterfaceDeclaration, PropertySignature, SyntaxKind } from 'ts-morph';


export function getCustomTypes(interfaceDecl: InterfaceDeclaration): Set<string> {
  const customTypes = new Set<string>();

  function processTypeNode(typeNode) {
    if (!typeNode) return;
    if (typeNode.getKind() === SyntaxKind.TypeReference) {
      const typeName = typeNode.getTypeName().getText();

      customTypes.add(typeName);

      const typeArguments = typeNode.getTypeArguments();

      typeArguments.forEach(arg => {
        const argTypeNode = arg;

        if (argTypeNode && argTypeNode.getKind() === SyntaxKind.TypeReference) {
          processTypeNode(argTypeNode);
        }
      });
    } else if (typeNode.getKind() === SyntaxKind.ArrayType) {
      const elementType = typeNode.getElementType();

      processTypeNode(elementType);
    }
  }

  interfaceDecl.getProperties().forEach((prop: PropertySignature) => {
    const typeNode = prop.getTypeNode();

    processTypeNode(typeNode);
  });

  return customTypes;
}
