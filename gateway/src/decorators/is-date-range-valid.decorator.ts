import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';


@ValidatorConstraint({ async: false })
export class IsDateRangeValid implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const { $gte, $gt, $lte, $lt } = value;

    if ($gte && $lt && new Date($lt) <= new Date($gte)) {
      return false;
    }
    if ($gte && $lte && new Date($lte) <= new Date($gte)) {
      return false;
    }
    if ($gt && $lt && new Date($lt) <= new Date($gt)) {
      return false;
    }
    if ($gt && $lte && new Date($lte) <= new Date($gt)) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'The end date must be greater than the start date.';
  }
}
