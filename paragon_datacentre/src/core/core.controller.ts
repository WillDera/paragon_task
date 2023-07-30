import {
  Controller,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CoreService } from './core.service';
import { AtGuard } from 'src/common/guards';
import { NFTEnquiryDTO, NFTTokens } from 'src/auth/dto';
import {
  AverageOwnershipDuration,
  AveragePrice,
  Owner,
  OwnershipHistory,
  PriceHistory,
  TokenIds,
} from 'src/types';

@Controller('core')
export class CoreController {
  constructor(private coreService: CoreService) { }

  @UseGuards(AtGuard)
  @Get('token_ids')
  @HttpCode(HttpStatus.OK)
  tokens(
    @Query(new ValidationPipe({ transform: true })) dto: NFTTokens,
  ): Promise<TokenIds> {
    return this.coreService.tokens(dto);
  }

  @UseGuards(AtGuard)
  @Get('current_owner')
  @HttpCode(HttpStatus.OK)
  currentOwner(@Body() dto: NFTEnquiryDTO): Promise<Owner> {
    return this.coreService.currentOwner(dto);
  }

  @UseGuards(AtGuard)
  @Get('nft_average_price')
  @HttpCode(HttpStatus.OK)
  averagePrice(@Body() dto: NFTEnquiryDTO): Promise<AveragePrice> {
    return this.coreService.averagePrice(dto);
  }

  @UseGuards(AtGuard)
  @Get('nft_average_ownership_duration')
  @HttpCode(HttpStatus.OK)
  averageOwnershipDuration(
    @Body() dto: NFTEnquiryDTO,
  ): Promise<AverageOwnershipDuration> {
    return this.coreService.averageOwnershipDuration(dto);
  }

  @UseGuards(AtGuard)
  @Get('nft_price_history')
  @HttpCode(HttpStatus.OK)
  priceHistory(@Body() dto: NFTEnquiryDTO): Promise<PriceHistory> {
    return this.coreService.priceHistory(dto);
  }

  @UseGuards(AtGuard)
  @Get('nft_ownership_history')
  @HttpCode(HttpStatus.OK)
  ownershipHistory(@Body() dto: NFTEnquiryDTO): Promise<OwnershipHistory> {
    return this.coreService.ownershipHistory(dto);
  }
}
