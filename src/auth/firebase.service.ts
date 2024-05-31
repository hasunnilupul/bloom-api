import { Injectable } from '@nestjs/common';
import { credential } from "firebase-admin";
import { initializeApp, App, applicationDefault } from 'firebase-admin/app';
import { DecodedIdToken, getAuth } from "firebase-admin/auth";

@Injectable()
export class FirebaseService {
    private app: App;

    constructor() {
        if (!this.app) {
            this.app = initializeApp({
                credential: credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS)
            })
        }
    }

    /**
     * @name verifyAuthorizationToken
     * @description Verify and decode the provided jwt token 
     * 
     * @param token Google provided token
     * @param checkRevoked Check user is disabled
     * @returns Decoded Firebase ID token
     */
    async verifyAuthorizationToken(token: string, checkRevoked: boolean): Promise<DecodedIdToken> {
        return await getAuth(this.app).verifyIdToken(token, checkRevoked);
    }
}
