import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { pick } from 'underscore';
import { CrmService } from '../crm/crm.service';
import { CONTACT_ATTRS } from './contacts.attrs';

const ACTIVE_CODE = 1;

/**
 * This service is responsible for looking up contacts from CRM
 *
 * @class      ContactService (name)
 */
@Injectable()
export class ContactService {
  constructor(
    private readonly crmService: CrmService,
  ) {
  }

  /**
   * Uses the CRM Web API to query and return a Contact entity for given contactid
   *
   * @param      {string}  contactId  A CRM Contact Entity's contactid
   * @return     {object}             Object representing a CRM contact
   */
  public async findOneById(contactId: string) {
    try  {
      const { records: [firstRecord] } = await this.crmService.get('contacts', `
        $filter=contactid eq ${contactId}
          and statuscode eq ${ACTIVE_CODE}
        &$top=1
      `);

      return firstRecord;
    } catch(e) {
      const errorMessage = `Error finding contact by ID. ${e.message}`;
      console.log(errorMessage);
      throw new HttpException(errorMessage, HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   * Uses the CRM Web API to query and return a Contact entity for given email
   *
   * @param      {string}  email      Email matching a CRM Contact Entity's emailaddress1 property
   * @return     {object}             Object representing a CRM contact
   */
  public async findOneByEmail(email: string) {
    try {
      const { records: [firstRecord] } = await this.crmService.get('contacts', `
        $filter=startswith(emailaddress1, '${email}')
          and statuscode eq ${ACTIVE_CODE}
        &$top=1
      `);

      return firstRecord;
    } catch(e) {
      const errorMessage = `Error finding contact by email. ${e.message}`;
      console.log(errorMessage);
      throw new HttpException(errorMessage, HttpStatus.UNAUTHORIZED);
    }
  }

  async createContact(email, body) {
    const allowedAttrs = pick(body, CONTACT_ATTRS);
    const currentContact = await this.findOneByEmail(email);

    if(currentContact) {
      // update dcp_projectapplicant?
    } else {
      console.log('swampy');
      return this.crmService.create(
        `contacts`, {
          ...allowedAttrs,
        });
      // update dcp_projectapplicant?
    } 
  }
}
