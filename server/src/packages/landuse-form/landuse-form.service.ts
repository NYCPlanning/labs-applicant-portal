import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CrmService } from '../../crm/crm.service';

@Injectable()
export class LandUseService {
  constructor(private readonly crmService: CrmService) {}
}
