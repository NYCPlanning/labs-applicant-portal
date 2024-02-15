import { helper } from '@ember/component/helper';
// Register Option Sets by importing them and then adding
// an entry to the OPTIONSET_LOOKUP object.
import COMMON_OPTIONSETS, {
  YES_NO,
  YES_NO_UNSURE,
  YES_NO_UNSURE_SMALLINT,
  YES_NO_DONT_KNOW,
} from '../optionsets/common';
import APPLICANT_OPTIONSETS from '../optionsets/applicant';
import CONTACT_OPTIONSETS from '../optionsets/contact';
import BBL_OPTIONSETS from '../optionsets/bbl';
import {
  AFFECTED_ZONING_RESOLUTION_ACTION,
} from '../optionsets/affected-zoning-resolution';
import LANDUSE_ACTION_OPTIONSETS from '../optionsets/landuse-action';
import LANDUSE_GEOGRAPHY_OPTIONSETS from '../optionsets/landuse-geography';
import ZONING_MAP_CHANGE_OPTIONSETS from '../optionsets/zoning-map-change';
import PACKAGE_OPTIONSETS from '../optionsets/package';
import LANDUSE_FORM_OPTIONSETS from '../optionsets/landuse-form';
import {
  DCPCONSTRUCTIONPHASING,
} from '../optionsets/rwcds-form';
import {
  DCPLEGALSTREETFRONTAGE,
  DCPHOUSINGUNITTYPE,
} from '../optionsets/pas-form';
import PROJECT_OPTIONSETS from '../optionsets/project';
import {
  DCPAPPLICANTROLE,
} from '../optionsets/project-applicant';
import {
  CEQR_INVOICE_QUESTIONNAIRE_OPTIONSETS,
} from '../optionsets/ceqr-invoice-questionnaire';

const OPTIONSET_LOOKUP = {
  applicant: {
    dcpState: APPLICANT_OPTIONSETS.DCPSTATE,
    dcpType: APPLICANT_OPTIONSETS.DCPTYPE,
  },
  bbl: {
    boroughs: BBL_OPTIONSETS.BOROUGHS,
    dcpDevelopmentsite: YES_NO,
    dcpPartiallot: YES_NO,
  },
  projectApplicant: {
    applicantrole: DCPAPPLICANTROLE,
  },
  contact: {
    statuscode: CONTACT_OPTIONSETS.STATUSCODE,
    statecode: CONTACT_OPTIONSETS.STATECODE,
  },
  package: {
    statecode: PACKAGE_OPTIONSETS.STATECODE,
    statuscode: PACKAGE_OPTIONSETS.STATUSCODE,
    dcpVisibility: PACKAGE_OPTIONSETS.DCPVISIBILITY,
    dcpPackagetype: PACKAGE_OPTIONSETS.DCPPACKAGETYPE,
  },
  project: {
    dcpPublicstatus: PROJECT_OPTIONSETS.DCPPUBLICSTATUS,
    dcpVisibility: PROJECT_OPTIONSETS.DCPVISIBILITY,
    statuscode: PROJECT_OPTIONSETS.STATUSCODE,
    equityReportFields: YES_NO_UNSURE_SMALLINT,
  },
  landuseForm: {
    dcpOtherparties: YES_NO,
    dcpRelatedacquisition: YES_NO,
    dcpCeqrtype: LANDUSE_FORM_OPTIONSETS.CEQR_TYPE,
    dcpWholecity: YES_NO,
    dcpEntiretyboroughs: YES_NO,
    dcpEntiretycommunity: YES_NO,
    dcpNotaxblock: YES_NO,
    dcp500kpluszone: YES_NO,
    dcpDevsize: LANDUSE_FORM_OPTIONSETS.DCPDEVSIZE,
    dcpSitedatasiteisinnewyorkcity: YES_NO,
    dcpStateczm: YES_NO,
    dcpHistoricdistrict: YES_NO,
    dcpDesignation: LANDUSE_FORM_OPTIONSETS.DCPDESIGNATION,
    dcpDisposition: LANDUSE_FORM_OPTIONSETS.DCPDISPOSITION,
    dcpProjecthousingplanudaap: LANDUSE_FORM_OPTIONSETS.DCPPROJECTHOUSINGPLANUDAAP,
    dcpMannerofdisposition: LANDUSE_FORM_OPTIONSETS.DCPMANNEROFDISPOSITION,
    dcpRestrictionsandconditionsdispositiontab: LANDUSE_FORM_OPTIONSETS.DCPRESTRICTIONSANDCONDITIONSDISPOSITIONTAB,
    dcpOfficespaceleaseopt: COMMON_OPTIONSETS.YES_NO_INTEGER,
    dcpAcquisitionopt: COMMON_OPTIONSETS.YES_NO_INTEGER,
    dcpSiteselectionopt: COMMON_OPTIONSETS.YES_NO_INTEGER,
    dcpIndicatetypeoffacility: LANDUSE_FORM_OPTIONSETS.DCPINDICATETYPEOFFACILITY,
    dcpExistingfacilityproposedtoremainopt: COMMON_OPTIONSETS.YES_NO_INTEGER,
    dcpExistingfacilityproposedtoremainandexpand: COMMON_OPTIONSETS.YES_NO_INTEGER,
    dcpExistingfacilityreplacementinanewlocation: COMMON_OPTIONSETS.YES_NO_INTEGER,
    dcpNewfacilityopt: COMMON_OPTIONSETS.YES_NO_INTEGER,
    dcpIsprojectlistedinstatementofneedsopt: COMMON_OPTIONSETS.YES_NO_INTEGER,
    dcpDidboroughpresidentproposealternativesite: COMMON_OPTIONSETS.YES_NO_INTEGER,
    dcpLegalinstrument: COMMON_OPTIONSETS.YES_NO_UNSURE,
    dcpRelatedacquisitionofpropertyopt: COMMON_OPTIONSETS.YES_NO_INTEGER,
    dcpOnlychangetheeliminationofamappedbutunimp: LANDUSE_FORM_OPTIONSETS.DCPONLYCHANGETHEELIMINATIONOFAMAPPEDBUTUNIMP,
    dcpYesmappedbutunimprovedstreetelimated: COMMON_OPTIONSETS.YES_NO,
    dcpEstablishstreetopt: COMMON_OPTIONSETS.YES_NO_INTEGER,
    dcpEstablishparkopt: COMMON_OPTIONSETS.YES_NO_INTEGER,
    dcpEstablishpublicplaceopt: COMMON_OPTIONSETS.YES_NO_INTEGER,
    dcpEstablishgradeopt: COMMON_OPTIONSETS.YES_NO_INTEGER,
    dcpEstablisheasement: LANDUSE_FORM_OPTIONSETS.DCPEASEMENTS,
    dcpEliminatestreetopt: COMMON_OPTIONSETS.YES_NO_INTEGER,
    dcpEliminateparkopt: COMMON_OPTIONSETS.YES_NO_INTEGER,
    dcpEliminatepublicplaceopt: COMMON_OPTIONSETS.YES_NO_INTEGER,
    dcpEliminategradeopt: COMMON_OPTIONSETS.YES_NO_INTEGER,
    dcpEliminateeasement: LANDUSE_FORM_OPTIONSETS.DCPEASEMENTS,
    dcpChangestreetwidthopt: COMMON_OPTIONSETS.YES_NO_INTEGER,
    dcpChangestreetalignmentopt: COMMON_OPTIONSETS.YES_NO_INTEGER,
    dcpChangestreetgradeopt: COMMON_OPTIONSETS.YES_NO_INTEGER,
    dcpChangeeasement: LANDUSE_FORM_OPTIONSETS.DCPEASEMENTS,
    dcpTypedisposition: LANDUSE_FORM_OPTIONSETS.DCPTYPEDISPOSITION,
    dcpTotalzoningareatoberezoned: LANDUSE_FORM_OPTIONSETS.DCPTOTALZONINGAREATOBEREZONED,
    dcpHaurbandevelopmentactionareaudaap: COMMON_OPTIONSETS.YES_NO_PICKLIST_CODE,
    dcpHddispositionofurbanrenewalsite: COMMON_OPTIONSETS.YES_NO_PICKLIST_CODE,

  },
  rwcdsForm: {
    dcpHasprojectchangedsincesubmissionofthepas: YES_NO,
    dcpConstructionphasing: DCPCONSTRUCTIONPHASING,
    dcpExistingconditions: YES_NO,
    dcpIsrwcdsscenario: YES_NO,
    dcpIncludezoningtextamendment: YES_NO_DONT_KNOW,
    dcpIsplannigondevelopingaffordablehousing: YES_NO,
    dcpIsapplicantseekingaction: YES_NO_DONT_KNOW,
    dcpApplicantpursuetype2eligibility: YES_NO_UNSURE_SMALLINT,
  },
  pasForm: {
    dcpProposedprojectorportionconstruction: YES_NO_UNSURE,
    dcpUrbanrenewalarea: YES_NO_UNSURE,
    dcpLegalstreetfrontage: DCPLEGALSTREETFRONTAGE,
    dcpLanduseactiontype2: YES_NO_UNSURE,
    dcpProjectareaindustrialbusinesszone: YES_NO,
    dcpIsprojectarealandmark: YES_NO,
    dcpProjectareacoastalzonelocatedin: YES_NO,
    dcpProjectareaischancefloodplain: YES_NO_UNSURE,
    dcpRestrictivedeclaration: YES_NO,
    dcpRestrictivedeclarationrequired: YES_NO_UNSURE,
    dcpIsinclusionaryhousingdesignatedarea: YES_NO,
    dcpDiscressionaryfundingforffordablehousing: YES_NO_UNSURE,
    dcpHousingunittype: DCPHOUSINGUNITTYPE,
  },
  affectedZoningResolution: {
    actions: AFFECTED_ZONING_RESOLUTION_ACTION,
  },
  landuseAction: {
    dcpApplicantispublicagencyactions: YES_NO,
    dcpIstheactiontoauthorizeorpermitanopenuse: YES_NO,
    dcpIstheactiontoauthorizeacommercial: YES_NO,
    dcpIndicatewhetheractionisamodification: LANDUSE_ACTION_OPTIONSETS.DCPINDICATEWHETHERACTIONISAMODIFICATION,
    dcpModsubjectto197c: YES_NO,
    dcpPreviouslyapprovedactioncode: LANDUSE_ACTION_OPTIONSETS.DCPPREVIOUSLYAPPROVEDACTIONCODE,
    actions: AFFECTED_ZONING_RESOLUTION_ACTION,
  },
  sitedatahForm: {
    dcpSitetobedisposed: YES_NO,
  },
  landuseGeography: {
    dcpIsthesiteimprovedunimprovedorpartlyimp: LANDUSE_GEOGRAPHY_OPTIONSETS.DCPISTHESITEIMPROVEDUNIMPROVEDORPARTLYIMP,
  },
  zoningMapChange: {
    dcpExistingzoningdistrictvaluenew: ZONING_MAP_CHANGE_OPTIONSETS.DCPEXISTINGZONINGDISTRICTVALUE,
  },
  relatedAction: {
    // Actually a boolean field in CRM, not picklist
    dcpIscompletedaction: YES_NO,
  },
  ceqrInvoiceQuestionnaire: {
    dcpSquarefeet: CEQR_INVOICE_QUESTIONNAIRE_OPTIONSETS.SQUARE_FEET,
    dcpIsthesoleaapplicantagovtagency: COMMON_OPTIONSETS.YES_NO_PICKLIST_CODE,
    dcpProjectspolelyconsistactionsnotmeasurable: COMMON_OPTIONSETS.YES_NO_PICKLIST_CODE,
    dcpProjectmodificationtoapreviousapproval: COMMON_OPTIONSETS.YES_NO_PICKLIST_CODE,
    dcpRespectivedecrequired: COMMON_OPTIONSETS.YES_NO,
  },
};

/**
 * Use this helper in templates to retrieve optionsets and their values.
 * See ./helpers.md for full API examples.
 *
 * @param      {string}  model     name of a model with Optionset properties
 * @param      {string}  optionsetId   the optionset identifier. Usually very
 * similar to the property with an optionset. For example, for package statecode,
 * the optionsetId is 'state'.
 * @param      {string}  returnType   'list', 'label' or 'code'. Indicate
 * whether you want the helper to return a list, label or code.
 * @param      {string}  lookupToken   To look up a code, pass a label. To look
 * up a label, pass a code. You can also pass an "identifier" for either a code
 * or label lookup. The identifier is the key to each option in an optionset.
 * @return     {string, number, array or Object}
 */
export function optionset([model, optionsetId, returnType, lookupToken]) {
  const optionset = OPTIONSET_LOOKUP[model][optionsetId];
  const optionById = optionset[lookupToken];
  let option;

  switch (returnType) {
    case 'list':
      return Object.values(optionset);
    case 'code':
      if (optionById) {
        return optionById.code;
      }

      option = Object.values(optionset).findBy('label', lookupToken);

      if (option) {
        return option.code;
      }
      console.log(`Warning: Unable to lookup code for optionset ${optionsetId} (model is '${model})' using token '${lookupToken}'`); // eslint-disable-line
      break;
    case 'label':
      if (optionById) {
        return optionById.label;
      }

      option = Object.values(optionset).findBy('code', lookupToken);

      if (option) {
        return option.label;
      }
      console.log(`Warning: Unable to lookup label for optionset ${optionsetId} (model is '${model}) using token '${lookupToken}'`); // eslint-disable-linent-disable-line
      break;
    default:
      return optionset;
  }
  return undefined;
}

export default helper(optionset);
