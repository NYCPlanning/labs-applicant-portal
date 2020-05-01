import { Injectable } from '@nestjs/common';
import { CrmService } from 'src/crm/crm.service';

@Injectable()
export class PasFormService {
  constructor(private readonly crmService: CrmService) {}

  update(id, data) {
    return this.crmService.update('dcp_pasform', id, data);
  }
}
