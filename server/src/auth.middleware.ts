import { Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuthService } from './auth/auth.service';
import { ConfigService } from './config/config.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) { }

  async use(req: any, res: any, next: () => void) {
    // skip for the login route
    const authAllowList = req.originalUrl.includes('login') || req.originalUrl.includes('contacts?email');

    if (authAllowList) {
      next();

      return;
    }

    req.session = false;

    const { authorization = '', referer } = req.headers;
    const token = authorization.split(' ')[1];

    try {
      // this promise will throw if invalid
      let validatedToken = await this.authService.validateCurrentToken(token);

      // the referer is the domain issuing the request. in this case, it'll be the client domain,
      if (referer) {
        // which includes the query params
        const refererParams = new URL(referer);
        const email = refererParams.searchParams.get('email'); // the query param, email, sent from the client. this is who the "Creeper" wants to be.
        const { mail: userEmail } = validatedToken; // the "creepers" actual email, for verification.

        if (email && (userEmail === 'dcpcreeper@gmail.com' || userEmail.includes('@planning.nyc.gov'))) {
          // simply include the "creeper" param in the session
          validatedToken = {
            ...validatedToken,
            creeperTargetEmail: email,
          };
        }
      }

      req.session = validatedToken;

      next();
    } catch (e) {
      next();
    }
  }

  // spoof a token for the creeper user, provided their verified token and email param
  // returns a new token with new credentials, allowing all routes access to the spoofed user's
  // resources
  async _spoofToken(validatedToken, creeperEmail) {
    const NYCID_TOKEN_SECRET = this.config.get('NYCID_TOKEN_SECRET');

    // these simulate the flow of authentication for the app
    const spoofedNycIdToken = jwt.sign({
      ...validatedToken,
      // because #generateNewToken uses GUID to search for a user first, we should
      // make this null so that the method then opts for e-mail-based search
      // REDO: Remove implicit contact-search behavior from auth into separate methods
      GUID: null,
      mail: creeperEmail,
    }, NYCID_TOKEN_SECRET);
    const spoofedZapToken = await this.authService.generateNewToken(spoofedNycIdToken);
    const validatedSpoofedToken = await this.authService.validateCurrentToken(spoofedZapToken);

    validatedSpoofedToken.isCreeper = true;

    return validatedSpoofedToken;
  }
}
