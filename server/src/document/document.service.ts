import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { CrmService } from '../crm/crm.service';
import { SharepointService } from '../sharepoint/sharepoint.service';
import { ADAL } from '../_utils/adal';
import * as Request from 'request';


// This service currently provides utilities to write files and folders
// to Sharepoint via CRM. It uses fetchXML api and an undocumented
// /Upload endpoint on the agency's custom Dynamics CRM.
// Isolating this service allows us to eventually deprecate it
// in favor of the Sharepoint service.
@Injectable()
export class DocumentService {
  crmUrlPath = '';
  crmHost = '';
  host = '';

  constructor(
    private readonly config: ConfigService,
    private readonly crmService: CrmService,
    private readonly sharepointService: SharepointService,
  ){
    ADAL.ADAL_CONFIG = {
      CRMUrl: this.config.get('CRM_HOST'),
      webAPIurl: this.config.get('CRM_URL_PATH'),
      clientId: this.config.get('CLIENT_ID'),
      clientSecret: this.config.get('CLIENT_SECRET'),
      tenantId: this.config.get('TENANT_ID'),
      authorityHostUrl: this.config.get('AUTHORITY_HOST_URL'),
      tokenPath: this.config.get('TOKEN_PATH'),
    };

    this.crmUrlPath = this.config.get('CRM_URL_PATH');
    this.crmHost = this.config.get('CRM_HOST');
    this.host = `${this.crmHost}${this.crmUrlPath}`;
  } 

  _parseErrorMessage(json) {
    if (json) {
      if (json.error) {
        return json.error;
      }
      if (json._error) {
        return json._error;
      }
    }
    return "Error";
  }
  
   /**
   * Finds location id for folder for specific instance of an entity
   * @param { GUID } entityID - a 32 character id, in format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   * @param { string } folderName - Instance folder name, which usually has the format
   * '<entity.dcp_name>_<entity.dcp_[entity]id>'. Note that whitespace SHOULD NOT* be trimmed off of
   * dcp_name.
   * *Should not because we still need to more thoroughly verify this.
   * e.g. '2018Q0147 - Tax Map(s) - 1_D2A818330BF0E911A997001DD832112G'
  */
 async findDocumentLocation (entityID, folderName) {
  const fetchDocumentLocationXML = [
    `<fetch mapping="logical" distinct="true" top="1">`,
    `<entity name="sharepointdocumentlocation">`,
    `<attribute name="sharepointdocumentlocationid"/>`,
    `<filter type="and">`,
    `<condition attribute="regardingobjectid" operator="eq" value="${entityID}"/>`,
    `<condition attribute="locationtype" operator="eq" value="0"/>`,
    `<condition attribute="servicetype" operator="eq" value="0"/>`,
    `<condition attribute="relativeurl" operator="eq" value="${folderName}"/>`,
    `</filter>`,
    `</entity>`,
    `</fetch>`
  ].join('');

  return this.crmService.getWithXMLQuery('sharepointdocumentlocations', `${fetchDocumentLocationXML}`)
    .then((response:any) => {
      const documentLocations = response.value;
      if (documentLocations.length > 0) {
        return documentLocations[0];
      } else {
        return null;
      }
    })
  }

// Use to get ID of current CRM's corresponding sharepoint site ID,
// i.e. "sharepointSiteID" required in findEntityDocumentLocation()
async getParentSiteLocation() {
  const fetchParentSiteLocationIdXML = [
    `<fetch mapping="logical" distinct="false" top="1">`,
      `<entity name="sharepointsite">`,
        `<attribute name="name"/>`,
        `<attribute name="sitecollectionid"/>`,
        `<attribute name="isgridpresent"/>`,
        `<attribute name="absoluteurl"/>`,
        `<attribute name="isdefault"/>`,
        `<attribute name="folderstructureentity"/>`,
        `<filter type="and">`,
          `<condition attribute="isdefault" operator="eq" value="true"/>`,
          `<condition attribute="statecode" operator="eq" value="0"/>`,
        `</filter>`,
      `</entity>`,
    `</fetch>`
  ].join('');

  return this.crmService.getWithXMLQuery(`sharepointsites`, `${fetchParentSiteLocationIdXML}`)
    .then((response:any) => {
      const parentSiteLocations = response.value;
      if(parentSiteLocations.length > 0){
        return parentSiteLocations[0];
      }
      else{
        return null;
      }
    });
  } 

  /**
    * Finds folder for an entity (like `dcp_project` or `dcp_communityboarddisposition`).
    * Entity folders contain many instance folders, the paths of which can be
    * acquired instead via findDocumentLocation.
    * @param { GUID } entityName - name of CRM entity, like  `dcp_project` or `dcp_communityboarddisposition`.
    * @param { string } sharepointSiteID - ID of CRM's corresponding sharepoint site. Use getParentSiteLocation() to acquire this ID
  */
  async findEntityDocumentLocation (entityName, sharepointSiteID) {
    const fetchDocumentLocationXML = [
      `<fetch mapping="logical" distinct="true" top="1">`,
      `<entity name="sharepointdocumentlocation">`,
      `<attribute name="name"/>`,
      `<filter type="and">`,
      `<condition attribute="parentsiteorlocation" operator="eq" value="${sharepointSiteID}"/>`,
      `<condition attribute="locationtype" operator="eq" value="0"/>`,
      `<condition attribute="servicetype" operator="eq" value="0"/>`,
      `<condition attribute="relativeurl" operator="eq" value="${entityName}"/>`,
      `</filter>`,
      `</entity>`,
      `</fetch>`
    ].join('');

    return this.crmService.getWithXMLQuery(`sharepointdocumentlocations`, `${fetchDocumentLocationXML}`)
      .then((response:any) => {
        const documentLocations = response.value;
        if (documentLocations.length > 0) {
          return documentLocations[0];
        } else {
          return null;
        }
      });
    }

    async createDocumentLocation (locationName, absURL, folderName, sharepointSiteID, parentEntityReference, headers) {
      //  get token
      const JWToken = await ADAL.acquireToken();
  
      const options = {
        url: `${this.host}AddOrEditLocation`,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${JWToken}`,
          ...headers
        },
        body: JSON.stringify({
          "LocationName": locationName,
          "AbsUrl": absURL,
          "RelativePath": folderName,
          "ParentType": "sharepointsite",
          "ParentId": sharepointSiteID,
          "IsAddOrEditMode": true,
          "IsCreateFolder": true,
          "DocumentId": "",
          "ParentEntityReference": parentEntityReference,
        })
      };
  
      return new Promise((resolve, reject) => {
        Request.post(options, (error, response, body) => {
          if(body){
            try{
              const jsonBody = JSON.parse(body);
              if(jsonBody.error){
                reject(this._parseErrorMessage(jsonBody));
              }
              else{
                resolve(jsonBody.LocationId);
              }
            }catch(error){
              reject(body);
            }
          }
          else{
            reject("Didn't get LocationID");
          }
        });
      });
    }

  /**
   * @param { string } entityName - (required) Entity name like `dcp_project` or `dcp_communityboarddisposition`
   * @param { string } entityID - (required) a 32 character id, in format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   * @param { string } folderName - (required) name of folder for entity instance. e.g '2018Q0147 - Tax Map(s) - 1_D2A818330BF0E911A997001DD832112G'
   * This needs to be constructed by attaching the instance `dcp_name` to a formatted instance guid
   * (for projects, it is `dcp_projectid`; for dispositions, it is `dcp_communityboarddispositionid`).
   * @param { string } fileName - Desired name of the file.
   * @param { string } base64File - base64 encoded buffer
   * @param { Boolean } overwriteExisting - Whether to overwrite existing file
   * @param { Object } headers - Object with key-value pairs to attach to the POST header. Should include the MSCRMCallerID.
   * The `entityID` and `folderName` parameters can be acquired and constructed by making separate requests to the API.
   */
  async uploadDocument(entityName, entityID, folderName, fileName, base64File, overwriteExisting, headers) {
    folderName = folderName.replace(/^\~|\#|\%|\&|\*|\{|\}|\\|\:|\<|\>|\?|\/|\||\"/g, '');

    let docLocation = await this.findDocumentLocation(entityID, folderName);
    let docLocationID = null;

    if (!docLocation) {
      const parentSiteLocation = await this.getParentSiteLocation();
      if(!parentSiteLocation) throw new Error('Sharepoint Site Location not found');
      const sharepointSiteID = parentSiteLocation['sharepointsiteid'];
      const entityDocLocation = await this.findEntityDocumentLocation(entityName, sharepointSiteID);

      if(!entityDocLocation) throw new Error('Entity Document Location not found');
      const entityDocName = entityDocLocation.name;
      const absoluteURL = `${parentSiteLocation['absoluteurl']}/${entityName}/${folderName}`;
      const entityRef = {
        "@odata.type": "Microsoft.Dynamics.CRM." + entityName,
      };
      entityRef[entityName+"id"] = entityID;

      try {
        docLocationID = await this.createDocumentLocation(entityDocName, absoluteURL, folderName, sharepointSiteID, entityRef, headers);
      } catch (e) {
        console.log("Error:  ",  e);

        // If for some reason the folder already exists, archive it first. Then try creating document location one more time.
        if (e.message && e.message.includes("Record already present in db")) {
          await this.sharepointService.archiveSharepointFolder(`${entityName}/${folderName}`);

          docLocationID = await this.createDocumentLocation(entityDocName, absoluteURL, folderName, sharepointSiteID, entityRef, headers);
        }
      }
    } else {
      docLocationID = docLocation.sharepointdocumentlocationid;
    }

    //  get token
    const JWToken = await ADAL.acquireToken();

    const entityRef = {
      "@odata.type": "Microsoft.Dynamics.CRM." + entityName,
    };
    entityRef[entityName+"id"] = entityID;

    const options = {
        url: `${this.host}UploadDocument`,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: `Bearer ${JWToken}`,
            ...headers
        },
        body: JSON.stringify({
          "Content": base64File,
          "Entity": {
            "@odata.type": "Microsoft.Dynamics.CRM.sharepointdocument",
            "locationid": docLocationID,
            "title": fileName
          },
          "OverwriteExisting": overwriteExisting,
          "ParentEntityReference": entityRef,
          "FolderPath": ""
        })
    };

    return new Promise((resolve, reject) => {
      Request.post(options, (error, response, body) => {
        if (response.statusCode === 403) {
          resolve("Forbidden.");
        }
        if (response.statusCode === 204) {
          resolve("Uploaded document successfully.")
        }
        // If response body exists,
        // allow CRM error message to bubble up.
        if (body) {
          try {
            const jsonBody = JSON.parse(body);
            const parsedErrorMessage = this._parseErrorMessage(jsonBody);
            if (parsedErrorMessage) {
              // Nest was throwing server Errors on Promise.reject()?
              resolve(parsedErrorMessage);
            }
          } catch(error) {
            reject(body);
          }
        }
      });
    });
  }
}
