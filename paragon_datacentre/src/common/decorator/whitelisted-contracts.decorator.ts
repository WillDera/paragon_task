import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsWhitelistedContractConstraint
  implements ValidatorConstraintInterface {
  contract_addresses = [
    '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB',
    '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
    '0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270',
  ];

  async validate(contract_address: any, args: ValidationArguments) {
    if (this.contract_addresses.indexOf(contract_address) >= 0) return true;
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
