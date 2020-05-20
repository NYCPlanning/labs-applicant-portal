import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
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
    const { records: [firstPackage] } = await this.crmService.get('dcp_packages', `
      $select=_dcp_pasform_value,dcp_packageid,dcp_name
      &$filter=dcp_packageid eq ${packageId}
      &$expand=dcp_project
    `);

    if (!firstPackage) {
      return new HttpException('Package not found. Is it the right id?', HttpStatus.NOT_FOUND);
    }

    const {
      _dcp_pasform_value,
      dcp_project,
      dcp_packageid,
      dcp_name,
    } = firstPackage;

    const { records: [projectPackageForm] } = await this.crmService.get('dcp_pasforms', `
      $filter=
        dcp_pasformid eq ${_dcp_pasform_value}
      &$expand=
        dcp_dcp_applicantinformation_dcp_pasform,
        dcp_dcp_applicantrepinformation_dcp_pasform,
        dcp_package,
        dcp_dcp_projectbbl_dcp_pasform($filter=statecode eq 0)
    `);

    // drive-by redefine because the sharepoint lookup
    // is failing for some reason and we don't want it
    // to take the entire system down with it.
    let documents = [];

    try {
      const { value } = await this.findPackageSharepointDocuments(
        dcp_name,
        dcp_packageid,
      );
      documents = value;
    } catch (e) {
      console.log('Sharepoint request failed:', e);
    }

    return {
      ...projectPackageForm.dcp_package,
      dcp_pasform: {
        ...projectPackageForm,

        // handling for setting the default value of the dcp_revisedprojectname.
        dcp_revisedprojectname: projectPackageForm.dcp_revisedprojectname || dcp_project.dcp_projectname,
      },
      project: dcp_project,
      documents: documents.map(document => ({
        name: document['Name'],
        timeCreated: document['TimeCreated'],
        serverRelativeUrl: document['ServerRelativeUrl'],
      })),
    };
  }

  async update(id, body) {
    const allowedAttrs = pick(body, PACKAGE_ATTRS);

    return this.crmService.update('dcp_packages', id, allowedAttrs);
  }

  async findPackageSharepointDocuments(packageName, id:string) {
    const cleanedId = id.toUpperCase().replace(/-/g, '');
    const folderIdentifier = `${packageName}_${cleanedId}`;

    return this.crmService.getSharepointFolderFiles(`dcp_package/${folderIdentifier}`);
  }
}
