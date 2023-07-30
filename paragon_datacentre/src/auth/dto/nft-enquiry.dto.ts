import {
  IsEthereumAddress,
  IsInt,
  IsNumberString,
  Matches,
} from 'class-validator';
import { IsWhitelistedContract } from '../../common/decorator/whitelisted-contracts.decorator';

export class NFTEnquiryDTO {
  @IsEthereumAddress()
  @IsWhitelistedContract({
    message: 'No data for $value.',
  })
  contract_address: string;

  @IsInt()
  token_id: number;
}

export class NFTTokens {
  @IsEthereumAddress()
  @IsWhitelistedContract({
    message: 'No data for $value.',
  })
  contract_address: string;

  @IsNumberString()
  @Matches(/[1-9]+/, {
    message: 'Page must be between 1 - 9',
  })
  page: number;

  @IsNumberString()
  @Matches(/[1-100]/, {
    message: 'Limit must be between 1 - 100',
  })
  limit: number;
}

export class NFTHighestHolder {
  @IsEthereumAddress()
  @IsWhitelistedContract({
    message: 'No data for $value.',
  })
  contract_address: string;
}
