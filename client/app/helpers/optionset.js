import { helper } from '@ember/component/helper';
// Register Option Sets by importing them and then adding
// an entry to the OPTIONSET_LOOKUP object.
import {
  YES_NO,
  YES_NO_UNSURE,
  YES_NO_DONT_KNOW,
} from '../optionsets/common';
import APPLICANT_OPTIONSETS from '../optionsets/applicant';
import CONTACT_OPTIONSETS from '../optionsets/contact';
import {
  BOROUGHS,
} from '../optionsets/bbl';
import {
  AFFECTED_ZONING_RESOLUTION_ACTION,
} from '../optionsets/affected-zoning-resolution';
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

const OPTIONSET_LOOKUP = {
  applicant: {
    dcpState: APPLICANT_OPTIONSETS.DCPSTATE,
    dcpType: APPLICANT_OPTIONSETS.DCPTYPE,
  },
  bbl: {
    boroughs: BOROUGHS,
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
  },
  landuseForm: {
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
    dcpRestrictandcondition: LANDUSE_FORM_OPTIONSETS.DCPRESTRICTANDCONDITION,
  },
  rwcdsForm: {
    dcpHasprojectchangedsincesubmissionofthepas: YES_NO,
    dcpConstructionphasing: DCPCONSTRUCTIONPHASING,
    dcpExistingconditions: YES_NO,
    dcpIsrwcdsscenario: YES_NO,
    dcpIncludezoningtextamendment: YES_NO_DONT_KNOW,
    dcpIsplannigondevelopingaffordablehousing: YES_NO,
    dcpIsapplicantseekingaction: YES_NO_DONT_KNOW,
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
      console.assert(false, 'Invalid call to optionset helper: must provide a valid identifier or label to look up a code.'); // eslint-disable-line
      break;
    case 'label':
      if (optionById) {
        return optionById.label;
      }

      option = Object.values(optionset).findBy('code', lookupToken);

      if (option) {
        return option.label;
      }
      console.assert(false, `Invalid call to optionset helper with identifier ${lookupToken}: must provide a valid identifier or code to look up a label.`); // eslint-disable-line
      break;
    default:
      return optionset;
  }
  return undefined;
}

export default helper(optionset);
