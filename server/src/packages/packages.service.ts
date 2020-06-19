import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CrmService } from '../crm/crm.service';
import { PasFormService } from './pas-form/pas-form.service';
import { pick } from 'underscore';
import { PACKAGE_ATTRS } from './packages.controller';
import { PROJECT_ATTRS } from '../projects/projects.controller';
import { RwcdsFormService } from './rwcds-form/rwcds-form.service';

export const PACKAGE_TYPE_OPTIONSET = {
  INFORMATION_MEETING: {
    code: 717170014,
    label: 'Information Meeting',
  },
  PAS_PACKAGE: {
    code: 717170000,
    label: 'PAS Package',
  },
  DRAFT_LU_PACKAGE: {
    code: 717170001,
    label: 'Draft LU Package',
  },
  FILED_LU_PACKAGE: {
    code: 717170011,
    label: 'Filed LU Package',
  },
  DRAFT_EAS: {
    code: 717170002,
    label: 'Draft EAS',
  },
  FILED_EAS: {
    code: 717170012,
    label: 'Filed EAS',
  },
  EIS: {
    code: 717170003,
    label: 'EIS',
  },
  PDEIS: {
    code: 717170013,
    label: 'PDEIS',
  },
  RWCDS: {
    code: 717170004,
    label: 'RWCDS',
  },
  LEGAL: {
    code: 717170005,
    label: 'Legal',
  },
  WRP_PACKAGE: {
    code: 717170006,
    label: 'WRP Package',
  },
  TECHNICAL_MEMO: {
    code: 717170007,
    label: 'Technical Memo',
  },
  DRAFT_SCOPE_OF_WORK: {
    code: 717170008,
    label: 'Draft Scope of Work',
  },
  FINAL_SCOPE_OF_WORK: {
    code: 717170009,
    label: 'Final Scope of Work',
  },
  WORKING_PACKAGE: {
    code: 717170010,
    label: 'Working Package',
  },
}

@Injectable()
export class PackagesService {
  constructor(
    private readonly crmService: CrmService,
    private readonly pasFormService: PasFormService,
    private readonly rwcdsFormService: RwcdsFormService,
  ) {}

  // this is starting to do way more than get a package. It gets a package, gets related
  // forms, detects the form type, includes that form with the payload, includes additional
  // munging that's specific to the form, and also includes attached documents.
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

    // Get package
    const { records: [firstPackage] } = await this.crmService.get('dcp_packages', `
      $select=${PACKAGE_ATTRS.join(',')}
      &$filter=dcp_packageid eq ${packageId}
      &$expand=dcp_project($select=${PROJECT_ATTRS.join(',')})
    `);

    if (!firstPackage) {
      return new HttpException('Package not found. Is it the right id?', HttpStatus.NOT_FOUND);
    }

    const {
      dcp_project,
      dcp_packageid,
      dcp_name,
    } = firstPackage;

    // drive-by redefine because the sharepoint lookup
    // is failing for some reason and we don't want it
    // to take the entire system down with it.
    //
    // TODO: Why does it need to be this? We should check to see if this is still
    // flakey given current configuration
    let documents = [];
    documents = await this.tryFindPackageSharepointDocuments(dcp_name, dcp_packageid);

    const formData = await this.fetchPackageForm(firstPackage);

    return {
      ...firstPackage,
      ...formData,

      project: dcp_project,
      documents: documents.map(document => ({
        name: document['Name'],
        timeCreated: document['TimeCreated'],
        serverRelativeUrl: document['ServerRelativeUrl'],
      })),
    };
  }

  // packages have a dcp_packagetype which indicates the type of form it will have
  async fetchPackageForm(dcpPackage) {
    if (dcpPackage.dcp_packagetype === PACKAGE_TYPE_OPTIONSET['PAS_PACKAGE'].code) {
      return {
        dcp_pasform: await this.pasFormService.find(dcpPackage._dcp_pasform_value)
      };
    }

    if (dcpPackage.dcp_packagetype === PACKAGE_TYPE_OPTIONSET['RWCDS'].code) {
      return {
        dcp_rwcdsform: await this.rwcdsFormService.find(dcpPackage._dcp_rwcdsform_value)
      };
    }

    throw new HttpException({
      "code": "INVALID_PACKAGE_TYPE",
      "message": 'Requested package has invalid type.',
    }, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async update(id, body) {
    const allowedAttrs = pick(body, PACKAGE_ATTRS);

    return this.crmService.update('dcp_packages', id, allowedAttrs);
  }

  // We retrieve documents from the Sharepoint folder (`folderIdentifier` in the
  // code below) that holds both documents from past revisions and the current
  // revision. CRM automatically carries over documents from past revisions into
  // this folder, and we deliberately upload documents for the latest/current
  // revision into this folder.
  async findPackageSharepointDocuments(packageName, id:string) {
    const strippedPackageName = packageName.replace(/-/g, '').replace(/\s+/g, '').replace(/'+/g,'');
    const folderIdentifier = `${strippedPackageName}_${id.toUpperCase()}`;

    return this.crmService.getSharepointFolderFiles(`dcp_package/${folderIdentifier}`);
  }

  async tryFindPackageSharepointDocuments(dcp_name, dcp_packageid){
    try {
      const { value } = await this.findPackageSharepointDocuments(
        dcp_name,
        dcp_packageid,
      );
      return value;
    } catch (e) {
      console.log('Sharepoint request failed:', e);
    }
  }
}
