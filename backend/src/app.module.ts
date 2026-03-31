import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from './modules/chat/chat.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import {AuthModule} from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'eve777V@',
      database: 'chat_app',
      autoLoadEntities: true,
      synchronize: false,
      logging: true,
    }),

    EventEmitterModule.forRoot(),

    ChatModule,
    AuthModule,
    UserModule

  ],
})
export class AppModule {}