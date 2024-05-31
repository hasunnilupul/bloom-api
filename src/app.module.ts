import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { PrivateChatService } from './private-chat/private-chat.service';
import { PrivateChatController } from './private-chat/private-chat.controller';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule],
  controllers: [AppController, PrivateChatController],
  providers: [
    PrivateChatService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }
  ],
})
export class AppModule { }
