import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { NFTService } from './service/nft.service';

@Global()
@Module({
  providers: [NFTService, PrismaService],
  exports: [NFTService, PrismaService],
})
export class PrismaModule { }
