import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CrmService } from '../crm/crm.service';

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
    let results = null;

    try  {
      results = await this.crmService.get(`contacts?$filter=contactid%20eq%20${contactId}&$top=1`);
    } catch(e) {
      const errorMessage = `Error finding contact by ID. ${e.message}`;
      console.log(errorMessage);
      throw new HttpException(errorMessage, HttpStatus.UNAUTHORIZED);
    }

    const firstResult = results['value'][0];

    return firstResult;
  }

  /**
   * Uses the CRM Web API to query and return a Contact entity for given email
   *
   * @param      {string}  email      Email matching a CRM Contact Entity's emailaddress1 property
   * @return     {object}             Object representing a CRM contact
   */
  public async findOneByEmail(email: string) {
    let results = null;

    try {
      results = await this.crmService.get(`contacts?$filter=emailaddress1%20eq%20'${email}'&$top=1`);
    } catch(e) {
      const errorMessage = `Error finding contact by email. ${e.message}`;
      console.log(errorMessage);
      throw new HttpException(errorMessage, HttpStatus.UNAUTHORIZED);
    }

    const firstResult = results['value'][0];

    return firstResult;
  }

}
