import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'PriceRange', async: false })
export class PriceRangeConstraint implements ValidatorConstraintInterface {
  validate(_value: any, args: ValidationArguments): boolean {
    const object = args.object as any;

    if (object.minPrice && object.maxPrice) return object.minPrice <= object.maxPrice;

    return true;
  }

  defaultMessage(): string {
    return 'maxPrice must be greater than or equal to minPrice';
  }
}
