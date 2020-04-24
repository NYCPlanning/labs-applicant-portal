import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { ADAL } from '../_utils/adal';
import { CRMWebAPI } from '../_utils/crm-web-api';
import { ORequest } from 'odata';

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

    CRMWebAPI.webAPIurl = this.config.get('CRM_URL_PATH');
    CRMWebAPI.CRMUrl = this.config.get('CRM_HOST');
  }

  async get(entity: string, query: string, ...options) {
    const response = await CRMWebAPI.get(`${entity}?${query}`, ...options);
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

    const oDataReq = new ORequest(this.config.get('CRM_HOST'), {});
    oDataReq.applyQuery(truthyKeyedObject);

    const { url: { search } } = oDataReq;

    return search.split('?')[1];
  }
}

export function coerceToNumber(numericStrings) {
  return numericStrings
    // filter out blank strings and undefined, which aren't meaningfully
    // coercible in CRM
    .filter(stringish => stringish !== '' && stringish !== undefined)
    .map(stringish => {
      // smelly; but let's prefer actual null
      // coercing 'null' turns to 0, which we don't
      // want in the API query
      if (stringish === null) return stringish;

      // Coercing an empty string into a number returns
      // NaN, which, although a number, is a Double in CRM
      // which typically expects an Int
      if (stringish === '') return stringish;

      return Number(stringish);
    });
}

export function coerceToDateString(epoch) {
  const date = new Date(epoch * 1000);

  return date;
}

export function mapInLookup(arrayOfStrings, lookupHash) {
  return arrayOfStrings.map(string => lookupHash[string]);
}

export function all(...statements): string {
  return statements
    .filter(Boolean)
    .join(' and ');
}

export function any(...statements): string {
  return `(${(statements.join(' or '))})`;
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

  return `(${propertyName} ${operator} ${typeSafeValue})`;
}

export function containsString(propertyName, string) {
  return `contains(${propertyName}, '${string}')`;
}

export function equalsAnyOf(propertyName, strings = []) {
  const querySegment = strings
    .map(string => comparisonOperator(propertyName, 'eq', string))
    .join(' or ');

  // Empty parenthases are invalid
  return querySegment ? `(${querySegment})` : '';
}

export function containsAnyOf(propertyName, strings = [], options?) {
  const {
    childEntity = '',
    comparisonStrategy = containsString,
    not = false,
  } = options || {};

  const containsQuery = strings
    .map((string, i) => {
      // in odata syntax, this character o is a variable for scoping
      // logic for related entities. it needs to only appear once.
      const lambdaScope = (childEntity && i === 0) ? `${childEntity}:` : '';
      const lambdaScopedProperty = childEntity ? `${childEntity}/${propertyName}` : propertyName;

      return `${lambdaScope}${comparisonStrategy(lambdaScopedProperty, string)}`;
    })
    .join(' or ');
  const lambdaQueryPrefix = childEntity ? `${childEntity}/any` : '';

  return `(${not ? 'not ' : ''}${lambdaQueryPrefix}(${containsQuery}))`;
}

