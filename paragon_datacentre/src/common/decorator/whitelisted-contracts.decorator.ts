import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { contract_addresses } from '../contract_addresses.helper';

@ValidatorConstraint({ async: true })
export class IsWhitelistedContractConstraint
  implements ValidatorConstraintInterface {
  async validate(contract_address: any, args: ValidationArguments) {
    for (const [, element] of contract_addresses.entries()) {
      if (element.toLowerCase() == contract_address.toLowerCase()) {
        return true;
      }
    }
    return false;
  }
}

export function IsWhitelistedContract(validationOptions?: ValidationOptions) {
  return function(object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsWhitelistedContractConstraint,
    });
  };
}
