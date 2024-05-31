import { Injectable } from '@nestjs/common';

import { PusherService } from 'src/auth/pusher.service';
import { PUSHER_EVENTS } from "src/constants/index";

@Injectable()
export class PrivateChatService {
    constructor(private readonly pusherService: PusherService) { }

    private constructChannelName(uid) {
        return `private-chat-${uid}`;
    }

    async sendMessage(sender: string, receiver: string, message: string) {
        const createdAt = new Date().toISOString();
        const newMessage = {
            sender,
            message,
            createdAt
        };
        await this.pusherService.trigger(
            this.constructChannelName(receiver),
            PUSHER_EVENTS.NEW_MESSAGE,
            newMessage
        );
        return newMessage;
    }
}
