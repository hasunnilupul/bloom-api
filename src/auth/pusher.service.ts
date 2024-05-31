import { Injectable } from '@nestjs/common';
import * as Pusher from 'pusher';

@Injectable()
export class PusherService {
    pusher: Pusher;

    constructor() {
        this.pusher = new Pusher({
            appId: process.env.PUSHER_APP_ID,
            key: process.env.PUSHER_APP_KEY,
            secret: process.env.PUSHER_APP_SECRET,
            cluster: process.env.PUSHER_APP_CLUSTER,
            useTLS: true
        });
    }

    async trigger(channel: string, event: string, data: any) {
        return this.pusher.trigger(channel, event, data);
    }

    authenticateUser(socketId: string, user: Pusher.UserChannelData) {
        return this.pusher.authenticateUser(socketId, user)
    }

    authorizeChannel(socketId: string, channel: string, data?: Pusher.PresenceChannelData) {
        return this.pusher.authorizeChannel(socketId, channel, data);
    }
}
