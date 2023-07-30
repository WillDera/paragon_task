import { Module } from '@nestjs/common';
import { CoreController } from './core.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CoreService } from './core.service';
import { AtStrategy } from 'src/auth/strategies';

@Module({
  imports: [PrismaModule],
  controllers: [CoreController],
  providers: [CoreService, AtStrategy],
})
export class CoreModule { }
