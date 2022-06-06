import {
  Injectable,
  HttpStatus,
  HttpException
} from '@nestjs/common';

import { CrmService } from '../crm/crm.service';
import { SharepointService } from '../sharepoint/sharepoint.service';
import { ConfigService } from '../config/config.service';


@Injectable()
export class ArtifactService {
  rerFiletypeUuid = '';

  constructor(
    private readonly crmService: CrmService,
    private readonly sharepointService: SharepointService,
    private readonly config: ConfigService,
  ) {
    this.rerFiletypeUuid = this.config.get('RER_FILETYPE_UUID');
  }

  public async createEquityReport(projectId: string) {
    let newArtifact = null;

    try {
      newArtifact = this.crmService.create('dcp_artifactses', {
        dcp_name: `Racial Equity Report`,
        dcp_isdcpinternal: false,
        dcp_filecreator: 717170000, // Applicant
        dcp_filecategory: 717170006, // Other
        dcp_visibility: 717170002, // Applicant Only
        'dcp_applicantfiletype@odata.bind': `/dcp_filetypes(${this.rerFiletypeUuid})`,
        ...(projectId ? {  'dcp_project@odata.bind': `/dcp_projects(${projectId})` } : {})
      });
    } catch (e) {
      throw new HttpException({
        code: 'CREATE_RER_ERROR',
        title: `Unable to create Racial Equity Report dcp_artifactses entity for project with UUID ${projectId}`,
        detail: e
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return newArtifact;
  }

  async getArtifactSharepointDocuments(relativeUrl, dcp_name) {
    if (relativeUrl) {
      try {
        const documents = await this.sharepointService.getSharepointNestedFolderFiles(`dcp_artifacts/${relativeUrl}`, '?$expand=Files,Folders,Folders/Files,Folders/Folders/Files,Folders/Folders/Folders/Files');

        if (documents) {
          return documents.map(document => ({
            name: document['Name'],
            timeCreated: document['TimeCreated'],
            serverRelativeUrl: document['ServerRelativeUrl'],
          }));
        }

        return [];
      } catch (e) {
        if (e instanceof HttpException) {
          throw e;
        } else {
          const errorMessage = `An error occured while constructing and looking up folder for artifact. Perhaps the artifact name or id is wrong. ${JSON.stringify(e)}`;
          console.log(errorMessage);

          throw new HttpException({
            code: 'SHAREPOINT_FOLDER_ERROR',
            title: 'Bad Sharepoint folder lookup',
            detail: errorMessage,
            meta: {
              relativeUrl,
            }
          }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
    }

    console.log(`Warning: Tried to load documents for an Artifact but the "relativeUrl" argument was null. Artifact dcp_name is "${dcp_name}"`);

    return [];
  }

  /**
   * Injects associated documents into the given artifact
   *
   * @param      {Object{ dcp_name, dcp_artifactdocumentlocation }} CRM Artifact with
   *              dcp_name and dcp_artifactdocumentlocation properties
   * @return     {Object} The CRM Artifact with the 'documents' property hydrated,
   *              if associated documents exist in CRM.
   */
  public async artifactWithDocuments(projectArtifact: any) {
    // Unlike the package `dcp_package_SharePointDocumentLocations` property, the `dcp_artifactdocumentlocation`
    // property is a single-valued property, a string representing the absolute Sharepoint URL.
    // So we have to split the string to get the "relative URL" portion.
    const {
      dcp_name,
      dcp_artifactdocumentlocation,
    } = projectArtifact;

    if (dcp_artifactdocumentlocation) {
      try {
        // Example value for dcp_artifactdocumentlocation:
        // https://nyco365.sharepoint.com/sites/dcppfsuat2/dcp_artifacts/P2016K0021 - Area Map - 1_77A5253923FBE911A9BC001DD8308EF1

        return {
          ...projectArtifact,
          documents: await this.getArtifactSharepointDocuments(dcp_artifactdocumentlocation, dcp_name),
        };
      } catch (e) {
        const errorMessage = `Error loading documents for artifact ${dcp_name}. ${JSON.stringify(e)}`;
        console.log(errorMessage);

        throw new HttpException({
          "code": "ARTIFACT_WITH_DOCUMENTS",
          "title": "Artifact Documents Error",
          "detail": errorMessage,
        }, HttpStatus.NOT_FOUND);
      }
    }

    return {
      ...projectArtifact,
      documents: [],
    }
  }
}