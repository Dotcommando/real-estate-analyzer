import {
  buildMessage,
  ValidateBy,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';


export function IsDate(validationOptions?: ValidationOptions & { optional?: boolean }): PropertyDecorator {
  return ValidateBy({
    name: 'IsDate',
    constraints: [ validationOptions?.[0] ],
    validator: {
      validate: (value, args?: ValidationArguments) => value instanceof Date
        && /^\d{4}-\d{2}-\d{2}/.test(JSON.stringify(value).replace(/["']*/g, '')),
      defaultMessage: buildMessage(eachPrefix => eachPrefix + 'Query parameter $property should be a date in YYYY-MM-DD format, example: 2023-07-28', validationOptions),
    },
  }, validationOptions);
}
