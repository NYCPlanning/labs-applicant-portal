import { helper } from '@ember/component/helper';
// Register Option Sets by importing them and then adding
// an entry to the OPTIONSET_LOOKUP object.
import {
  STATE_OPTIONSET,
} from '../models/applicant';
import {
  BOROUGHS_OPTIONSET,
} from '../models/bbl';
import {
  PACKAGE_STATE_OPTIONSET,
  PACKAGE_STATUS_OPTIONSET,
  PACKAGE_VISIBILITY_OPTIONSET,
} from '../models/package';
import {
  DCPHASPROJECTCHANGEDSINCESUBMISSIONOFTHEPAS_OPTIONSET,
  DCPCONSTRUCTIONPHASING_OPTIONSET,
} from '../models/rwcds-form';

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
  },
  rwcdsForm: {
    dcpHasprojectchangedsincesubmissionofthepas: DCPHASPROJECTCHANGEDSINCESUBMISSIONOFTHEPAS_OPTIONSET,
    dcpConstructionphasing: DCPCONSTRUCTIONPHASING_OPTIONSET,
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
export default helper(function optionset([model, optionsetId, returnType, lookupToken]) {
  const optionset = OPTIONSET_LOOKUP[model][optionsetId];

  switch (returnType) {
    case 'list':
      return Object.values(optionset);
    case 'code':
      if (lookupToken) {
        const optionById = optionset[lookupToken];

        if (optionById) {
          return optionById.code;
        }

        const optionByLabel = Object.values(optionset).findBy('label', lookupToken);

        if (optionByLabel) {
          return optionByLabel.code;
        }
      }
      console.assert(false, 'Invalid call to optionset helper: must provide a valid identifier or label to look up a code.');
      break;
    case 'label':
      if (lookupToken) {
        const optionById = optionset[lookupToken];

        if (optionById) {
          return optionById.label;
        }

        const optionByCode = Object.values(optionset).findBy('code', lookupToken);

        if (optionByCode) {
          return optionByCode.label;
        }
      }
      console.assert(false, 'Invalid call to optionset helper: must provide a valid identifier or code to look up a label.');
      break;
    default:
      return optionset;
  }
});
