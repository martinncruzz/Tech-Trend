import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'TotalRange', async: false })
export class TotalRangeConstraint implements ValidatorConstraintInterface {
  validate(_value: any, args: ValidationArguments): boolean {
    const object = args.object as any;

    if (object.minTotal && object.maxTotal) return object.minTotal <= object.maxTotal;

    return true;
  }

  defaultMessage(): string {
    return 'maxTotal must be greater than or equal to minTotal';
  }
}
