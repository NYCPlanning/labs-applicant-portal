import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CrmService } from '../crm/crm.service';
import { pick } from 'underscore';
import { PACKAGE_ATTRS } from './packages.controller';

const PACKAGE_TYPE_OPTIONSET = {
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
  constructor(private readonly crmService: CrmService) {}

  // Gets the lateset PAS Form on Project `projectId`
  async getLatestPasForm(projectId): Promise<any> {
    try {
      const { records: pasPackages } = await this.crmService.get('dcp_packages', `
        $filter=
          _dcp_project_value eq ${projectId}
          and
          dcp_packagetype eq ${PACKAGE_TYPE_OPTIONSET['PAS_PACKAGE'].code}
        &$expand=
          dcp_pasform
      `);

      // if pasA is of a higher version than pasB, it should come first
      const [{ dcp_pasform: latestPasForm }] = pasPackages.sort((pasA, pasB) => {
        return pasB.dcp_packageversion - pasA.dcp_packageversion;
      });

      return latestPasForm;
    } catch(e) {
      const errorMessage = `Error finding a PAS Form on given Project. ${e.message}`;
      console.log(errorMessage);
      throw new HttpException(errorMessage, HttpStatus.UNAUTHORIZED);
    }
  }

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
      $select=_dcp_project_value,_dcp_rwcdsform_value,_dcp_pasform_value,dcp_packagetype,dcp_packageid,dcp_name
      &$filter=dcp_packageid eq ${packageId}
      &$expand=dcp_project
    `);

    if (!firstPackage) {
      return new HttpException('Package not found. Is it the right id?', HttpStatus.NOT_FOUND);
    }

    const {
      dcp_packagetype,
      dcp_project,
      dcp_packageid,
      dcp_name,
      _dcp_project_value,
      _dcp_pasform_value,
      _dcp_rwcdsform_value,
    } = firstPackage;

    if (dcp_packagetype === PACKAGE_TYPE_OPTIONSET['PAS_PACKAGE'].code) {
      const { records: [pasForm] } = await this.crmService.get(`dcp_pasforms`, `
      $filter=
        dcp_pasformid eq ${_dcp_pasform_value}
      &$expand=
        dcp_dcp_applicantinformation_dcp_pasform,
        dcp_dcp_applicantrepinformation_dcp_pasform,
        dcp_package,
        dcp_dcp_projectbbl_dcp_pasform($filter=statecode eq 0),
        dcp_dcp_projectaddress_dcp_pasform
      `);

       // drive-by redefine because the sharepoint lookup
      // is failing for some reason and we don't want it
      // to take the entire system down with it.
      let documents = [];

      documents = await this.tryFindPackageSharepointDocuments(dcp_name, dcp_packageid);

      return {
        ...pasForm.dcp_package,
        dcp_pasform: {
          ...pasForm,

          dcp_revisedprojectname: pasForm.dcp_revisedprojectname
          || dcp_project.dcp_projectname,
        },
        project: dcp_project,
        documents: documents.map(document => ({
          name: document['Name'],
          timeCreated: document['TimeCreated'],
          serverRelativeUrl: document['ServerRelativeUrl'],
        })),
      };
    } else if (dcp_packagetype === PACKAGE_TYPE_OPTIONSET['RWCDS'].code) {
      const { records: [rwcdsForm] } = await this.crmService.get(`dcp_rwcdsforms`, `
      $filter=
        dcp_rwcdsformid eq ${_dcp_rwcdsform_value}
      &$expand=dcp_package
    `);

      let documents = [];

      documents = await this.tryFindPackageSharepointDocuments(dcp_name, dcp_packageid);

      if (
        rwcdsForm.dcp_projectsitedescription === null
        || rwcdsForm.dcp_proposedprojectdevelopmentdescription === null
      ) {
        const {
          dcp_projectdescriptionproposedarea,
          dcp_projectdescriptionproposeddevelopment,
        } = await this.getLatestPasForm(_dcp_project_value);

        if ( rwcdsForm.dcp_projectsitedescription === null ) {
          rwcdsForm.dcp_projectsitedescription = dcp_projectdescriptionproposedarea;
        }

        if ( rwcdsForm.dcp_proposedprojectdevelopmentdescription === null ) {
          rwcdsForm.dcp_proposedprojectdevelopmentdescription = dcp_projectdescriptionproposeddevelopment;
        }
      }

      return {
        ...rwcdsForm.dcp_package,
        dcp_rwcdsform: {
          ...rwcdsForm,
        },
        project: dcp_project,
        documents: documents.map(document => ({
          name: document['Name'],
          timeCreated: document['TimeCreated'],
          serverRelativeUrl: document['ServerRelativeUrl'],
        })),
      };
    } else {
      throw new HttpException({
        "code": "INVALID_PACKAGE_TYPE",
        "message": 'Requested package has invalid type.',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
