import crypto from 'crypto';
import jwt, { JwtPayload } from 'jsonwebtoken';
import superagent from 'superagent';
import superagentProxy from 'superagent-proxy';
import { ConfigService } from '../config/config.service';
import { ContactService } from '../contact/contact.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

/**
 * This service is responsible for verifying NYCID tokens presented
 * by the user and generating new ZAP token for the user.
 *
 * @class      AuthService (name)
 */
@Injectable()
export class AuthService {
  // required env variables
  NYCID_TOKEN_SECRET = ''; // LEGACY: only used by generateNewToken (implicit grant flow)
  ZAP_TOKEN_SECRET = '';
  NYCID_OIDC_ENDPOINT = '';
  NYCID_RELYING_PARTY_CLIENT_ID = '';

  // optional env variables
  NYCID_RELYING_PARTY_CLIENT_SECRET = ''; // sent to the token endpoint if NYC.ID requires it
  FIXIE_URL = ''; // outbound proxy, same one used for other NYC.ID requests

  constructor(
    private readonly config: ConfigService,
    private readonly contactService: ContactService,
  ) {
    this.NYCID_TOKEN_SECRET = this.config.get('NYCID_TOKEN_SECRET');
    this.ZAP_TOKEN_SECRET = this.config.get('ZAP_TOKEN_SECRET');
    this.NYCID_OIDC_ENDPOINT = this.config.get('NYCID_OIDC_ENDPOINT');
    this.NYCID_RELYING_PARTY_CLIENT_ID = this.config.get(
      'NYCID_RELYING_PARTY_CLIENT_ID',
    );
    this.NYCID_RELYING_PARTY_CLIENT_SECRET = this.config.get(
      'NYCID_RELYING_PARTY_CLIENT_SECRET',
    );
    this.FIXIE_URL = this.config.get('FIXIE_URL');

    superagentProxy(superagent);
  }

  /**
   * Generates a new app token, using NYC.ID's expiration, and including the CRM contact id
   *
   * @param        contactId  The CRM contactid
   * @param        exp        A string coercable to a Date
   * @return                  String representing ZAP token
   */
  private signNewToken(contactId: string, nycIdAccount: JwtPayload): string {
    const { ZAP_TOKEN_SECRET } = this;
    const { exp, ...everythingElse } = nycIdAccount;

    return jwt.sign(
      {
        // JWT standard name for expiration - see https://github.com/auth0/node-jsonwebtoken#token-expiration-exp-claim
        exp,

        // CRM id — added to this app's JWT for later queries
        contactId,

        // additional NYC.ID account information
        ...everythingElse,
      },
      ZAP_TOKEN_SECRET,
    );
  }

  private verifyToken(token: string, secret: string): string | JwtPayload {
    try {
      return jwt.verify(token, secret);
    } catch (e) {
      const error = {
        code: 'INVALID_TOKEN',
        title: 'Invalid token',
        detail: `Could not verify token. ${e}`,
      };
      console.log(error);
      throw new HttpException(error, HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   * Verifies a JWT with the NYCID signature. Returns the token object.
   *
   * @param      token   The token
   * @return      // { mail: 'string', exp: 'string' }
   */
  private verifyNYCIDToken(token: string) {
    const { NYCID_TOKEN_SECRET } = this;

    try {
      return this.verifyToken(token, NYCID_TOKEN_SECRET);
    } catch (e) {
      const error = {
        code: 'INVALID_NYCID_TOKEN',
        title: 'Invalid NYCID token',
        detail: 'The acquired NYCID token is invalid.',
      };
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * OIDC + PKCE login.
   *
   * 1. Trades the one-time `code` (plus the PKCE `codeVerifier`) for tokens at NYC.ID
   * 2. Verifies the returned ID token
   * 3. Finds (or creates) the matching CRM contact
   * 4. Returns a ZAP token for the client to send on later requests
   *
   * @param      {string}  code          One-time code NYC.ID sent to the redirect URI
   * @param      {string}  codeVerifier  PKCE secret the client generated before redirecting
   * @param      {string}  redirectUri   Must exactly match the one used in the authorize request
   */
  public async generateNewTokenFromCode(
    code: string,
    codeVerifier: string,
    redirectUri: string,
  ) {
    const idTokenClaims = await this.exchangeNYCIDCode(
      code,
      codeVerifier,
      redirectUri,
    );
    const {
      email,
      GUID,
      given_name,
      family_name,
      nycExtEmailValidationFlag,
      email_verified,
    } = idTokenClaims;

    const { contactid } = await this.lookupContact({
      email,
      GUID,
      givenName: given_name,
      familyName: family_name,
      isEmailValidated: nycExtEmailValidationFlag ?? email_verified,
    });

    const ZAPToken = this.signNewToken(contactid, {
      exp: idTokenClaims.exp,
      // Keep the claim names the rest of the server already reads
      // (auth.middleware.ts and package-access.guard.ts check `mail`)
      mail: email,
      GUID,
      givenName: given_name,
      sn: family_name,
    });

    return {
      ZAPToken,
      idTokenClaims,
    };
  }

  /**
   * Calls NYC.ID's token endpoint with the authorization code + PKCE verifier,
   * then verifies and returns the claims inside the ID token.
   */
  private async exchangeNYCIDCode(
    code: string,
    codeVerifier: string,
    redirectUri: string,
  ): Promise<JwtPayload> {
    const {
      NYCID_OIDC_ENDPOINT,
      NYCID_RELYING_PARTY_CLIENT_ID,
      NYCID_RELYING_PARTY_CLIENT_SECRET,
    } = this;

    if (!code || !codeVerifier || !redirectUri) {
      throw new HttpException(
        {
          code: 'MISSING_LOGIN_PARAMS',
          title: 'Missing login parameters',
          detail: 'code, codeVerifier and redirectUri are all required.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let tokenResponse;

    try {
      const request = superagent
        .post(`${NYCID_OIDC_ENDPOINT}/token`)
        .type('form')
        .send({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          client_id: NYCID_RELYING_PARTY_CLIENT_ID,
          code_verifier: codeVerifier,
          // only sent if configured (NYC.ID's discovery doc lists client_secret_post)
          ...(NYCID_RELYING_PARTY_CLIENT_SECRET
            ? { client_secret: NYCID_RELYING_PARTY_CLIENT_SECRET }
            : {}),
        });

      if (this.FIXIE_URL) request.proxy(this.FIXIE_URL);

      tokenResponse = (await request).body;
    } catch (e) {
      const error = {
        code: 'NYCID_CODE_EXCHANGE_FAILED',
        title: 'Could not complete NYC.ID login',
        detail: 'NYC.ID rejected the authorization code.',
        meta: (e as any).response?.body, // e.g. { error: 'invalid_grant', error_description: ... }
      };
      console.log(error);
      throw new HttpException(error, HttpStatus.UNAUTHORIZED);
    }

    return this.verifyNYCIDIdToken(tokenResponse.id_token);
  }

  /**
   * Verifies an OIDC ID token using NYC.ID's public signing keys (JWKS).
   * Checks the signature, expiration, issuer and audience (our client id).
   */
  private async verifyNYCIDIdToken(idToken: string): Promise<JwtPayload> {
    const { NYCID_OIDC_ENDPOINT, NYCID_RELYING_PARTY_CLIENT_ID } = this;

    try {
      const decoded = jwt.decode(idToken, { complete: true });

      if (!decoded) throw new Error('ID token is not a JWT');

      const jwksRequest = superagent.get(
        `${NYCID_OIDC_ENDPOINT}/.well-known/jwks`,
      );

      if (this.FIXIE_URL) jwksRequest.proxy(this.FIXIE_URL);

      const { body: jwks } = await jwksRequest;
      const jwk = jwks.keys.find((key: { kid: string }) => key.kid === decoded.header.kid);

      if (!jwk) throw new Error(`No signing key found for kid ${decoded.header.kid}`);

      // jsonwebtoken v8 needs a PEM string, so convert the JWK
      const publicKey = crypto
        .createPublicKey({ key: jwk, format: 'jwk' } as any) // Node 18 supports JWK; older @types/node don't know it
        .export({ type: 'spki', format: 'pem' })
        .toString();

      const claims = jwt.verify(idToken, publicKey, {
        algorithms: ['RS256'],
        audience: NYCID_RELYING_PARTY_CLIENT_ID,
        // NYC.ID's issuer has a trailing slash; accept either form of the env var
        issuer: [NYCID_OIDC_ENDPOINT, `${NYCID_OIDC_ENDPOINT}/`],
      });

      if (typeof claims === 'string') throw new Error('Unexpected ID token payload');

      return claims;
    } catch (e) {
      const error = {
        code: 'INVALID_NYCID_ID_TOKEN',
        title: 'Invalid NYCID token',
        detail: `The NYC.ID ID token could not be verified. ${e}`,
      };
      console.log(error);
      throw new HttpException(error, HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   * Finds the CRM contact for an NYC.ID user, creating one if needed,
   * and keeps the contact's NYC.ID GUID and name in sync.
   * Shared by the legacy and OIDC login flows.
   */
  private async lookupContact({
    email,
    GUID,
    givenName,
    familyName,
    isEmailValidated,
  }: {
    email: string;
    GUID?: string;
    givenName?: string;
    familyName?: string;
    isEmailValidated?: boolean;
  }) {
    // REDO: all of this "has_crm_contact" stuff is confusing. these methods should just return null
    // if not found, and we need to find a better way to deal with missing crm records + nycid status
    // need to first lookup contact by nycIdGUID, and prefer that.
    let query = await this.contactService.findOneByNycidGuid(GUID as string);

    // if it's not a CRM contact, prefer an e-mail lookup
    if (!query.has_crm_contact) {
      query = await this.contactService.findOneByEmail(email);
    }

    // if _that_ doesn't exist, create a new contact
    const contact = query.has_crm_contact
      ? query
      : await this.contactService.create({
          emailaddress1: email,
          dcp_nycid_guid: GUID,
        });

    const nycIdEmailRegEx = new RegExp(`^${email}$`, 'gi');

    // if their e-mail is validated, associate the NYCID guid
    if (
      isEmailValidated &&
      contact.dcp_nycid_guid !== GUID &&
      contact.emailaddress1.match(nycIdEmailRegEx)
    ) {
      await this.contactService.update(contact.contactid, {
        dcp_nycid_guid: GUID,
        firstname: givenName,
        lastname: familyName,
      });
    }

    // if the GUIDs match, prefer NYC.ID profile information
    if (contact.dcp_nycid_guid === GUID && givenName && familyName) {
      await this.contactService.update(contact.contactid, {
        firstname: givenName,
        lastname: familyName,
        adx_identity_emailaddress1confirmed: true, // "enables for portal" field in CRM
      });
    }

    return contact;
  }

  /**
   * LEGACY (implicit grant flow): remove once OIDC login is live.
   * Still referenced by AuthMiddleware._spoofToken.
   *
   * This function extracts the email from an NYCIDToken and uses it to
   * look up a Contact in CRM. It returns to the client a ZAP token holding
   * (signed with) the acquired Contact's contactid.
   *
   * @param      {string}  NYCIDToken  Token from NYCID
   * @return     {string}              String representing generated ZAP Token
   */
  public async generateNewToken(NYCIDToken: string): Promise<string> {
    const nycIdAccount = this.verifyNYCIDToken(NYCIDToken);

    if (typeof nycIdAccount === 'string')
      throw new Error('Incorrectly formatted token');
    // need the email to lookup a CRM contact.
    const { mail, nycExtEmailValidationFlag, GUID, givenName, sn } =
      nycIdAccount;

    const contact = await this.lookupContact({
      email: mail,
      GUID,
      givenName,
      familyName: sn,
      isEmailValidated: nycExtEmailValidationFlag,
    });

    return this.signNewToken(contact.contactid, {
      NYCIDToken, // include the token for later authorization
      ...nycIdAccount,
    });
  }

  /**
   * Validates the current signed JWT generated by ZAP API.
   *
   * @param      {string}  token   The token
   */
  public validateCurrentToken(token: string) {
    try {
      return this.verifyZapToken(token);
    } catch (e) {
      const error = {
        code: 'INVALID_ZAP_TOKEN',
        title: 'Invalid login token provided',
        detail: 'The provided ZAP token is invalid.',
      };
      console.log(error);
      throw new HttpException(error, HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   * Verifies a JWT with the ZAP signing secret. Returns a token object.
   *
   * @param      {string}  token   The token
   * @return     {any}     { mail: 'string', exp: 'string' }
   */
  private verifyZapToken(token: string): any {
    const { ZAP_TOKEN_SECRET } = this;

    try {
      return this.verifyToken(token, ZAP_TOKEN_SECRET);
    } catch (e) {
      const error = {
        code: 'VERIFY_ZAP_TOKEN_ERROR',
        title: 'Error verifying ZAP token',
        detail: 'Perhaps the provided ZAP token is invalid.',
      };
      console.log(error);
      throw new HttpException(error, HttpStatus.UNAUTHORIZED);
    }
  }
}
