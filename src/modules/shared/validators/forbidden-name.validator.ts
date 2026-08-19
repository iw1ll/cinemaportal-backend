import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'forbiddenName', async: false })
export class ForbiddenNameConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    return value?.toLowerCase() !== 'admin';
  }

  defaultMessage(): string {
    return 'Имя "admin" запрещено';
  }
}

export function ForbiddenName(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: ForbiddenNameConstraint,
    });
  };
}
