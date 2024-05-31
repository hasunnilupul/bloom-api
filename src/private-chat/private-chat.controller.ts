import { Body, Controller, Headers, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { PrivateChatService } from './private-chat.service';
import { AuthService } from 'src/auth/auth.service';

@Controller('private-chat')
export class PrivateChatController {
    constructor(private readonly authService: AuthService, private readonly privateChatService: PrivateChatService) { }

    @Post("messages")
    async sendMessage(@Headers("Authorization") authorizationHeader: string, @Body("receiver") receiver: string, @Body("message") message: string, @Res() res: Response) {
        const authUser = await this.authService.authenticatedUser(authorizationHeader);
        const newMessage = await this.privateChatService.sendMessage(authUser?.uid, receiver, message);
        res.status(HttpStatus.CREATED).json(newMessage);
    }
}
