import { Injectable } from '@nestjs/common';
import { CrmService } from '../crm/crm.service';
import { pick } from 'underscore';
import { PACKAGE_ATTRS } from './packages.controller';

@Injectable()
export class PackagesService {
  constructor(private readonly crmService: CrmService) {}

  async getPackage(packageId) {
    // Note: The reason for making two network calls
    // has to do with a limitation with the Web API: we can't request
    // associated entities from within another associated entity in
    // the same request.
    //
    // alternative approach is to get everything in 1 req then
    // invert the package/form
    // return this.crmService.get('dcp_pasforms', `
    //   $filter=_RELATED_PACKAGE/PACKAGE_ID eq ${packageId}
    //   &$expand=dcp_package,other_things,here
    // `);
    //
    // Two network requests might seem clearer to future maintainers,
    // but it's slower.

    // Double network request approach
    const { records: [{ _dcp_pasform_value }] } = await this.crmService.get('dcp_packages', `
      $select=_dcp_pasform_value
      &$filter=dcp_packageid eq ${packageId}
    `);

    const { records: [projectPackageForm] } = await this.crmService.get('dcp_pasforms', `
      $filter=
        dcp_pasformid eq ${_dcp_pasform_value}
      &$expand=
        dcp_dcp_applicantinformation_dcp_pasform,
        dcp_package,
        dcp_dcp_projectbbl_dcp_pasform
    `);

    return {
      ...projectPackageForm.dcp_package,
      dcp_pasform: projectPackageForm,
    };
  }

  async patchPackage(id, body) {
    const allowedAttrs = pick(body, PACKAGE_ATTRS);

    return this.crmService.update('dcp_packages', id, allowedAttrs);
  }
}
