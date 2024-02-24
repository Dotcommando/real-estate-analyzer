import { Transform } from 'class-transformer';


export function TransformToEnumArray<TEnum>(enumArray: TEnum[]) {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      const values = value.split(',');

      return values.filter((val: string) => enumArray.includes(val as unknown as TEnum));
    } else if (Array.isArray(value)) {
      return value.filter(val => enumArray.includes(val as unknown as TEnum));
    }

    return [];
  });
}
