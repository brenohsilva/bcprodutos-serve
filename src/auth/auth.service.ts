import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AuthService {
  private readonly adminUsername = process.env.ADMIN_USERNAME;
  private readonly adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  constructor(private readonly jwtService: JwtService) {}

  async validateUser(username: string, password: string) {
    if (username !== this.adminUsername) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      this.adminPasswordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return this.generateTokens(username);
  }

  generateTokens(username: string) {
    const payload = { username };

    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '3h',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_SECRET,
      expiresIn: '7d',
    });

    return { access_token, refresh_token };
  }

  async refreshAccessToken(refresh_token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refresh_token, {
        secret: process.env.REFRESH_SECRET,
      });

      return this.generateTokens(payload.username);
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }
  }
}
