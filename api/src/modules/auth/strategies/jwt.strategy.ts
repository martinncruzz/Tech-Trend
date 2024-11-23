import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { envs } from '../../../config';
import { PrismaService } from '../../../database/prisma.service';
import { JwtPayload } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: envs.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const { user_id } = payload;

    const user = await this.prismaService.user.findUnique({
      where: { user_id },
    });

    if (!user) throw new UnauthorizedException('Invalid token');

    return user;
  }
}
