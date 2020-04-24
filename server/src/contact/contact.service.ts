import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CrmService } from '../crm/crm.service';

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
        $filter=emailaddress1 eq '${email}'
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
}
