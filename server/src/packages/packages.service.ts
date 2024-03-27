import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CrmService } from '../crm/crm.service';
import { PasFormService } from './pas-form/pas-form.service';
import { pick } from 'underscore';
import { ArtifactService } from '../artifacts/artifacts.service';
import { RwcdsFormService } from './rwcds-form/rwcds-form.service';
import { LanduseFormService } from './landuse-form/landuse-form.service';
import { PACKAGE_ATTRS } from './packages.attrs';
import { PROJECT_ATTRS } from '../projects/projects.attrs';
import {
  SharepointFolderFilesGraph,
  SharepointService,
} from '../sharepoint/sharepoint.service';
import { ConfigService } from '../config/config.service';

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
  POST_CERT_LU: {
    code: 717170015,
    label: 'Post-Cert LU',
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
};

@Injectable()
export class PackagesService {
  rerFiletypeUuid = '';

  constructor(
    private readonly artifactService: ArtifactService,
    private readonly crmService: CrmService,
    private readonly pasFormService: PasFormService,
    private readonly rwcdsFormService: RwcdsFormService,
    private readonly landuseFormService: LanduseFormService,
    private readonly sharepointService: SharepointService,
    private readonly config: ConfigService,
  ) {
    this.rerFiletypeUuid = this.config.get('RER_FILETYPE_UUID');
  }

  // this is starting to do way more than get a package. It gets a package, gets related
  // forms, detects the form type, includes that form with the payload, includes additional
  // munging that's specific to the form, and also includes attached documents.
  async getPackage(packageId) {
    console.log('packageId', packageId);
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
      const {
        records: [firstPackage],
      }: {
        records: Array<{
          dcp_project: {
            artifact?: unknown;
            dcp_projectid: string;
          };
          dcp_packagetype: number;
          dcp_package_SharePointDocumentLocations:
            | Array<{
                relativeurl: string | null;
              }>
            | undefined;
        }>;
      } = await this.crmService.get(
        'dcp_packages',
        `
        $select=${PACKAGE_ATTRS.join(',')}
        &$filter=dcp_packageid eq ${packageId}
        &$expand=dcp_project($select=${PROJECT_ATTRS.join(',')}),dcp_package_dcp_ceqrinvoicequestionnaire_Package,dcp_package_SharePointDocumentLocations
      `,
      );
      // console.debug('first package', firstPackage);
      console.debug('first package', firstPackage);

      if (!firstPackage) {
        throw new HttpException(
          {
            code: 'PACKAGE_NOT_FOUND',
            title: 'Package not found',
            detail: 'Package not found for given ID',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const {
        dcp_project,
        dcp_package_SharePointDocumentLocations: documentLocations,
      } = firstPackage;

      let documents: Array<SharepointFolderFilesGraph> = [];

      if (documentLocations && documentLocations.length > 0) {
        // drive-by redefine because the sharepoint lookup
        // is failing for some reason and we don't want it
        // to take the entire system down with it.
        //
        // TODO: Why does it need to be this? We should check to see if this is still
        // flakey given current configuration
        documents = await this.getPackageSharepointDocuments(
          documentLocations[0],
        );
      }

      let formData = {};

      if (
        firstPackage.dcp_packagetype ===
          PACKAGE_TYPE_OPTIONSET['PAS_PACKAGE'].code ||
        firstPackage.dcp_packagetype === PACKAGE_TYPE_OPTIONSET['RWCDS'].code ||
        firstPackage.dcp_packagetype ===
          PACKAGE_TYPE_OPTIONSET['DRAFT_LU_PACKAGE'].code ||
        firstPackage.dcp_packagetype ===
          PACKAGE_TYPE_OPTIONSET['FILED_LU_PACKAGE'].code ||
        firstPackage.dcp_packagetype ===
          PACKAGE_TYPE_OPTIONSET['POST_CERT_LU'].code
      ) {
        formData = await this.fetchPackageForm(firstPackage);
      }

      // below query filters by Racial Equity Report file type.
      const { records: projectArtifacts } = await this.crmService.get(
        'dcp_artifactses',
        `
        $filter=
          _dcp_project_value eq ${dcp_project.dcp_projectid}
          and (
            _dcp_applicantfiletype_value eq '${this.rerFiletypeUuid}'
          )
        `,
      );

      let firstArtifactWithDocuments = {};

      if (projectArtifacts.length < 1) {
        // TODO: Consider reducing this side effecct in this GET endpoint
        firstArtifactWithDocuments =
          await this.artifactService.createEquityReport(
            dcp_project.dcp_projectid,
          );
      } else {
        firstArtifactWithDocuments = projectArtifacts[0];
      }

      try {
        firstArtifactWithDocuments =
          await this.artifactService.artifactWithDocuments(
            firstArtifactWithDocuments,
          );
      } catch (e) {
        console.log('firstArtifactWithDocuments error', e);
      }

      dcp_project.artifact = firstArtifactWithDocuments;

      return {
        ...firstPackage,
        ...formData,

        project: dcp_project,
        documents: documents.map((document) => ({
          name: document.name,
          timeCreated: document.createdDateTime,
          // serverRelativeUrl: document.webUrl.replace(
          //   `https://${this.config.get('SHAREPOINT_TARGET_HOST')}`,
          //   '',
          // ),
          serverRelativeUrl: `/${document.id}`,
        })),
      };
    } catch (e) {
      // relay lower-level exceptions, like from crmServce.get(),
      // or sharepoint document retrieval.
      console.log('Error retrieving package in getPackage', e);
      if (e instanceof HttpException) {
        console.log('Error retrieving package in getPackage HttpException', e);
        throw e;
      } else {
        throw new HttpException(
          {
            code: 'LOAD_PACKAGE_FAILED',
            title: 'Could not load package',
            detail: `An unknown error occured while loading package ${packageId}`,
          },
          HttpStatus.NOT_FOUND,
        );
      }
    }
  }

  // packages have a dcp_packagetype which indicates the type of form it will have
  async fetchPackageForm(dcpPackage) {
    try {
      if (
        dcpPackage.dcp_packagetype ===
        PACKAGE_TYPE_OPTIONSET['PAS_PACKAGE'].code
      ) {
        return {
          dcp_pasform: await this.pasFormService.find(
            dcpPackage._dcp_pasform_value,
          ),
        };
      }

      if (dcpPackage.dcp_packagetype === PACKAGE_TYPE_OPTIONSET['RWCDS'].code) {
        return {
          dcp_rwcdsform: await this.rwcdsFormService.find(
            dcpPackage._dcp_rwcdsform_value,
          ),
        };
      }

      if (
        dcpPackage.dcp_packagetype ===
          PACKAGE_TYPE_OPTIONSET['DRAFT_LU_PACKAGE'].code ||
        dcpPackage.dcp_packagetype ===
          PACKAGE_TYPE_OPTIONSET['FILED_LU_PACKAGE'].code ||
        dcpPackage.dcp_packagetype ===
          PACKAGE_TYPE_OPTIONSET['POST_CERT_LU'].code
      ) {
        return {
          dcp_landuse: await this.landuseFormService.find(
            dcpPackage._dcp_landuseapplication_value,
          ),
        };
      }

      throw new HttpException(
        {
          code: 'INVALID_PACKAGE_TYPE',
          title: 'Invalid package type',
          detail: 'Requested package has invalid type.',
        },
        HttpStatus.BAD_REQUEST,
      );
    } catch (e) {
      console.log('fetchPackageForm error', e);
      if (e instanceof HttpException) {
        console.log('fetchPackageForm HttpException error', e);
        throw e;
      } else {
        throw new HttpException(
          {
            code: 'PACKAGE_FORM_ERROR',
            title: 'Error loading package forms',
            detail: `Error while acquiring ${dcpPackage} forms attached to the package ${dcpPackage.dcp_packageid}`,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async update(id, body) {
    const allowedAttrs = pick(body, PACKAGE_ATTRS);

    return this.crmService.update('dcp_packages', id, allowedAttrs);
  }

  /**
   * @param        packageDocumentLocation   a Document Location object.
   * This is an one element acquired from the `dcp_package_SharePointDocumentLocations`
   * Navigation property array on a Package entity.
   * @return          Array of 0 or more Document objects
   */
  async getPackageSharepointDocuments(packageDocumentLocation: {
    relativeurl: string | null;
  }) {
    // relativeurl is the path url "relative to the entity".
    // In essence it is the Sharepoint folder name.
    // e.g. P2015K0223_Draft Land Use_3
    const { relativeurl: relativeUrl } = packageDocumentLocation;

    const packageDriveId = this.config.get('SHAREPOINT_PACKAGE_ID_GRAPH');
    if (relativeUrl && packageDriveId !== undefined) {
      try {
        const { value: documents } =
          await this.sharepointService.getSharepointFolderFiles(
            packageDriveId,
            relativeUrl,
          );

        return documents;
      } catch (e) {
        // Relay errors from crmService
        if (e instanceof HttpException) {
          throw e;
        } else {
          throw new HttpException(
            {
              code: 'SHAREPOINT_FOLDER_ERROR',
              title: 'Bad Sharepoint folder lookup',
              detail: `An error occured while constructing and looking up folder for package. Perhaps the package name or id is wrong.`,
              meta: {
                relativeUrl,
              },
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    }

    return [];
  }
}
