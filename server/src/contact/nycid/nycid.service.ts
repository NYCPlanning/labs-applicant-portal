import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';
import * as utf8 from 'utf8';
import * as superagent from 'superagent';
import { ConfigService } from '../../config/config.service';

function sortValuesByKey(entries) {
  // sort by keys
  entries.sort(([key1], [key2]) => key1.localeCompare(key2));

  // extract those values
  return entries.map(([, val]) => val);
}

@Injectable()
export class NycidService {
  constructor(
    private readonly config: ConfigService,
  ) {}

  public async getNycidStatus(email = '', dcp_nycid_guid) {
    const isNycidEmailRegistered = await this.isNycidEmailRegistered(email);
    const isNycidValidated = await this.isNycidValidated(dcp_nycid_guid);

    return {
      // check if the e-mail is registered with nyc.id at all
      ...isNycidEmailRegistered,

      // check if the e-mail is validated in nyc.id's system
      ...isNycidValidated,

      is_city_employee: isNycidEmailRegistered && isNycidValidated && email.endsWith('nyc.gov'),
    };
  }

  // problematic because we can't know if they're validated unless they've logged in once.
  // if there's no id passed, it's probably because there isn't one to provide (it's not on the contact record)
  private async isNycidValidated(id) {
    if (!id) return {
      is_nycid_validated: null,
    };

    try {
      const { body } = await this.makeNycidRequest('GET', '/account/api/isEmailValidated.htm', {
        guid: id,
      });

      return {
        is_nycid_validated: body.validated,
      };
    } catch (e) {
      if (e.response.body.ERRORS['cpui.unknownGuid']) {
        return {
          is_nycid_validated: true,
        }
      }

      throw new HttpException({
        code: 'NYCID_REQUEST_FAILED',
        title: 'Failed getting projects',
        detail: `An unknown server error occured while communicating with NYCID.`,
        meta: e.response.body.ERRORS,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async isNycidEmailRegistered(email) {
    let errors = {};

    // This method infers a lot from the error-responses from NYC.ID
    // Instead of this being about error handling, the exception is a 200 response.
    try {
      await this.makeNycidRequest('GET', '/account/api/user.htm', {
        email,
      });
    } catch (e) {
      errors = e.response.body.ERRORS;
    }

    const hasUnknownEmail = errors.hasOwnProperty('cpui.unknownEmail');

    // this implies that an e-mail exists in the system. however, because NYC.ID
    // does not enable this feature for users who are authenticated through OAUTH,
    // it returns an "unauthorized" error: The search is unauthorized. This means that
    // the user exists in the system, but searching for them isn't allowed.
    const hasUnauthorizedSearch = errors.hasOwnProperty('cpui.unauthorized');
    const is_nycid_email_registered = !hasUnknownEmail && hasUnauthorizedSearch;

    return {
      is_nycid_email_registered,
    };
  }

  public async getNycidOAuthUser(accessToken) {
    try {
      const { body: user } = await this.makeNycidRequest('GET', '/account/api/oauth/user.htm', {}, accessToken);

      return user;
    } catch (e) {
      console.log(e);
    }
  }

  private makeNycidRequest(method, path, query, accessToken?: string) {
    const NYCID_SERVICE_ACCOUNT_USERNAME = this.config.get('NYCID_SERVICE_ACCOUNT_USERNAME') || 'applicant-portal-local';
    const NYCID_DOMAIN = this.config.get('NYCID_DOMAIN') || 'https://accounts-nonprd.nyc.gov';
    // Alphabetize query values: https://www1.nyc.gov/assets/nyc4d/html/services-nycid/web-services.shtml#signature
    const queryValues = sortValuesByKey([
      ...Object.entries(query),
      ['userName', NYCID_SERVICE_ACCOUNT_USERNAME],
    ]);

    // Sign the HTTP request: https://www1.nyc.gov/assets/nyc4d/html/services-nycid/web-services.shtml#signature
    const signature = this.calculateAuthenticationSignature(
      method,
      path,
      ...queryValues,
      accessToken ? `Bearer ${accessToken}` : '',
    );

    return superagent
      .get(`${NYCID_DOMAIN}${path}`)
      .set({ ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) })
      .query({
        signature,
        userName: NYCID_SERVICE_ACCOUNT_USERNAME,
        ...query,
      });
  }

  private calculateAuthenticationSignature(method, path, ...params) {
    const stringToSign = `${method}${path}${params.join('')}`;

    return crypto.createHmac('sha256', this.config.get('NYCID_TOKEN_SECRET'))
      .update(utf8.encode(stringToSign))
      .digest('hex')
      .toLowerCase();
  }
}
