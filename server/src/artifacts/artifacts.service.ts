import {
  Injectable,
} from '@nestjs/common';
import { pick } from 'underscore';

import { ARTIFACTS_ATTRS } from './artifacts.attrs';
import { CrmService } from '../crm/crm.service';


@Injectable()
export class ArtifactService {
  constructor(
    private readonly crmService: CrmService,
  ) {}

  public async create(body: {
    dcp_name: string,
    dcp_isdcpinternal: string,
    dcp_filecreator: string,
    dcp_filecategory: string,
    projectId: string
  }) {
    const {
       projectId,
    } = body;

    const allowedAttrs = pick(body, ARTIFACTS_ATTRS);

    return this.crmService.create('dcp_artifacts', {
      ...allowedAttrs,
      ...(projectId ? {  'dcp_project@odata.bind': `/dcp_projects(${projectId})` } : {})
    });
  }
}
