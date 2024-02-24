export interface FieldRelation {
  sourceName: string;
  targetNames: TargetField[];
  isOptional: boolean;
  sourceType: string;
}

export interface TargetField {
  name: string;
  isOptional: boolean;
  targetType: string;
}
