import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'SortByOrder', async: false })
export class SortByOrderConstraint implements ValidatorConstraintInterface {
  validate(_value: any, args: ValidationArguments) {
    const object = args.object as any;

    if (object.sortBy && !object.order) return false;
    if (!object.sortBy && object.order) return false;

    return true;
  }

  defaultMessage(): string {
    return 'sortBy and order must be provided together';
  }
}
