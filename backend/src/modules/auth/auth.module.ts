import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AuthRepository } from './repository/auth.repository';

import { User } from '../user/entities/user.entity';
import { UserProfile } from '../user/entities/user-profile.entity';

import { JwtStrategy } from './strategies/jwt.strategy';

import { RegisterUseCase } from './application/register.usecase';
import { LoginUseCase } from './application/login.usecase';
import { RefreshTokenUseCase } from './application/refresh-token.usecase';
import { LogoutUseCase } from './application/logout.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile]),

    ConfigModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService,
      ) => ({
        secret: configService.get<string>(
          'JWT_SECRET',
        ),
        signOptions: {
          expiresIn: '7d',
        },
      }),
    }),
  ],

  controllers: [
    AuthController,
  ],

  providers: [
    AuthService,

    AuthRepository,

    JwtStrategy,

    RegisterUseCase,

    LoginUseCase,

    RefreshTokenUseCase,

    LogoutUseCase,
  ],

  exports: [

    AuthService,

    JwtModule,

  ],
})
export class AuthModule {}
