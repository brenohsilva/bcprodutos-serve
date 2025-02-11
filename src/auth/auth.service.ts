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

  async validateUser(username: string, password: string): Promise<string> {
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

    return this.jwtService.sign({ username });
  }
}
