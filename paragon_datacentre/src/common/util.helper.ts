import { NFTEnquiryDTO, NFTHighestHolder, NFTTokens } from '../auth/dto';

type MorphResult = {
  table_name: string;
  contract_address: string;
};

export const morph = (dto: NFTEnquiryDTO): MorphResult => {
  const contract_addresses = [
    '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB',
    '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
    '0xa7d8d9ef8D8Ce8992Df33D8b8CF4Aebabd5bD270',
  ];

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
  const contract_addresses = [
    '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB',
    '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
    '0xa7d8d9ef8D8Ce8992Df33D8b8CF4Aebabd5bD270',
  ];

  const table_names = [
    'cryptopunk_nft_info',
    'bored_ape_yacht_nft_sale_info',
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
