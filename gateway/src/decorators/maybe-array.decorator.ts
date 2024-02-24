import { Transform } from 'class-transformer';


export function MaybeArray() {
  return Transform(({ value }) => {
    if (!value) {
      return [];
    }

    return Array.isArray(value) ? value : [ value ];
  });
}
