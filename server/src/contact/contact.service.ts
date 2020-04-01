import { Injectable } from '@nestjs/common';
import { CrmService } from '../crm/crm.service';


@Injectable()
export class ContactService {
  constructor(
    private readonly crmService: CrmService,
  ) {
  }

  public async findOneById(contactId: string) {
  	const results = await this.crmService.get(`contacts?$filter=contactid%20eq%20${contactId}&$top=1`);
    const firstResult = results['value'][0];
  	return firstResult;
  }

  public async findOneByEmail(email: string) {
   	const results = await this.crmService.get(`contacts?$filter=emailaddress1%20eq%20${email}&top=1`);
    const firstResult = results['value'][0];
   	return firstResult;
  }

}

