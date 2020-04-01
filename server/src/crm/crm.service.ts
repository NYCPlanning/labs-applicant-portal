import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { ADAL } from './adal';

@Injectable()
export class CrmService {
  constructor(
    private readonly config: ConfigService,
    private readonly 
  ) {
	 ADAL.ADAL_CONFIG = {
	 CRMUrl: this.config.get('CRM_HOST'),
	 webAPIurl: this.config.get('CRM_URL_PATH'),
	 clientId: this.config.get('CLIENT_ID'),
	 clientSecret: this.config.get('CLIENT_SECRET'),
	 tenantId: this.config.get('TENANT_ID'),
	 authorityHostUrl: this.config.get('AUTHORITY_HOST_URL'),
	 tokenPath: this.config.get('TOKEN_PATH'),
	};
	 this.crmUrlPath = this.config.get('CRM_URL_PATH');
	 this.crmHost = this.config.get('CRM_HOST');
	 this.host = `${this.crmHost}${this.crmUrlPath}`;
  }

  async get(query, maxPageSize = 100, headers= {}) {
    //  get token
    const JWToken = await ADAL.acquireToken();
    const options = {
      url: `${this.host}${query}`,
      headers: {
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${JWToken}`,
        'OData-MaxVersion': '4.0',
        'OData-Version': '4.0',
        Accept: 'application/json',
        Prefer: 'odata.include-annotations="*"',
        ...headers
      },
      encoding: null,
    };

    return new Promise((resolve, reject) => {
      request.get(options, (error, response, body) => {
        const encoding = response.headers['content-encoding'];

        if (!error && response.statusCode === 200) {
          // If response is gzip, unzip first

          const parseResponse = jsonText => {
            const json_string = jsonText.toString('utf-8');

            var result = JSON.parse(json_string, this.dateReviver);
            if (result["@odata.context"].indexOf("/$entity") >= 0) {
                // retrieve single
                result = this.fixLongODataAnnotations(result);
            }
            else if (result.value ) {
                // retrieve multiple
                var array = [];
                for (var i = 0; i < result.value.length; i++) {
                  array.push(this.fixLongODataAnnotations(result.value[i]));
                }
                result.value = array;
            }
            resolve(result);
          };

          if (encoding && encoding.indexOf('gzip') >= 0) {
            zlib.gunzip(body, (err, dezipped) => {
                parseResponse(dezipped);
            });
          }
          else {
            parseResponse(body);
          }
        } else {
          const parseError = jsonText => {
            // Bug: sometimes CRM returns 'object reference' error
            // Fix: if we retry error will not show again
            const json_string = jsonText.toString('utf-8');
            const result = JSON.parse(json_string, this.dateReviver);
            const err = this.parseErrorMessage(result);

            if (err == "Object reference not set to an instance of an object.") {
              this.get(query, maxPageSize, options)
                .then(
                  resolve, reject
                );
            } else {
              reject(err);
            }
          };

          if (encoding && encoding.indexOf('gzip') >= 0) {
            zlib.gunzip(body, (err, dezipped) => {
              parseError(dezipped);
            });
          } else {
            parseError(body);
          }
        }
      });
    });
  }
}
