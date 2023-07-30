import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma-dataservice/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CoreService } from './core/core.service';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    CoreModule,
  ],
  controllers: [AppController],
  providers: [AppService, CoreService],
})
export class AppModule { }
