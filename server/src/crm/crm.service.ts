import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { ADAL } from '../_utils/adal';
import { CRMWebAPI } from '../_utils/crm-web-api';

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

    return convertQueryObjectToURL(truthyKeyedObject);
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

