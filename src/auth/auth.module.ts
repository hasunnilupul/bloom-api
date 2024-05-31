import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FirebaseService } from 'src/auth/firebase.service';
import { PusherService } from 'src/auth/pusher.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, FirebaseService, PusherService],
  exports: [AuthService, FirebaseService, PusherService]
})
export class AuthModule { }
