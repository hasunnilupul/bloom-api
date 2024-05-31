/**
 * @name extractTokenFromHeader
 * @description Extract JWT token from the authorization header
 * 
 * @param authorizationHeader Authorization header value
 * @returns JWT token
 */
export const extractTokenFromHeader = (authorizationHeader: string) => {
    const splitHeader = authorizationHeader?.split('Bearer ');
    return splitHeader[1];
} 