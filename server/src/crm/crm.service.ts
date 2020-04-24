import { Injectable } from '@nestjs/common';
import * as zlib from 'zlib';
import * as Request from 'request';
import { ConfigService } from '../config/config.service';
import { ADAL } from '../_utils/adal';

/**
 * This service is responsible for providing convenience
 * methods for interacting with CRM.
 * TODO: Leverage the oData service written by @allthesignals
 * See
 * https://github.com/NYCPlanning/labs-zap-api/blob/api-only/src/odata/odata.service.ts
 * https://github.com/NYCPlanning/labs-zap-api/blob/api-only/src/contact/contact.service.ts
 *
 * @class      CrmService (name)
 */
@Injectable()
export class CrmService {
  crmUrlPath = '';
  crmHost = '';
  host = '';

  constructor(
    private readonly config: ConfigService,
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

  async get(entity: string, query: string, ...options) {
    const response = await this._get(`${entity}?${query}`, ...options);
    const {
      value: records,
      '@odata.count': count,
    } = response;

    return {
      count,
      records,
    };
  }

  getFromObject(entity: string, query: any, ...options) {
    const queryStringForEntity = this.serializeToQueryString(query);

    return this.get(entity, queryStringForEntity, ...options);
  }

  private serializeToQueryString(query: any) {
    const truthyKeyedObject = Object.keys(query).reduce((acc, curr) => {
      if (query[curr]) {
        acc[curr] = query[curr];
      }

      return acc;
    }, {})

    return convertQueryObjectToURL(truthyKeyedObject);
  }

  // this provides the formatted values but doesn't do it for top level
  // TODO: where should this happen? 
  _fixLongODataAnnotations(dataObj) {
    return dataObj;
  }

  _parseErrorMessage(json) {
    if (json) {
      if (json.error) {
        return json.error;
      }
      if (json._error) {
        return json._error;
      }
    }
    return "Error";
  }

  _dateReviver(key, value) {
    if (typeof value === 'string') {
      // YYYY-MM-DDTHH:mm:ss.sssZ => parsed as UTC
      // YYYY-MM-DD => parsed as local date

      if (value != "") {
        const a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);

        if (a) {
          const s = parseInt(a[6]);
          const ms = Number(a[6]) * 1000 - s * 1000;
          return new Date(Date.UTC(parseInt(a[1]), parseInt(a[2]) - 1, parseInt(a[3]), parseInt(a[4]), parseInt(a[5]), s, ms));
        }

        const b = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

        if (b) {
          return new Date(parseInt(b[1]), parseInt(b[2]) - 1, parseInt(b[3]), 0, 0, 0, 0);
        }
      }
    }

    return value;
  }

  async _get(query, maxPageSize = 100, headers = {}): Promise<any> {
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
      Request.get(options, (error, response, body) => {
        const encoding = response.headers['content-encoding'];

        if (!error && response.statusCode === 200) {
          // If response is gzip, unzip first

          const parseResponse = jsonText => {
            const json_string = jsonText.toString('utf-8');

            var result = JSON.parse(json_string, this._dateReviver);
            if (result["@odata.context"].indexOf("/$entity") >= 0) {
              // retrieve single
              result = this._fixLongODataAnnotations(result);
            }
            else if (result.value) {
              // retrieve multiple
              var array = [];
              for (var i = 0; i < result.value.length; i++) {
                array.push(this._fixLongODataAnnotations(result.value[i]));
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
            const result = JSON.parse(json_string, this._dateReviver);
            const err = this._parseErrorMessage(result);

            if (err == "Object reference not set to an instance of an object.") {
              this._get(query, maxPageSize, options)
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

export function all(...statements): string {
  return '(' + statements
    .filter(Boolean)
    .join(' and ') + ')';
}

export function any(...statements): string {
  return `(${(statements.join(' or '))})`;
}

// convenience function that takes an iterable and inserts commas
export function list(...statements): string {
  return `${(statements.join(','))}`;
}

export function comparisonOperator(propertyName, operator, value) {
  let typeSafeValue = value

  if (typeof value === 'string') {
    if (value !== 'false' && value !== 'true') {
      typeSafeValue = `'${value}'`;
    }
  }

  // most likely means it's a date. we want the date formatting that
  // json stringify provides.
  if (typeof value === 'object') {
    const stringyDate = JSON.stringify(value).replace(/"/g, "'");

    typeSafeValue = `${stringyDate}`;
  }

  return `${propertyName} ${operator} ${typeSafeValue}`;
}

export const equals = (left, right) => comparisonOperator(left, 'eq', right);

export function subquery(entity, subquery) {
  const stringifiedSubquery = Object.entries(subquery)
    .map(([key, value]) => `${key}=${value}`)
    .join(';');

  return `${entity}(${stringifiedSubquery})`;
}

// constructs a lambda filter, which filters entities by a properties
// on an associated entity. the alias param is required for scope property
// name references
export function lambdaFilter(linkEntity, alias, ...filterConditions: Array<string>) {
  // quick sanity check
  if (!assertStringsIncludeValue(filterConditions, alias)) {
    console.log('You used lambdaFilter method but did not scope the keys on filters.');
  }

  const prefixedFilterConditions = filterConditions
    .join(' and ');

  return `${linkEntity}/any(${alias}:${prefixedFilterConditions})`;
}

function assertStringsIncludeValue(strings: Array<string>, value: string) {
  return strings.every(condition => condition.includes(value));
}

function convertQueryObjectToURL(query: any) {
  const url = new URL('https://google.com');

  for (const key in query) {
    if (query.hasOwnProperty(key)) {
      const value = query[key];

      if (url.searchParams.get(key)) {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.append(key, value);
      }
    }
  }

  const { search } = url;

  return search.split('?')[1];
}
