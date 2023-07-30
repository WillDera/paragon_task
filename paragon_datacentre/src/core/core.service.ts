import { Injectable } from '@nestjs/common';
import { NFTEnquiryDTO, NFTHighestHolder, NFTTokens } from '../auth/dto';
import {
  AverageOwnershipDuration,
  AveragePrice,
  HighestHolderAmountInfo,
  HighestHolderInfo,
  Owner,
  OwnershipHistory,
  PriceHistory,
  TokenIds,
} from '../types';
import { NFTService } from '../prisma-dataservice/service/nft.service';

@Injectable()
export class CoreService {
  constructor(private nftService: NFTService) { }

  async tokens(dto: NFTTokens): Promise<TokenIds> {
    const result = await this.nftService.getTokenIds(dto);
    return result;
  }

  async currentOwner(dto: NFTEnquiryDTO): Promise<Owner> {
    const result = await this.nftService.getCurrentOwner(dto);
    return result;
  }

  async highestHolder(dto: NFTHighestHolder): Promise<HighestHolderInfo> {
    const result = await this.nftService.getHighestHolder(dto);
    return result;
  }

  async highestHolderByAmountSpent(
    dto: NFTHighestHolder,
  ): Promise<HighestHolderAmountInfo> {
    const result = await this.nftService.getHighestHolderByAmountSpent(dto);
    return result;
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
    const result = await this.nftService.getPriceHistory(dto);
    return result;
  }

  async ownershipHistory(dto: NFTEnquiryDTO): Promise<OwnershipHistory> {
    const result = await this.nftService.getOwnershipHistory(dto);
    return result;
  }
}
