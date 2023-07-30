import { NFTEnquiryDTO, NFTHighestHolder, NFTTokens } from '../auth/dto';
import { contract_addresses } from './contract_addresses.helper';

type MorphResult = {
  table_name: string;
  contract_address: string;
};

export const morph_sale = (
  dto: NFTEnquiryDTO | NFTHighestHolder,
): MorphResult => {
  const table_names = [
    'cryptopunk_sale_info',
    'bored_ape_yacht_club_sale_info',
    'cryptoblots_sale_info',
  ];

  for (const [index, element] of contract_addresses.entries()) {
    if (element.toLowerCase() == dto.contract_address.toLowerCase()) {
      return { table_name: table_names[index], contract_address: element };
    }
  }

  return {
    table_name: '0',
    contract_address: '0',
  };
};

export const morph_info = (dto: NFTTokens | NFTHighestHolder): MorphResult => {
  const table_names = [
    'cryptopunk_nft_info',
    'bored_ape_yacht_club_nft_info',
    'cryptoblots_nft_info',
  ];

  for (const [index, element] of contract_addresses.entries()) {
    if (element.toLowerCase() == dto.contract_address.toLowerCase()) {
      return { table_name: table_names[index], contract_address: element };
    }
  }

  return {
    table_name: '0',
    contract_address: '0',
  };
};
