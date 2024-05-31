import { Body, Controller, Get, Headers, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import Pusher from 'pusher';

import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public.decorator';
import { PusherService } from 'src/auth/pusher.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly pusherService: PusherService) { }

  @Public()
  @Get("public")
  async publicRoute() {
    return "Public Route";
  }

  @Post("pusher")
  async authenticatePusher(@Res() res: Response, @Body("socket_id") socketId: string, @Headers("Authorization") authorizationHeader: string) {
    try {
      const authUser = await this.authService.authenticatedUser(authorizationHeader);

      const user = {
        id: authUser?.user_id,

        // This information will be shared with other members of 
        // presence channels that this user is authorized to join
        // user_info: {
        //   name: authUser?.name,
        // },

        // which is an array of user IDs. These user IDs represent a circle 
        // of interest (e.g., friends or followers) whose online/offline 
        // presence can be exposed to the user
        // watchlist: []
      };
      const authResponse = this.pusherService.authenticateUser(socketId, user);
      console.log("AuthenticatePusher::", authResponse);

      res.status(HttpStatus.OK).send(authResponse);
    } catch (error) {
      res.status(HttpStatus.FORBIDDEN).send("Unauthorized access!");
    }
  }

  @Post("pusher-channel")
  async authorizePusherChannel(@Res() res: Response, @Body("socket_id") socketId: string, @Body("channel_name") channel: string, @Headers("Authorization") authorizationHeader: string) {
    try {
      let presenceData: Pusher.PresenceChannelData;
      if (channel.startsWith("presence")) {
        // channel is a presence channel
        const authUser = await this.authService.authenticatedUser(authorizationHeader);

        // information that you wish to share about the current user
        presenceData = {
          user_id: authUser?.user_id,
          user_info: { name: authUser?.name, email: authUser?.email },
        };
      }

      // This authorizes every user
      const authResponse = this.pusherService.authorizeChannel(socketId, channel, presenceData);
      console.log("AuthorizePusherChannel::", authResponse);

      res.status(HttpStatus.OK).send(authResponse);
    } catch (error) {
      res.status(HttpStatus.FORBIDDEN).send("Unauthorized channel!");
    }
  }
}
