import { Injectable, NotFoundException } from '@nestjs/common';
import { NFTEnquiryDTO, NFTTokens } from '../auth/dto';
import {
  AverageOwnershipDuration,
  AveragePrice,
  Owner,
  OwnershipHistory,
  PriceHistory,
  TokenIds,
} from 'src/types';
import { SuccessResponse } from '../common/responses.helpers';
import { PrismaService } from '../prisma-dataservice/prisma.service';
import { NFTService } from '../prisma-dataservice/service/nft.service';

@Injectable()
export class CoreService {
  constructor(private prisma: PrismaService, private nftService: NFTService) { }

  async tokens(dto: NFTTokens): Promise<TokenIds> {
    const result = await this.nftService.getTokenIds(dto);
    return result;
  }

  async currentOwner(dto: NFTEnquiryDTO): Promise<Owner> {
    const nft_data = await this.prisma.cryptopunk_nft_info.findUnique({
      where: {
        contract_address: dto.contract_address,
        token_id: dto.token_id,
      },
    });

    if (!nft_data) throw new NotFoundException('Owner Not Found!');

    const data = { owner_address: nft_data.owner_address };

    return SuccessResponse(data);
  }

  async averagePrice(dto: NFTEnquiryDTO): Promise<AveragePrice> {
    const result = await this.nftService.getAveragePrice(dto);
    return result;
  }

  async averageOwnershipDuration(
    dto: NFTEnquiryDTO,
  ): Promise<AverageOwnershipDuration> {
    const result = await this.nftService.getAverageOwnershipDuration(dto);

    return result;
  }

  async priceHistory(dto: NFTEnquiryDTO): Promise<PriceHistory> {
    return await this.nftService.getPriceHistory(dto);
  }

  async ownershipHistory(dto: NFTEnquiryDTO): Promise<OwnershipHistory> {
    return await this.nftService.getOwnershipHistory(dto);
  }
}
