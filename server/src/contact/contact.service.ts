import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CrmService } from '../crm/crm.service';

@Injectable()
export class ContactService {
  constructor(
    private readonly crmService: CrmService,
  ) {
  }

  public async findOneById(contactId: string) {
    let results = null;

    try  {
      await this.crmService.get(`contacts?$filter=contactid%20eq%20${contactId}&$top=1`);
    } catch(e) {
      const errorMessage = `Error finding contact by ID. ${e.message}`;
      console.log(errorMessage);
      throw new HttpException(errorMessage, HttpStatus.UNAUTHORIZED);
    }

    const firstResult = results['value'][0];

  	return firstResult;
  }

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

