import { helper } from '@ember/component/helper';
// Register Option Sets by importing them and then adding
// an entry to the OPTIONSET_LOOKUP object.
import {
  STATE_OPTIONSET,
} from '../optionsets/applicant';
import {
  BOROUGHS_OPTIONSET,
} from '../optionsets/bbl';
import {
  AFFECTED_ZONING_RESOLUTION_ACTION_OPTIONSET,
} from '../optionsets/affected-zoning-resolution';
import {
  PACKAGE_STATE_OPTIONSET,
  PACKAGE_STATUS_OPTIONSET,
  PACKAGE_VISIBILITY_OPTIONSET,
  PACKAGE_TYPE_OPTIONSET,
} from '../optionsets/package';
import {
  DCPHASPROJECTCHANGEDSINCESUBMISSIONOFTHEPAS_OPTIONSET,
  DCPCONSTRUCTIONPHASING_OPTIONSET,
  DCPEXISTINGCONDITIONS_OPTIONSET,
  DCPISRWCDSSCENARIO_OPTIONSET,

} from '../models/rwcds-form';
import {
  YES_NO_UNSURE_OPTIONSET,
  DCPLEGALSTREETFRONTAGE_OPTIONSET,
  DCPHOUSINGUNITTYPE_OPTIONSET,
} from '../models/pas-form';
import { DCPPUBLICSTATUS_OPTIONSET } from '../optionsets/project';

const OPTIONSET_LOOKUP = {
  applicant: {
    state: STATE_OPTIONSET,
  },
  bbl: {
    boroughs: BOROUGHS_OPTIONSET,
  },
  package: {
    state: PACKAGE_STATE_OPTIONSET,
    status: PACKAGE_STATUS_OPTIONSET,
    visibility: PACKAGE_VISIBILITY_OPTIONSET,
    type: PACKAGE_TYPE_OPTIONSET,
  },
  project: {
    dcpPublicstatus: DCPPUBLICSTATUS_OPTIONSET,
  },
  rwcdsForm: {
    dcpHasprojectchangedsincesubmissionofthepas: DCPHASPROJECTCHANGEDSINCESUBMISSIONOFTHEPAS_OPTIONSET,
    dcpConstructionphasing: DCPCONSTRUCTIONPHASING_OPTIONSET,
    dcpExistingconditions: DCPEXISTINGCONDITIONS_OPTIONSET,
    dcpIsrwcdsscenario: DCPISRWCDSSCENARIO_OPTIONSET,
  },
  pasForm: {
    dcpProposedprojectorportionconstruction: YES_NO_UNSURE_OPTIONSET,
    dcpUrbanrenewalarea: YES_NO_UNSURE_OPTIONSET,
    dcpLegalstreetfrontage: DCPLEGALSTREETFRONTAGE_OPTIONSET,
    dcpLanduseactiontype2: YES_NO_UNSURE_OPTIONSET,
    dcpProjectareaischancefloodplain: YES_NO_UNSURE_OPTIONSET,
    dcpRestrictivedeclarationrequired: YES_NO_UNSURE_OPTIONSET,
    dcpDiscressionaryfundingforffordablehousing: YES_NO_UNSURE_OPTIONSET,
    dcpHousingunittype: DCPHOUSINGUNITTYPE_OPTIONSET,
  },
  affectedZoningResolution: {
    actions: AFFECTED_ZONING_RESOLUTION_ACTION_OPTIONSET,
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
