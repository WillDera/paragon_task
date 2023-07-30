import { Module } from '@nestjs/common';
import { CoreController } from './core.controller';
import { PrismaModule } from '../prisma-dataservice/prisma.module';
import { CoreService } from './core.service';
import { AtStrategy } from '../auth/strategies';

@Module({
  imports: [PrismaModule],
  controllers: [CoreController],
  providers: [CoreService, AtStrategy],
})
export class CoreModule { }
