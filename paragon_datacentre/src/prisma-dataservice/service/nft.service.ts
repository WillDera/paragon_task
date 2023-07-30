import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { NFTEnquiryDTO, NFTHighestHolder, NFTTokens } from '../../auth/dto';
import { morph_info, morph_sale } from '../../common/util.helper';
import {
  AverageOwnershipDuration,
  AveragePrice,
  PriceHistory,
  PriceHistoryData,
  OwnershipHistory,
  OwnershipHistoryData,
  TokenIds,
  TokenId,
  Owner,
  HighestHolderInfo,
  HighestHolderAmountInfo,
} from '../../types';
import { SuccessResponse } from '../../common/responses.helpers';

@Injectable()
export class NFTService {
  constructor(private prisma: PrismaService) { }

  async getCurrentOwner(dto: NFTEnquiryDTO): Promise<Owner> {
    const tableName = morph_info(dto);
    if (tableName.table_name === '0')
      throw new NotFoundException('No Token Owner Data Found!');

    const ownerQuery: any = await this.prisma.$queryRaw`
    SELECT owner_address FROM ${Prisma.raw(
      tableName.table_name,
    )} WHERE token_id = ${dto.token_id};
    `;

    const data = {
      owner_address: ownerQuery[0].owner_address,
      token_id: dto.token_id,
    };

    return SuccessResponse(data);
  }

  async getTokenIds(dto: NFTTokens): Promise<TokenIds> {
    const tableName = morph_info(dto);
    if (tableName.table_name === '0')
      throw new NotFoundException('No Token Data Found!');

    const LIMIT = Number(dto.limit);
    const OFFSET = (Number(dto.page) - 1) * LIMIT;

    const tokensQuery: TokenId[] = await this.prisma.$queryRaw`
    SELECT token_id FROM ${Prisma.raw(tableName.table_name)} ORDER BY info_id 
    LIMIT ${LIMIT} OFFSET ${OFFSET}
    `;

    return SuccessResponse(tokensQuery);
  }

  async getAveragePrice(dto: NFTEnquiryDTO): Promise<AveragePrice> {
    const tableName = morph_sale(dto);
    if (tableName.table_name === '0')
      throw new NotFoundException('No Price Data Found!');

    const avgQuery: any = await this.prisma.$queryRaw`
      SELECT AVG(usd_price) as avg_usd_price,
      AVG(eth_price) as avg_eth_price
      FROM ${Prisma.raw(tableName.table_name)}
      WHERE
        contract_address = ${tableName.contract_address} AND 
        token_id = ${dto.token_id};`;

    if (avgQuery[0].avg_eth_price == null)
      throw new NotFoundException(`No Price History for ${dto.token_id}`);

    const data = {
      token_id: dto.token_id,
      avg_eth_price: avgQuery[0].avg_eth_price || 0,
      avg_usd_price: avgQuery[0].avg_usd_price || 0,
    };

    return SuccessResponse(data);
  }

  async getHighestHolder(dto: NFTHighestHolder): Promise<HighestHolderInfo> {
    const tableName = morph_info(dto);

    if (tableName.table_name === '0')
      throw new NotFoundException('No Ownership Data Found!');

    const volumeQuery: any = await this.prisma.$queryRaw`
      SELECT owner_address, COUNT(owner_address) AS volume
      FROM ${Prisma.raw(tableName.table_name)}
      GROUP BY owner_address
      ORDER BY volume DESC
      LIMIT 1;`;

    const data = {
      owner_address: volumeQuery[0].owner_address,
      number_of_nfts_owned: Number(volumeQuery[0].volume),
    };

    return SuccessResponse(data);
  }

  async getHighestHolderByAmountSpent(
    dto: NFTHighestHolder,
  ): Promise<HighestHolderAmountInfo> {
    const tableName = morph_sale(dto);

    if (tableName.table_name === '0')
      throw new NotFoundException('No Ownership Data Found!');

    const volumeQuery: any = await this.prisma.$queryRaw`
      SELECT buyer, 
      SUM(CAST(usd_price AS DECIMAL(10, 2))) AS usd_spent,
      SUM(CAST(eth_price AS DECIMAL(10, 2))) AS eth_spent
      FROM ${Prisma.raw(tableName.table_name)}
      GROUP BY buyer
      ORDER BY eth_spent DESC
      LIMIT 1;`;

    const data = {
      owner_address: volumeQuery[0].buyer,
      total_spent: {
        usd_amount: Number(volumeQuery[0].usd_spent),
        eth_amount: Number(volumeQuery[0].eth_spent),
      },
    };

    return SuccessResponse(data);
  }

  async getAverageOwnershipDuration(
    dto: NFTEnquiryDTO,
  ): Promise<AverageOwnershipDuration> {
    const tableName = morph_sale(dto);

    if (tableName.table_name === '0')
      throw new NotFoundException('No Ownership History Found!');

    const avgQuery: any = await this.prisma.$queryRaw`
      SELECT token_id, timestamp 
      FROM ${Prisma.raw(tableName.table_name)} 
      WHERE 
        token_id = ${dto.token_id} 
      ORDER BY timestamp asc;
    `;

    if (avgQuery.length < 1)
      throw new NotFoundException(`No Ownership History for ${dto.token_id}`);

    let totalDuration = 0;
    for (let i = 1; i < avgQuery.length; i++) {
      const prevTransaction = avgQuery[i - 1];
      const currentTransaction = avgQuery[i];
      const duration = Math.abs(
        currentTransaction.timestamp.getTime() -
        prevTransaction.timestamp.getTime(),
      );
      totalDuration += duration;
    }

    const averageDurationInMilliseconds = totalDuration / (avgQuery.length - 1);
    const averageDuration =
      averageDurationInMilliseconds / (1000 * 60 * 60 * 24);

    const duration = averageDuration.toString().split('.');
    const remainder = Number('0.' + duration[1]);
    const remainderToHours = Math.floor(remainder * 24 * 100) / 100;

    const data = {
      token_id: dto.token_id,
      avg_ownership_duration: `${Number(
        duration[0],
      )} days and ${remainderToHours} hours`,
    };

    return SuccessResponse(data);
  }

  async getPriceHistory(dto: NFTEnquiryDTO): Promise<PriceHistory> {
    const tableName = morph_sale(dto);

    if (tableName.table_name === '0')
      throw new NotFoundException('No Price Data Found!');

    const historyQuery: PriceHistoryData[] = await this.prisma.$queryRaw`
      SELECT timestamp, usd_price, eth_price 
      FROM ${Prisma.raw(tableName.table_name)}
    WHERE
    token_id = ${dto.token_id} 
      ORDER BY timestamp desc;
    `;

    if (historyQuery.length < 1)
      throw new NotFoundException(`No Price History for ${dto.token_id}`);

    return SuccessResponse(historyQuery);
  }

  async getOwnershipHistory(dto: NFTEnquiryDTO): Promise<OwnershipHistory> {
    const tableName = morph_sale(dto);

    if (tableName.table_name === '0')
      throw new NotFoundException('No Ownership Data Found!');

    const historyQuery: OwnershipHistoryData[] = await this.prisma.$queryRaw`
      SELECT timestamp, seller AS owner
      FROM ${Prisma.raw(tableName.table_name)} WHERE token_id = ${dto.token_id}
      UNION ALL
      SELECT timestamp, buyer AS owner
      FROM ${Prisma.raw(tableName.table_name)} WHERE token_id = ${dto.token_id}
      ORDER BY timestamp desc;
    `;

    console.log(historyQuery);

    if (historyQuery.length < 1)
      throw new NotFoundException(`No Ownership History for ${dto.token_id}`);

    return SuccessResponse(historyQuery);
  }
}
