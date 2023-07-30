import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma-dataservice/prisma.service';
import { ConfigService } from '@nestjs/config';
import { RegisterDTO, LoginDTO } from './dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from '../types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) { }

  async register(dto: RegisterDTO): Promise<Tokens> {
    const hash = await this.hashData(dto.password);

    const newUser = await this.prisma.user.create({
      data: {
        username: dto.username,
        hash,
      },
    });

    const tokens = await this.getTokens(newUser.id, newUser.username);
    await this.updateRtHash(newUser.id, tokens.refresh_token);
    return tokens;
  }

  async login(dto: LoginDTO): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        username: dto.username,
      },
    });

    if (!user) throw new ForbiddenException('Access Denied!');

    const passwordMatches = await bcrypt.compare(dto.password, user.hash);
    if (!passwordMatches) throw new ForbiddenException('Access Denied!');

    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async refreshTokens(userId: number, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new ForbiddenException('Access Denied!');

    const rtMatches = await bcrypt.compare(rt, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException('Access Denied!');

    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: number, info: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          info,
        },
        {
          secret: this.config.get<string>('AT_SECRET'),
          expiresIn: 60 * 60,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          info,
        },
        {
          secret: this.config.get<string>('RT_SECRET'),
          expiresIn: 60 * 2,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await this.hashData(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }
}
