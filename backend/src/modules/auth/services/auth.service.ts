import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

import { AuthRepository } from '../repository/auth.repository';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

import {
  EmailAlreadyExistsException,
  InvalidCredentialsException,
} from '../exceptions/auth.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  // 🔐 REGISTER (GIỮ NGUYÊN)
  async register(dto: RegisterDto) {
    const existing = await this.authRepository.findByEmail(dto.email);

    if (existing) {
      throw new EmailAlreadyExistsException();
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.authRepository.createUser({
      username: dto.username,
      email: dto.email,
      password_hash: hashedPassword,
    });
  }

  // 🔐 LOGIN (SỬA)
  async login(dto: LoginDto, res: Response) {
    const user = await this.authRepository.findByEmail(dto.email);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const valid = await bcrypt.compare(dto.password, user.password_hash);

    if (!valid) {
      throw new InvalidCredentialsException();
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    // 🔥 set cookie refresh token
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false, // 👉 production = true
      sameSite: 'lax',
    });

    return {
      access_token: accessToken,
    };
  }

  // 🔄 REFRESH TOKEN
  async refresh(req: Request) {
    const token = req.cookies?.refresh_token;

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = this.jwtService.verify(token);

      const newAccessToken = this.jwtService.sign({
        sub: payload.sub,
        email: payload.email,
      });

      return {
        access_token: newAccessToken,
      };
    } catch {
      throw new UnauthorizedException();
    }
  }

  // 🚪 LOGOUT
  logout(res: Response) {
    res.clearCookie('refresh_token');

    return { message: 'logged out' };
  }
}