import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CrmService } from '../crm/crm.service';
import { PasFormService } from './pas-form/pas-form.service';
import { pick } from 'underscore';
import { RwcdsFormService } from './rwcds-form/rwcds-form.service';
import { LanduseFormService } from './landuse-form/landuse-form.service';
import { PACKAGE_ATTRS } from './packages.attrs';
import { PROJECT_ATTRS } from '../projects/projects.attrs';
import { DocumentService } from '../document/document.service';

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
    private readonly landuseFormService: LanduseFormService,
    private readonly documentService: DocumentService,
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
    try {
        const { records: [firstPackage] } = await this.crmService.get('dcp_packages', `
        $select=${PACKAGE_ATTRS.join(',')}
        &$filter=dcp_packageid eq ${packageId}
        &$expand=dcp_project($select=${PROJECT_ATTRS.join(',')})
      `);

      if (!firstPackage) {
        throw new HttpException({
          code: 'PACKAGE_NOT_FOUND',
          title: 'Package not found',
          detail: 'Package not found for given ID',
        }, HttpStatus.NOT_FOUND);
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
      documents = await this.documentService.findPackageSharepointDocuments(dcp_name, dcp_packageid);

      let formData = {};

      if (
        firstPackage.dcp_packagetype === PACKAGE_TYPE_OPTIONSET['PAS_PACKAGE'].code
        || firstPackage.dcp_packagetype === PACKAGE_TYPE_OPTIONSET['RWCDS'].code
        || firstPackage.dcp_packagetype === PACKAGE_TYPE_OPTIONSET['DRAFT_LU_PACKAGE'].code
        || firstPackage.dcp_packagetype === PACKAGE_TYPE_OPTIONSET['FILED_LU_PACKAGE'].code
      ) {
        formData = await this.fetchPackageForm(firstPackage);
      }

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
    } catch (e) {
      // relay lower-level exceptions, like from crmServce.get(),
      // or sharepoint document retrieval.
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new HttpException({
          code: 'LOAD_PACKAGE_FAILED',
          title: 'Could not load package',
          detail: `An unknown error occured while loading package ${packageId}`,
        }, HttpStatus.NOT_FOUND);
      }
    }
  }

  // packages have a dcp_packagetype which indicates the type of form it will have
  async fetchPackageForm(dcpPackage) {
    try {
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

      if (dcpPackage.dcp_packagetype === PACKAGE_TYPE_OPTIONSET['DRAFT_LU_PACKAGE'].code
      || dcpPackage.dcp_packagetype === PACKAGE_TYPE_OPTIONSET['FILED_LU_PACKAGE'].code) {
        return {
          dcp_landuse: await this.landuseFormService.find(dcpPackage._dcp_landuseapplication_value)
        };
      }

      throw new HttpException({
        code: "INVALID_PACKAGE_TYPE",
        title: 'Invalid package type',
        detail: 'Requested package has invalid type.',
      }, HttpStatus.BAD_REQUEST);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new HttpException({
          code: 'PACKAGE_FORM_ERROR',
          title: 'Error loading package forms',
          detail: `Error while acquiring ${dcpPackage} forms attached to the package ${dcpPackage.dcp_packageid}`,
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async update(id, body) {
    const allowedAttrs = pick(body, PACKAGE_ATTRS);

    return this.crmService.update('dcp_packages', id, allowedAttrs);
  }
}
