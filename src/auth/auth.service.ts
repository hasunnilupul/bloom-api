import { Injectable } from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/auth';

import { FirebaseService } from 'src/auth/firebase.service';
import { extractTokenFromHeader } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(private readonly firebaseService: FirebaseService) { }

  async verifyToken(authorizationHeader: string): Promise<boolean> {
    try {
      const jwtToken = extractTokenFromHeader(authorizationHeader);
      const decodedIdToken = await this.firebaseService.verifyAuthorizationToken(jwtToken, true);
      return decodedIdToken?.uid !== "";
    } catch (error) {
      console.error('[verifyToken()::TokenVerificationError]::', error.message);
      return false;
    }
  }

  async authenticatedUser(authorizationHeader: string): Promise<DecodedIdToken> {
    try {
      const jwtToken = extractTokenFromHeader(authorizationHeader);
      const decodedIdToken = await this.firebaseService.verifyAuthorizationToken(jwtToken, true);
      return decodedIdToken;
    } catch (error) {
      console.error('[authenticatedUser()::TokenVerificationError]::', error.message);
      return null;
    }
  }
}
