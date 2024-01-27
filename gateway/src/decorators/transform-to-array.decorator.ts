import { Transform } from 'class-transformer';


export function TransformToArray() {
  return Transform(({ value }) => typeof value === 'string' ? value.split(',') : value);
}
