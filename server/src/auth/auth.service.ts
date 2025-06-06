import jwt, { JwtPayload } from 'jsonwebtoken';
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
  NYCID_TOKEN_SECRET = '';
  ZAP_TOKEN_SECRET = '';

  constructor(
    private readonly config: ConfigService,
    private readonly contactService: ContactService,
  ) {
    this.NYCID_TOKEN_SECRET = this.config.get('NYCID_TOKEN_SECRET');
    this.ZAP_TOKEN_SECRET = this.config.get('ZAP_TOKEN_SECRET');
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

    // REDO: all of this "has_crm_contact" stuff is confusing. these methods should just return null
    // if not found, and we need to find a better way to deal with missing crm records + nycid status
    // need to first lookup contact by nycIdGUID, and prefer that.
    let query = await this.contactService.findOneByNycidGuid(GUID);

    // if contact exists from nyc id, sync the email address between NYC.ID and ZAP
    if (query.has_crm_contact && mail && query.emailaddress1 !== mail) {
      await this.contactService.update(query.contactid, {
        emailaddress1: mail
      });
    }

    // if it's not a CRM contact, prefer an e-mail lookup
    if (!query.has_crm_contact) {
      query = await this.contactService.findOneByEmail(mail);
    }

    // if _that_ doesn't exist, create a new contact
    const contact = query.has_crm_contact
      ? query
      : await this.contactService.create({
          emailaddress1: mail,
          dcp_nycid_guid: GUID,
        });

    const nycIdEmailRegEx = new RegExp(`^${mail}$`, 'gi');

    // if their e-mail is validated, associate the NYCID guid
    if (
      nycExtEmailValidationFlag &&
      contact.dcp_nycid_guid !== GUID &&
      contact.emailaddress1.match(nycIdEmailRegEx)
    ) {
      await this.contactService.update(contact.contactid, {
        dcp_nycid_guid: GUID,
        firstname: givenName,
        lastname: sn,
      });
    }

    // if the GUIDs match, prefer NYC.ID profile information
    if (contact.dcp_nycid_guid === GUID && givenName && sn) {
      await this.contactService.update(contact.contactid, {
        firstname: givenName,
        lastname: sn,
        adx_identity_emailaddress1confirmed: true, // "enables for portal" field in CRM
      });
    }

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
